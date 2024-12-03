"""
Unit tests for podcast service views, ensuring API endpoints function correctly.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Ensures that the API endpoints for managing podcasts and episodes are tested for correctness.
- API Design (8.3 API Design/8.3.2 Interface Specifications):
  Validates the implementation of RESTful API endpoints for podcast and episode management.

Human Tasks:
1. Configure test database settings in Django settings
2. Set up test media storage for file uploads
3. Review test coverage requirements
4. Verify test data matches production data format
"""

# rest_framework v3.14+
from rest_framework.test import APITestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
import os
import json

# Internal imports with relative paths
from ...podcast_service.views import PodcastView, EpisodeView
from ...podcast_service.models import Podcast, Episode
from ...podcast_service.serializers import PodcastSerializer, EpisodeSerializer
from ...common.exceptions import ValidationError

class TestPodcastViews(APITestCase):
    """Test cases for podcast-related API endpoints."""

    def setUp(self):
        """Set up test data before each test case."""
        self.podcast_data = {
            'title': 'Test Podcast',
            'description': 'A test podcast description'
        }
        self.podcast = Podcast.objects.create(**self.podcast_data)

    def test_get_podcasts(self):
        """
        Test retrieving the list of podcasts.

        Requirements Addressed:
        - API Design: Validates GET endpoint for podcast retrieval
        """
        # Generate URL for podcast list endpoint
        url = reverse('podcast-list')

        # Send GET request
        response = self.client.get(url)

        # Assert response status and data
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.podcast_data['title'])
        self.assertEqual(response.data[0]['description'], self.podcast_data['description'])

    def test_get_podcast_detail(self):
        """
        Test retrieving a specific podcast by ID.

        Requirements Addressed:
        - API Design: Validates GET endpoint for single podcast retrieval
        """
        # Generate URL for podcast detail endpoint
        url = reverse('podcast-detail', kwargs={'podcast_id': self.podcast.id})

        # Send GET request
        response = self.client.get(url)

        # Assert response status and data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.podcast_data['title'])
        self.assertEqual(response.data['description'], self.podcast_data['description'])

    def test_create_podcast(self):
        """
        Test creating a new podcast.

        Requirements Addressed:
        - Podcast Management: Validates podcast creation functionality
        - API Design: Validates POST endpoint for podcast creation
        """
        # Generate URL for podcast creation endpoint
        url = reverse('podcast-list')

        new_podcast_data = {
            'title': 'New Test Podcast',
            'description': 'A new test podcast description'
        }

        # Send POST request
        response = self.client.post(url, new_podcast_data, format='json')

        # Assert response status and data
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], new_podcast_data['title'])
        self.assertEqual(response.data['description'], new_podcast_data['description'])
        self.assertTrue(Podcast.objects.filter(title=new_podcast_data['title']).exists())

    def test_create_podcast_invalid_data(self):
        """
        Test creating a podcast with invalid data.

        Requirements Addressed:
        - API Design: Validates error handling for invalid podcast creation requests
        """
        # Generate URL for podcast creation endpoint
        url = reverse('podcast-list')

        invalid_data = {
            'title': '',  # Empty title should be invalid
            'description': 'Test description'
        }

        # Send POST request
        response = self.client.post(url, invalid_data, format='json')

        # Assert response status and error message
        self.assertEqual(response.status_code, 400)
        self.assertIn('title', response.data)

class TestEpisodeViews(APITestCase):
    """Test cases for episode-related API endpoints."""

    def setUp(self):
        """Set up test data before each test case."""
        # Create test podcast
        self.podcast = Podcast.objects.create(
            title='Test Podcast',
            description='Test podcast description'
        )

        # Create test audio file
        self.audio_file = SimpleUploadedFile(
            "test_audio.mp3",
            b"test audio content",
            content_type="audio/mpeg"
        )

        # Create test episode
        self.episode = Episode.objects.create(
            podcast=self.podcast,
            title='Test Episode',
            audio_file=self.audio_file,
            duration=300  # 5 minutes in seconds
        )

    def tearDown(self):
        """Clean up test data after each test case."""
        # Remove test audio file if it exists
        if self.episode.audio_file and os.path.exists(self.episode.audio_file.path):
            os.remove(self.episode.audio_file.path)

    def test_get_episodes(self):
        """
        Test retrieving the list of episodes.

        Requirements Addressed:
        - API Design: Validates GET endpoint for episode retrieval
        """
        # Generate URL for episode list endpoint
        url = reverse('episode-list')

        # Send GET request
        response = self.client.get(url)

        # Assert response status and data
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Episode')
        self.assertEqual(response.data[0]['podcast'], self.podcast.id)

    def test_get_episode_detail(self):
        """
        Test retrieving a specific episode by ID.

        Requirements Addressed:
        - API Design: Validates GET endpoint for single episode retrieval
        """
        # Generate URL for episode detail endpoint
        url = reverse('episode-detail', kwargs={'episode_id': self.episode.id})

        # Send GET request
        response = self.client.get(url)

        # Assert response status and data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Test Episode')
        self.assertEqual(response.data['podcast'], self.podcast.id)

    def test_create_episode(self):
        """
        Test creating a new episode.

        Requirements Addressed:
        - Podcast Management: Validates episode creation functionality
        - API Design: Validates POST endpoint for episode creation
        """
        # Generate URL for episode creation endpoint
        url = reverse('episode-list')

        # Create test audio file for new episode
        new_audio_file = SimpleUploadedFile(
            "new_test_audio.mp3",
            b"new test audio content",
            content_type="audio/mpeg"
        )

        # Prepare episode data
        episode_data = {
            'podcast': self.podcast.id,
            'title': 'New Test Episode',
            'audio_file': new_audio_file,
            'duration': 600  # 10 minutes in seconds
        }

        # Send POST request
        response = self.client.post(url, episode_data, format='multipart')

        # Assert response status and data
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], episode_data['title'])
        self.assertEqual(response.data['podcast'], episode_data['podcast'])
        self.assertTrue(Episode.objects.filter(title=episode_data['title']).exists())

    def test_create_episode_invalid_data(self):
        """
        Test creating an episode with invalid data.

        Requirements Addressed:
        - API Design: Validates error handling for invalid episode creation requests
        """
        # Generate URL for episode creation endpoint
        url = reverse('episode-list')

        # Prepare invalid episode data (missing audio file)
        invalid_data = {
            'podcast': self.podcast.id,
            'title': 'Invalid Test Episode',
            'duration': 300
        }

        # Send POST request
        response = self.client.post(url, invalid_data, format='multipart')

        # Assert response status and error message
        self.assertEqual(response.status_code, 400)
        self.assertIn('audio_file', response.data)

    def test_create_episode_invalid_audio_format(self):
        """
        Test creating an episode with an invalid audio file format.

        Requirements Addressed:
        - Podcast Management: Validates audio file format validation
        - API Design: Validates error handling for invalid file uploads
        """
        # Generate URL for episode creation endpoint
        url = reverse('episode-list')

        # Create invalid audio file (wrong format)
        invalid_audio_file = SimpleUploadedFile(
            "test_audio.txt",
            b"invalid audio content",
            content_type="text/plain"
        )

        # Prepare episode data with invalid audio file
        episode_data = {
            'podcast': self.podcast.id,
            'title': 'Invalid Format Episode',
            'audio_file': invalid_audio_file,
            'duration': 300
        }

        # Send POST request
        response = self.client.post(url, episode_data, format='multipart')

        # Assert response status and error message
        self.assertEqual(response.status_code, 400)
        self.assertIn('audio_file', response.data)