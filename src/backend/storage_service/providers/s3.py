"""
AWS S3 Storage Provider

This module handles interactions with AWS S3 for file storage operations including
uploads, deletions, and signed URL generation.

Requirements Addressed:
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Provides cloud-based distributed storage for audio files and transcripts.

Human Tasks:
1. Configure AWS credentials and region in environment variables or AWS config file
2. Verify S3 bucket permissions and CORS settings
3. Set up CloudFront distribution and configure key pairs for URL signing
4. Review S3 lifecycle policies for cost optimization
"""

# boto3 v1.28.0 - AWS SDK for Python
import boto3
# botocore v1.31.0 - Low-level AWS service access
from botocore.exceptions import ClientError
import logging
from typing import Optional
import os

from ...common.utils import process_audio_file

# Configure module logger
logger = logging.getLogger(__name__)

def upload_file_to_s3(file_path: str, bucket_name: str, object_name: str) -> str:
    """
    Uploads a file to an S3 bucket after validating it.

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

        # Get file size in MB
        file_size_mb = os.path.getsize(file_path) // (1024 * 1024)

        # Validate file using utility function
        process_audio_file(os.path.basename(file_path), file_size_mb)

        # Initialize S3 client
        s3_client = boto3.client('s3')

        # Upload file with progress callback
        logger.info(f"Uploading file {file_path} to bucket {bucket_name}")
        s3_client.upload_file(
            file_path,
            bucket_name,
            object_name,
            ExtraArgs={'ContentType': 'audio/mpeg'}
        )

        # Construct the S3 URL
        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        logger.info(f"File uploaded successfully. S3 URL: {s3_url}")

        return s3_url

    except ClientError as e:
        logger.error(f"AWS S3 error during upload: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error uploading file to S3: {str(e)}")
        raise

def delete_file_from_s3(bucket_name: str, object_name: str) -> bool:
    """
    Deletes a file from an S3 bucket.

    Args:
        bucket_name (str): Name of the S3 bucket
        object_name (str): S3 object name (key) to delete

    Returns:
        bool: True if deletion was successful, False otherwise

    Requirements Addressed:
    - Storage Solutions (7.2 Component Details/Data Storage Components):
      Implements secure file deletion from cloud storage
    """
    try:
        # Initialize S3 client
        s3_client = boto3.client('s3')

        # Delete the object
        logger.info(f"Deleting object {object_name} from bucket {bucket_name}")
        s3_client.delete_object(
            Bucket=bucket_name,
            Key=object_name
        )

        # Verify deletion
        try:
            s3_client.head_object(Bucket=bucket_name, Key=object_name)
            logger.error(f"Object {object_name} still exists after deletion attempt")
            return False
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                logger.info(f"Object {object_name} successfully deleted")
                return True
            else:
                raise

    except ClientError as e:
        logger.error(f"AWS S3 error during deletion: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error deleting file from S3: {str(e)}")
        return False

def generate_signed_url(distribution_domain: str, object_path: str, expiration_time: int) -> str:
    """
    Generates a signed URL for accessing content via CloudFront.

    Args:
        distribution_domain (str): CloudFront distribution domain name
        object_path (str): Path to the object in the distribution
        expiration_time (int): URL expiration time in seconds from now

    Returns:
        str: Signed URL for accessing the content

    Raises:
        ClientError: If CloudFront signing fails

    Requirements Addressed:
    - Storage Solutions (7.2 Component Details/Data Storage Components):
      Implements secure access to stored content via signed URLs
    """
    try:
        # Initialize CloudFront signer
        cloudfront_client = boto3.client('cloudfront')
        
        # Get the CloudFront signing key and key ID from environment variables
        key_id = os.environ.get('CLOUDFRONT_KEY_ID')
        key_path = os.environ.get('CLOUDFRONT_PRIVATE_KEY_PATH')
        
        if not key_id or not key_path:
            raise ValueError("CloudFront signing credentials not configured")

        with open(key_path, 'rb') as key_file:
            private_key = key_file.read()

        # Generate signed URL
        signed_url = cloudfront_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': distribution_domain,
                'Key': object_path,
                'SigningKeyId': key_id,
                'SigningKey': private_key,
                'Expires': expiration_time
            }
        )

        logger.info(f"Generated signed URL for {object_path} with expiration {expiration_time}s")
        return signed_url

    except ClientError as e:
        logger.error(f"AWS CloudFront error generating signed URL: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error generating signed URL: {str(e)}")
        raise