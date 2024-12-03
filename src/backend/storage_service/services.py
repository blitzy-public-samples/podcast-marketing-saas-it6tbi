"""
Storage Service Core Logic Module

This module implements the core service logic for the storage service, including
file upload, deletion, and retrieval operations via AWS S3 and CloudFront.

Requirements Addressed:
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Provides cloud-based distributed storage for audio files and transcripts.

Human Tasks:
1. Configure AWS credentials and region in environment variables
2. Verify S3 bucket permissions and CORS settings
3. Set up CloudFront distribution and configure key pairs
4. Review file size limits and storage quotas
"""

# boto3 v1.28.0
import boto3
# botocore v1.31.0
from botocore.exceptions import ClientError
import logging
import os
from typing import Optional

from src.backend.storage_service.models import FileStorage
from src.backend.storage_service.serializers import FileStorageSerializer
from src.backend.storage_service.providers.s3 import (
    upload_file_to_s3,
    delete_file_from_s3
)
from src.backend.storage_service.providers.cloudfront import generate_cloudfront_signed_url

# Configure module logger
logger = logging.getLogger(__name__)

def upload_file(file_path: str, bucket_name: str, object_name: str) -> str:
    """
    Handles the upload of a file to AWS S3 and stores its metadata in the database.

    Args:
        file_path (str): Local path to the file to upload
        bucket_name (str): Name of the S3 bucket
        object_name (str): S3 object name (key) for the uploaded file

    Returns:
        str: The S3 URL of the uploaded file

    Raises:
        ValidationError: If file validation fails
        ClientError: If S3 upload fails
        FileNotFoundError: If the local file doesn't exist

    Requirements Addressed:
    - Storage Solutions (7.2 Component Details/Data Storage Components):
      Implements secure file upload to cloud storage
    """
    try:
        # Validate file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        # Get file metadata
        file_name = os.path.basename(file_path)
        file_size = os.path.getsize(file_path)
        _, file_format = os.path.splitext(file_name)

        # Create serializer instance with file metadata
        serializer_data = {
            'file_name': file_name,
            'file_size': file_size,
            'file_format': file_format
        }
        serializer = FileStorageSerializer(data=serializer_data)

        # Validate file metadata
        serializer.validate_file_size(file_size)
        serializer.validate_file_format(file_format)

        # Upload file to S3
        s3_url = upload_file_to_s3(file_path, bucket_name, object_name)

        # Create and save FileStorage instance
        file_storage = FileStorage(
            file_name=file_name,
            file_size=file_size,
            file_format=file_format,
            s3_url=s3_url
        )
        file_storage.save()

        logger.info(f"Successfully uploaded file {file_name} to S3 and saved metadata")
        return s3_url

    except ClientError as e:
        logger.error(f"AWS S3 error during upload: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise

def delete_file(bucket_name: str, object_name: str) -> bool:
    """
    Deletes a file from AWS S3 and removes its metadata from the database.

    Args:
        bucket_name (str): Name of the S3 bucket
        object_name (str): S3 object name (key) to delete

    Returns:
        bool: True if the file was successfully deleted, False otherwise

    Requirements Addressed:
    - Storage Solutions (7.2 Component Details/Data Storage Components):
      Implements secure file deletion from cloud storage
    """
    try:
        # Find the FileStorage instance
        file_storage = FileStorage.objects.filter(
            s3_url__contains=f"{bucket_name}/{object_name}"
        ).first()

        if not file_storage:
            logger.warning(f"No metadata found for object {object_name}")
            return False

        # Delete file from S3
        if delete_file_from_s3(bucket_name, object_name):
            # Delete metadata from database
            file_storage.delete()
            logger.info(f"Successfully deleted file {object_name} and its metadata")
            return True
        
        return False

    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        return False

def get_signed_url(distribution_domain: str, object_path: str, expiration_time: int) -> str:
    """
    Generates a signed URL for accessing a file via AWS CloudFront.

    Args:
        distribution_domain (str): CloudFront distribution domain name
        object_path (str): Path to the object in the distribution
        expiration_time (int): URL expiration time in seconds from now

    Returns:
        str: Signed URL for accessing the content

    Raises:
        ClientError: If CloudFront signing fails
        ValueError: If CloudFront credentials are not configured

    Requirements Addressed:
    - Storage Solutions (7.2 Component Details/Data Storage Components):
      Implements secure access to stored content via signed URLs
    """
    try:
        # Generate signed URL using CloudFront
        signed_url = generate_cloudfront_signed_url(
            distribution_domain,
            object_path,
            expiration_time
        )

        logger.info(
            f"Generated signed URL for {object_path} with {expiration_time}s expiration"
        )
        return signed_url

    except ClientError as e:
        logger.error(f"AWS CloudFront error generating signed URL: {str(e)}")
        raise
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error generating signed URL: {str(e)}")
        raise