"""
Unit tests for AI service models.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Tests the functionality and data integrity of AI-driven transcription and content generation models.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Validates the TranscriptionTask model's ability to handle audio file transcription.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Ensures the ContentGenerationTask model correctly handles content generation tasks.

Human Tasks:
1. Ensure test audio files are available in the test fixtures directory
2. Verify that environment variables for AI services are properly configured in test environment
3. Review and adjust test timeouts based on AI service response times
4. Configure test database with appropriate permissions for AI service operations
"""

from django.test import TestCase  # Django built-in
from src.backend.ai_service.models import TranscriptionTask, ContentGenerationTask
from src.backend.common.exceptions import ValidationError
import uuid
import os

class TestTranscriptionTask(TestCase):
    """Test suite for TranscriptionTask model."""

    def setUp(self):
        """Set up test environment before each test case."""
        self.valid_audio_path = "test_fixtures/sample_audio.mp3"
        self.invalid_audio_path = "test_fixtures/nonexistent.mp3"
        
        # Create a test audio file if it doesn't exist
        if not os.path.exists(self.valid_audio_path):
            os.makedirs(os.path.dirname(self.valid_audio_path), exist_ok=True)
            with open(self.valid_audio_path, 'w') as f:
                f.write("Test audio content")

    def tearDown(self):
        """Clean up test environment after each test case."""
        if os.path.exists(self.valid_audio_path):
            os.remove(self.valid_audio_path)

    def test_transcription_task_creation(self):
        """
        Test the creation of a TranscriptionTask instance.
        
        Requirements Addressed:
        - AI Integration: Validates model instantiation and field integrity
        """
        task = TranscriptionTask.objects.create(
            audio_file_path=self.valid_audio_path
        )
        
        self.assertIsInstance(task.id, uuid.UUID)
        self.assertEqual(task.audio_file_path, self.valid_audio_path)
        self.assertEqual(task.status, 'PENDING')
        self.assertIsNone(task.transcription_text)
        self.assertIsNone(task.error_message)
        self.assertIsNotNone(task.created_at)
        self.assertIsNotNone(task.updated_at)

    def test_transcription_task_perform_transcription(self):
        """
        Test the perform_transcription method of the TranscriptionTask model.
        
        Requirements Addressed:
        - Automated transcription: Validates transcription functionality
        """
        task = TranscriptionTask.objects.create(
            audio_file_path=self.valid_audio_path
        )
        
        # Test successful transcription
        transcribed_text = task.perform_transcription()
        
        self.assertIsNotNone(transcribed_text)
        self.assertEqual(task.status, 'COMPLETED')
        self.assertEqual(task.transcription_text, transcribed_text)
        self.assertIsNone(task.error_message)

    def test_transcription_task_invalid_file(self):
        """
        Test transcription task with invalid audio file path.
        
        Requirements Addressed:
        - AI Integration: Validates error handling for invalid inputs
        """
        task = TranscriptionTask.objects.create(
            audio_file_path=self.invalid_audio_path
        )
        
        with self.assertRaises(ValidationError):
            task.perform_transcription()
        
        task.refresh_from_db()
        self.assertEqual(task.status, 'FAILED')
        self.assertIsNotNone(task.error_message)

    def test_transcription_task_empty_file_path(self):
        """
        Test transcription task with empty file path.
        
        Requirements Addressed:
        - AI Integration: Validates input validation
        """
        task = TranscriptionTask.objects.create(
            audio_file_path=""
        )
        
        with self.assertRaises(ValidationError):
            task.perform_transcription()
        
        task.refresh_from_db()
        self.assertEqual(task.status, 'FAILED')
        self.assertIsNotNone(task.error_message)


class TestContentGenerationTask(TestCase):
    """Test suite for ContentGenerationTask model."""

    def test_content_generation_task_creation(self):
        """
        Test the creation of a ContentGenerationTask instance.
        
        Requirements Addressed:
        - AI Content Generation: Validates model instantiation and field integrity
        """
        task = ContentGenerationTask.objects.create(
            prompt="Generate a social media post about AI technology."
        )
        
        self.assertIsInstance(task.id, uuid.UUID)
        self.assertIsNotNone(task.prompt)
        self.assertEqual(task.status, 'PENDING')
        self.assertIsNone(task.generated_content)
        self.assertIsNone(task.error_message)
        self.assertIsNotNone(task.created_at)
        self.assertIsNotNone(task.updated_at)

    def test_content_generation_task_generate_content(self):
        """
        Test the generate_content_task method of the ContentGenerationTask model.
        
        Requirements Addressed:
        - AI Content Generation: Validates content generation functionality
        """
        task = ContentGenerationTask.objects.create(
            prompt="Generate a social media post about AI technology."
        )
        
        # Test successful content generation
        generated_content = task.generate_content_task()
        
        self.assertIsNotNone(generated_content)
        self.assertEqual(task.status, 'COMPLETED')
        self.assertEqual(task.generated_content, generated_content)
        self.assertIsNone(task.error_message)

    def test_content_generation_task_empty_prompt(self):
        """
        Test content generation task with empty prompt.
        
        Requirements Addressed:
        - AI Content Generation: Validates input validation
        """
        task = ContentGenerationTask.objects.create(
            prompt=""
        )
        
        with self.assertRaises(ValidationError):
            task.generate_content_task()
        
        task.refresh_from_db()
        self.assertEqual(task.status, 'FAILED')
        self.assertIsNotNone(task.error_message)

    def test_content_generation_task_long_prompt(self):
        """
        Test content generation task with very long prompt.
        
        Requirements Addressed:
        - AI Content Generation: Validates input constraints
        """
        long_prompt = "x" * 10000  # Create a very long prompt
        task = ContentGenerationTask.objects.create(
            prompt=long_prompt
        )
        
        generated_content = task.generate_content_task()
        
        self.assertIsNotNone(generated_content)
        self.assertEqual(task.status, 'COMPLETED')
        self.assertIsNotNone(task.generated_content)
        self.assertIsNone(task.error_message)