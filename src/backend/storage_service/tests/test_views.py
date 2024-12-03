"""
Storage Service Test Views Module

This module contains unit tests for the storage service views, validating the functionality
of file upload, retrieval, and deletion endpoints.

Requirements Addressed:
- API Testing (8.3 API Design/8.3.2 Interface Specifications):
  Ensures that the API endpoints for file upload, retrieval, and deletion meet the
  specified requirements.

Human Tasks:
1. Configure test environment variables for AWS credentials and bucket names
2. Set up test S3 bucket with appropriate permissions
3. Configure test CloudFront distribution for URL signing tests
4. Review test coverage requirements and add additional test cases if needed
"""

# django.test v4.2
from django.test import TestCase
# django.urls v4.2
from django.urls import reverse
# rest_framework.test v3.14
from rest_framework.test import APIClient
import os
import tempfile
from unittest.mock import patch, MagicMock

from src.backend.storage_service.views import FileStorageView
from src.backend.storage_service.models import FileStorage
from src.backend.storage_service.serializers import FileStorageSerializer
from src.backend.storage_service.services import upload_file, delete_file, get_signed_url


class TestFileStorageView(TestCase):
    """
    Test cases for the FileStorageView class, covering file upload, retrieval,
    and deletion endpoints.
    """

    def setUp(self):
        """
        Initializes the test environment with necessary fixtures and configurations.
        """
        self.client = APIClient()
        self.upload_url = reverse('storage:upload')
        self.retrieve_url = reverse('storage:retrieve')
        self.delete_url = reverse('storage:delete')

        # Create test file storage instances
        self.test_file_storage = FileStorage.objects.create(
            file_name='test_audio.mp3',
            file_size=1024 * 1024,  # 1MB
            file_format='.mp3',
            s3_url='https://test-bucket.s3.amazonaws.com/uploads/test_audio.mp3'
        )

    def test_file_upload_success(self):
        """
        Tests successful file upload scenario.

        Requirements Addressed:
        - API Testing (8.3.2): Validates file upload endpoint functionality
        """
        # Create a temporary test file
        with tempfile.NamedTemporaryFile(suffix='.mp3') as temp_file:
            temp_file.write(b'Test audio content')
            temp_file.seek(0)

            # Mock S3 upload response
            with patch('src.backend.storage_service.services.upload_file') as mock_upload:
                mock_upload.return_value = 'https://test-bucket.s3.amazonaws.com/uploads/test.mp3'

                # Simulate file upload request
                response = self.client.post(
                    self.upload_url,
                    {'file': temp_file},
                    format='multipart'
                )

                # Verify response
                self.assertEqual(response.status_code, 201)
                self.assertIn('file_url', response.data)
                self.assertIn('metadata', response.data)
                self.assertEqual(
                    response.data['file_url'],
                    'https://test-bucket.s3.amazonaws.com/uploads/test.mp3'
                )

    def test_file_upload_invalid_format(self):
        """
        Tests file upload with unsupported format.

        Requirements Addressed:
        - API Testing (8.3.2): Validates file format validation
        """
        with tempfile.NamedTemporaryFile(suffix='.txt') as temp_file:
            temp_file.write(b'Invalid file content')
            temp_file.seek(0)

            response = self.client.post(
                self.upload_url,
                {'file': temp_file},
                format='multipart'
            )

            self.assertEqual(response.status_code, 400)
            self.assertIn('error', response.data)
            self.assertIn('format', response.data['error'].lower())

    def test_file_upload_size_limit(self):
        """
        Tests file upload size limit validation.

        Requirements Addressed:
        - API Testing (8.3.2): Validates file size limit enforcement
        """
        # Create a large temporary file
        with tempfile.NamedTemporaryFile(suffix='.mp3') as temp_file:
            # Write content larger than MAX_AUDIO_FILE_SIZE_MB
            temp_file.write(b'0' * (501 * 1024 * 1024))  # 501MB
            temp_file.seek(0)

            response = self.client.post(
                self.upload_url,
                {'file': temp_file},
                format='multipart'
            )

            self.assertEqual(response.status_code, 400)
            self.assertIn('error', response.data)
            self.assertIn('size', response.data['error'].lower())

    def test_file_retrieval_success(self):
        """
        Tests successful file retrieval scenario.

        Requirements Addressed:
        - API Testing (8.3.2): Validates file retrieval endpoint functionality
        """
        # Mock signed URL generation
        with patch('src.backend.storage_service.services.get_signed_url') as mock_get_url:
            mock_get_url.return_value = 'https://test-cdn.cloudfront.net/test_audio.mp3?signature=xyz'

            response = self.client.get(
                f"{self.retrieve_url}?file_id={self.test_file_storage.id}"
            )

            self.assertEqual(response.status_code, 200)
            self.assertIn('metadata', response.data)
            self.assertIn('signed_url', response.data)
            self.assertEqual(response.data['metadata']['file_name'], 'test_audio.mp3')

    def test_file_retrieval_not_found(self):
        """
        Tests file retrieval with non-existent file ID.

        Requirements Addressed:
        - API Testing (8.3.2): Validates error handling for missing files
        """
        response = self.client.get(f"{self.retrieve_url}?file_id=999999")
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.data)

    def test_file_deletion_success(self):
        """
        Tests successful file deletion scenario.

        Requirements Addressed:
        - API Testing (8.3.2): Validates file deletion endpoint functionality
        """
        # Mock S3 deletion
        with patch('src.backend.storage_service.services.delete_file') as mock_delete:
            mock_delete.return_value = True

            response = self.client.delete(
                f"{self.delete_url}?file_id={self.test_file_storage.id}"
            )

            self.assertEqual(response.status_code, 200)
            self.assertIn('message', response.data)
            self.assertFalse(
                FileStorage.objects.filter(id=self.test_file_storage.id).exists()
            )

    def test_file_deletion_not_found(self):
        """
        Tests file deletion with non-existent file ID.

        Requirements Addressed:
        - API Testing (8.3.2): Validates error handling for missing files
        """
        response = self.client.delete(f"{self.delete_url}?file_id=999999")
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.data)

    def test_missing_file_id(self):
        """
        Tests API endpoints with missing file ID parameter.

        Requirements Addressed:
        - API Testing (8.3.2): Validates parameter validation
        """
        # Test retrieval
        response = self.client.get(self.retrieve_url)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)

        # Test deletion
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)

    def test_cloudfront_url_generation(self):
        """
        Tests CloudFront signed URL generation.

        Requirements Addressed:
        - API Testing (8.3.2): Validates secure URL generation
        """
        with patch('src.backend.storage_service.services.get_signed_url') as mock_get_url:
            expected_url = 'https://test-cdn.cloudfront.net/test_audio.mp3?signature=xyz'
            mock_get_url.return_value = expected_url

            response = self.client.get(
                f"{self.retrieve_url}?file_id={self.test_file_storage.id}"
            )

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['signed_url'], expected_url)
            self.assertIn('expiration', response.data)

    def tearDown(self):
        """
        Cleans up test data and resources.
        """
        # Clean up test file storage instances
        FileStorage.objects.all().delete()