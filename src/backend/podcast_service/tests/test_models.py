"""
Unit tests for Podcast and Episode models.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Ensures the correctness of Podcast and Episode models by testing their fields,
  relationships, and constraints.

Human Tasks:
1. Configure test database with appropriate settings for file storage
2. Ensure test environment has sufficient permissions for file operations
3. Set up test data fixtures if needed for more comprehensive testing
4. Review and update test cases when model schema changes
"""

# django.test v4.2+
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

# Internal imports with relative paths
from ..models import Podcast, Episode
from ...common.exceptions import ValidationError, FileSizeLimitExceeded
from ...common.constants import SUPPORTED_AUDIO_FORMATS, MAX_AUDIO_FILE_SIZE_MB

class TestPodcastModels(TestCase):
    """Test suite for Podcast and Episode models."""

    def setUp(self):
        """Set up test data."""
        self.podcast_data = {
            'title': 'Test Podcast',
            'description': 'A test podcast description'
        }
        self.podcast = Podcast.objects.create(**self.podcast_data)

        # Create a mock audio file for testing
        self.audio_content = b'mock audio content'
        self.audio_file = SimpleUploadedFile(
            'test_episode.mp3',
            self.audio_content,
            content_type='audio/mpeg'
        )

        self.episode_data = {
            'podcast': self.podcast,
            'title': 'Test Episode',
            'audio_file': self.audio_file,
            'duration': 300  # 5 minutes in seconds
        }

    def tearDown(self):
        """Clean up test data."""
        # Clean up uploaded files
        for episode in Episode.objects.all():
            if episode.audio_file:
                episode.audio_file.delete()

    def test_podcast_model_fields(self):
        """Test the fields of the Podcast model."""
        # Test field values
        self.assertEqual(self.podcast.title, self.podcast_data['title'])
        self.assertEqual(self.podcast.description, self.podcast_data['description'])

        # Test auto-populated fields
        self.assertIsNotNone(self.podcast.created_at)
        self.assertIsNotNone(self.podcast.updated_at)

        # Test string representation
        self.assertEqual(str(self.podcast), self.podcast_data['title'])

        # Test validation
        invalid_podcast = Podcast(title='', description='')
        with self.assertRaises(ValidationError):
            invalid_podcast.clean()

    def test_episode_model_fields(self):
        """Test the fields of the Episode model."""
        episode = Episode.objects.create(**self.episode_data)

        # Test field values
        self.assertEqual(episode.title, self.episode_data['title'])
        self.assertEqual(episode.duration, self.episode_data['duration'])
        self.assertTrue(episode.audio_file.name.endswith('.mp3'))

        # Test auto-populated fields
        self.assertIsNotNone(episode.created_at)
        self.assertIsNotNone(episode.updated_at)

        # Test string representation
        expected_str = f"{self.podcast_data['title']} - {self.episode_data['title']}"
        self.assertEqual(str(episode), expected_str)

        # Test validation
        invalid_episode = Episode(
            podcast=self.podcast,
            title='',
            duration=0
        )
        with self.assertRaises(ValidationError):
            invalid_episode.clean()

    def test_episode_podcast_relationship(self):
        """Test the foreign key relationship between Episode and Podcast models."""
        episode = Episode.objects.create(**self.episode_data)

        # Test relationship from episode to podcast
        self.assertEqual(episode.podcast, self.podcast)

        # Test reverse relationship from podcast to episodes
        self.assertEqual(self.podcast.episodes.count(), 1)
        self.assertEqual(self.podcast.episodes.first(), episode)

        # Test cascade delete
        self.podcast.delete()
        self.assertEqual(Episode.objects.filter(id=episode.id).count(), 0)

    def test_audio_file_validation(self):
        """Test audio file validation for supported formats and size limits."""
        # Test unsupported format
        invalid_audio = SimpleUploadedFile(
            'test.txt',
            b'invalid audio content',
            content_type='text/plain'
        )
        invalid_episode = Episode(
            podcast=self.podcast,
            title='Invalid Format Test',
            audio_file=invalid_audio,
            duration=300
        )
        with self.assertRaises(ValidationError):
            invalid_episode.full_clean()

        # Test file size limit
        large_content = b'0' * (MAX_AUDIO_FILE_SIZE_MB * 1024 * 1024 + 1)
        large_file = SimpleUploadedFile(
            'large_file.mp3',
            large_content,
            content_type='audio/mpeg'
        )
        large_episode = Episode(
            podcast=self.podcast,
            title='Large File Test',
            audio_file=large_file,
            duration=300
        )
        with self.assertRaises(FileSizeLimitExceeded):
            large_episode.full_clean()

    def test_episode_duration_validation(self):
        """Test validation of episode duration."""
        # Test negative duration
        invalid_episode = Episode(
            podcast=self.podcast,
            title='Invalid Duration Test',
            audio_file=self.audio_file,
            duration=-1
        )
        with self.assertRaises(ValidationError):
            invalid_episode.clean()

        # Test zero duration
        invalid_episode.duration = 0
        with self.assertRaises(ValidationError):
            invalid_episode.clean()

        # Test valid duration
        valid_episode = Episode(
            podcast=self.podcast,
            title='Valid Duration Test',
            audio_file=self.audio_file,
            duration=1
        )
        try:
            valid_episode.clean()
        except ValidationError:
            self.fail("ValidationError raised for valid duration")