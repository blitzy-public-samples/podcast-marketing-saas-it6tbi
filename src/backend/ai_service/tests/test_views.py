"""
Unit tests for the AI service views, ensuring the correctness of API endpoints for
transcription, content generation, and audio-to-content processing.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Tests the API endpoints for transcription and content generation functionalities.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Tests the API endpoint for automated transcription of audio files.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Tests the API endpoint for AI-driven content generation.

Human Tasks:
1. Verify that test audio files are available in the test fixtures directory
2. Ensure test database is properly configured for running tests
3. Review test coverage and add additional test cases if needed
4. Configure CI/CD pipeline to run these tests automatically
"""

# Third-party imports
from rest_framework.test import APITestCase  # rest_framework v3.14+
from rest_framework import status  # rest_framework v3.14+
from django.urls import reverse  # Django built-in

# Internal imports
from ..views import TranscriptionView, ContentGenerationView, AudioToContentView
from ..serializers import TranscriptionTaskSerializer, ContentGenerationTaskSerializer

class TestTranscriptionView(APITestCase):
    """
    Tests the TranscriptionView API endpoint for creating and retrieving transcription tasks.
    """

    def setUp(self):
        """
        Set up test data and configurations before each test.
        """
        self.url = reverse('transcription-create')
        self.valid_audio_path = 's3://test-bucket/test-audio.mp3'
        self.invalid_audio_path = 'invalid-path.wav'

    def test_create_transcription_success(self):
        """
        Test successful creation of a transcription task.

        Requirements Addressed:
        - Automated transcription (1.3 Scope/AI Services):
          Verifies that the transcription endpoint correctly processes valid requests
        """
        # Prepare test data
        data = {
            'audio_file_path': self.valid_audio_path
        }

        # Send POST request to the endpoint
        response = self.client.post(self.url, data, format='json')

        # Assert response status and content
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('task_id', response.data)
        self.assertEqual(response.data['audio_file_path'], self.valid_audio_path)
        self.assertEqual(response.data['status'], 'PENDING')

    def test_create_transcription_invalid_path(self):
        """
        Test transcription creation with invalid audio file path.

        Requirements Addressed:
        - AI Integration (1.2 System Overview):
          Verifies proper error handling for invalid input
        """
        # Prepare test data with invalid path
        data = {
            'audio_file_path': self.invalid_audio_path
        }

        # Send POST request to the endpoint
        response = self.client.post(self.url, data, format='json')

        # Assert response status and error message
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_create_transcription_missing_path(self):
        """
        Test transcription creation with missing audio file path.
        """
        # Send POST request without audio_file_path
        response = self.client.post(self.url, {}, format='json')

        # Assert response status and error message
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

class TestContentGenerationView(APITestCase):
    """
    Tests the ContentGenerationView API endpoint for creating and retrieving content generation tasks.
    """

    def setUp(self):
        """
        Set up test data and configurations before each test.
        """
        self.url = reverse('content-generation-create')
        self.valid_prompt = "Generate a podcast script about artificial intelligence."
        self.invalid_prompt = ""  # Empty prompt

    def test_create_content_generation_success(self):
        """
        Test successful creation of a content generation task.

        Requirements Addressed:
        - AI Content Generation (1.3 Scope/AI Services):
          Verifies that the content generation endpoint correctly processes valid requests
        """
        # Prepare test data
        data = {
            'prompt': self.valid_prompt,
            'max_tokens': 1000,
            'temperature': 0.7
        }

        # Send POST request to the endpoint
        response = self.client.post(self.url, data, format='json')

        # Assert response status and content
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('task_id', response.data)
        self.assertEqual(response.data['prompt'], self.valid_prompt)
        self.assertEqual(response.data['status'], 'PENDING')

    def test_create_content_generation_invalid_prompt(self):
        """
        Test content generation with invalid prompt.

        Requirements Addressed:
        - AI Integration (1.2 System Overview):
          Verifies proper error handling for invalid input
        """
        # Prepare test data with invalid prompt
        data = {
            'prompt': self.invalid_prompt,
            'max_tokens': 1000,
            'temperature': 0.7
        }

        # Send POST request to the endpoint
        response = self.client.post(self.url, data, format='json')

        # Assert response status and error message
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_create_content_generation_invalid_parameters(self):
        """
        Test content generation with invalid parameters.
        """
        # Prepare test data with invalid parameters
        data = {
            'prompt': self.valid_prompt,
            'max_tokens': -1,  # Invalid token count
            'temperature': 2.0  # Invalid temperature
        }

        # Send POST request to the endpoint
        response = self.client.post(self.url, data, format='json')

        # Assert response status and error message
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

class TestAudioToContentView(APITestCase):
    """
    Tests the AudioToContentView API endpoint for processing audio files into transcription
    and generated content.
    """

    def setUp(self):
        """
        Set up test data and configurations before each test.
        """
        self.url = reverse('audio-to-content-create')
        self.valid_audio_path = 's3://test-bucket/test-audio.mp3'
        self.invalid_audio_path = 'invalid-path.wav'

    def test_audio_to_content_success(self):
        """
        Test successful processing of audio to content.

        Requirements Addressed:
        - AI Integration (1.2 System Overview):
          Verifies that the integrated endpoint correctly processes valid requests
        """
        # Prepare test data
        data = {
            'audio_file_path': self.valid_audio_path,
            'max_tokens': 1000,
            'temperature': 0.7
        }

        # Send POST request to the endpoint
        response = self.client.post(self.url, data, format='json')

        # Assert response status and content
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('transcription_task_id', response.data)
        self.assertIn('content_task_id', response.data)
        self.assertEqual(response.data['audio_file_path'], self.valid_audio_path)
        self.assertEqual(response.data['status'], 'COMPLETED')

    def test_audio_to_content_invalid_path(self):
        """
        Test audio to content processing with invalid audio file path.
        """
        # Prepare test data with invalid path
        data = {
            'audio_file_path': self.invalid_audio_path,
            'max_tokens': 1000,
            'temperature': 0.7
        }

        # Send POST request to the endpoint
        response = self.client.post(self.url, data, format='json')

        # Assert response status and error message
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_audio_to_content_invalid_parameters(self):
        """
        Test audio to content processing with invalid parameters.
        """
        # Prepare test data with invalid parameters
        data = {
            'audio_file_path': self.valid_audio_path,
            'max_tokens': -1,  # Invalid token count
            'temperature': 2.0  # Invalid temperature
        }

        # Send POST request to the endpoint
        response = self.client.post(self.url, data, format='json')

        # Assert response status and error message
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)