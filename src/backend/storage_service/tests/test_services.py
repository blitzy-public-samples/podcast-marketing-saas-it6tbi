"""
Storage Service Unit Tests

This module contains unit tests for the storage service's core functionalities including
file upload, deletion, and signed URL generation.

Requirements Addressed:
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Ensures the reliability and correctness of cloud-based distributed storage operations
  for audio files and transcripts.

Human Tasks:
1. Configure test environment variables for AWS credentials and bucket names
2. Set up test data directory with sample audio files
3. Verify test database configuration matches development settings
"""

# pytest v7.4.0
import pytest
# mock v4.0.0
from unittest.mock import patch, MagicMock
import os
from datetime import datetime

from src.backend.storage_service.services import (
    upload_file,
    delete_file,
    get_signed_url
)
from src.backend.storage_service.models import FileStorage
from src.backend.storage_service.serializers import FileStorageSerializer
from src.backend.storage_service.providers.s3 import (
    upload_file_to_s3,
    delete_file_from_s3
)
from src.backend.storage_service.providers.cloudfront import (
    generate_cloudfront_signed_url
)

# Test data constants
TEST_BUCKET = "test-audio-bucket"
TEST_FILE_PATH = "test_files/test_audio.mp3"
TEST_OBJECT_NAME = "uploads/test_audio.mp3"
TEST_FILE_SIZE = 1024 * 1024 * 10  # 10MB
TEST_DISTRIBUTION_DOMAIN = "test.cloudfront.net"
TEST_EXPIRATION_TIME = 3600  # 1 hour

@pytest.fixture
def mock_file_storage():
    """Fixture to create a mock FileStorage instance."""
    return MagicMock(
        file_name="test_audio.mp3",
        file_size=TEST_FILE_SIZE,
        file_format=".mp3",
        s3_url=f"https://{TEST_BUCKET}.s3.amazonaws.com/{TEST_OBJECT_NAME}"
    )

@pytest.fixture
def mock_serializer():
    """Fixture to create a mock FileStorageSerializer instance."""
    serializer = MagicMock(spec=FileStorageSerializer)
    serializer.validate_file_size.return_value = True
    serializer.validate_file_format.return_value = True
    return serializer

@pytest.mark.parametrize("file_exists", [True, False])
def test_upload_file(mock_file_storage, mock_serializer, file_exists):
    """
    Tests the upload_file function with various scenarios.

    Args:
        mock_file_storage: Mock FileStorage instance
        mock_serializer: Mock FileStorageSerializer instance
        file_exists: Boolean indicating if test file exists
    """
    # Mock file existence check
    with patch('os.path.exists') as mock_exists:
        mock_exists.return_value = file_exists
        
        if not file_exists:
            with pytest.raises(FileNotFoundError):
                upload_file(TEST_FILE_PATH, TEST_BUCKET, TEST_OBJECT_NAME)
            return

        # Mock file size check
        with patch('os.path.getsize') as mock_size:
            mock_size.return_value = TEST_FILE_SIZE
            
            # Mock S3 upload
            with patch('src.backend.storage_service.services.upload_file_to_s3') as mock_upload:
                expected_s3_url = f"https://{TEST_BUCKET}.s3.amazonaws.com/{TEST_OBJECT_NAME}"
                mock_upload.return_value = expected_s3_url
                
                # Mock FileStorage model
                with patch('src.backend.storage_service.services.FileStorage') as mock_model:
                    mock_model.return_value = mock_file_storage
                    
                    # Mock serializer
                    with patch('src.backend.storage_service.services.FileStorageSerializer') as mock_ser:
                        mock_ser.return_value = mock_serializer
                        
                        # Execute test
                        result = upload_file(TEST_FILE_PATH, TEST_BUCKET, TEST_OBJECT_NAME)
                        
                        # Verify results
                        assert result == expected_s3_url
                        mock_upload.assert_called_once_with(
                            TEST_FILE_PATH,
                            TEST_BUCKET,
                            TEST_OBJECT_NAME
                        )
                        mock_file_storage.save.assert_called_once()

@pytest.mark.parametrize("file_exists,delete_success", [
    (True, True),
    (True, False),
    (False, False)
])
def test_delete_file(mock_file_storage, file_exists, delete_success):
    """
    Tests the delete_file function with various scenarios.

    Args:
        mock_file_storage: Mock FileStorage instance
        file_exists: Boolean indicating if file exists in database
        delete_success: Boolean indicating if S3 deletion succeeds
    """
    # Mock FileStorage query
    with patch('src.backend.storage_service.models.FileStorage.objects.filter') as mock_filter:
        mock_filter.return_value.first.return_value = mock_file_storage if file_exists else None
        
        # Mock S3 deletion
        with patch('src.backend.storage_service.services.delete_file_from_s3') as mock_delete:
            mock_delete.return_value = delete_success
            
            # Execute test
            result = delete_file(TEST_BUCKET, TEST_OBJECT_NAME)
            
            # Verify results
            assert result == (file_exists and delete_success)
            
            if file_exists:
                mock_delete.assert_called_once_with(TEST_BUCKET, TEST_OBJECT_NAME)
                if delete_success:
                    mock_file_storage.delete.assert_called_once()

@pytest.mark.parametrize("signing_success", [True, False])
def test_get_signed_url(signing_success):
    """
    Tests the get_signed_url function with various scenarios.

    Args:
        signing_success: Boolean indicating if URL signing succeeds
    """
    expected_url = f"https://{TEST_DISTRIBUTION_DOMAIN}/{TEST_OBJECT_NAME}?signature=test"
    
    # Mock CloudFront URL generation
    with patch('src.backend.storage_service.services.generate_cloudfront_signed_url') as mock_sign:
        if signing_success:
            mock_sign.return_value = expected_url
        else:
            mock_sign.side_effect = Exception("Signing failed")
        
        if signing_success:
            result = get_signed_url(
                TEST_DISTRIBUTION_DOMAIN,
                TEST_OBJECT_NAME,
                TEST_EXPIRATION_TIME
            )
            assert result == expected_url
            mock_sign.assert_called_once_with(
                TEST_DISTRIBUTION_DOMAIN,
                TEST_OBJECT_NAME,
                TEST_EXPIRATION_TIME
            )
        else:
            with pytest.raises(Exception):
                get_signed_url(
                    TEST_DISTRIBUTION_DOMAIN,
                    TEST_OBJECT_NAME,
                    TEST_EXPIRATION_TIME
                )

def test_upload_file_validation_error(mock_serializer):
    """Tests that upload_file handles validation errors correctly."""
    mock_serializer.validate_file_size.side_effect = ValueError("Invalid file size")
    
    with patch('os.path.exists') as mock_exists:
        mock_exists.return_value = True
        
        with patch('src.backend.storage_service.services.FileStorageSerializer') as mock_ser:
            mock_ser.return_value = mock_serializer
            
            with pytest.raises(ValueError):
                upload_file(TEST_FILE_PATH, TEST_BUCKET, TEST_OBJECT_NAME)

def test_delete_file_s3_error():
    """Tests that delete_file handles S3 errors correctly."""
    with patch('src.backend.storage_service.models.FileStorage.objects.filter') as mock_filter:
        mock_filter.return_value.first.return_value = MagicMock()
        
        with patch('src.backend.storage_service.services.delete_file_from_s3') as mock_delete:
            mock_delete.side_effect = Exception("S3 error")
            
            result = delete_file(TEST_BUCKET, TEST_OBJECT_NAME)
            assert result is False

def test_get_signed_url_config_error():
    """Tests that get_signed_url handles configuration errors correctly."""
    with patch('src.backend.storage_service.services.generate_cloudfront_signed_url') as mock_sign:
        mock_sign.side_effect = ValueError("Missing CloudFront configuration")
        
        with pytest.raises(ValueError):
            get_signed_url(TEST_DISTRIBUTION_DOMAIN, TEST_OBJECT_NAME, TEST_EXPIRATION_TIME)