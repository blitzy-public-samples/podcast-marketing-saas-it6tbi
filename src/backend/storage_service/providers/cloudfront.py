"""
AWS CloudFront URL Signing Provider

This module provides functionality for generating signed URLs using AWS CloudFront,
enabling secure and time-limited access to content stored in S3.

Requirements Addressed:
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Provides cloud-based distributed storage for audio files and transcripts.

Human Tasks:
1. Configure AWS CloudFront distribution and create key pairs
2. Set up environment variables for CloudFront key ID and private key path
3. Verify CloudFront distribution settings and behaviors
4. Review URL expiration policies for security compliance
"""

# boto3 v1.28.0 - AWS SDK for Python
import boto3
# botocore v1.31.0 - Low-level AWS service access
from botocore.exceptions import ClientError
import logging
import os
from datetime import datetime, timedelta
import rsa
from typing import Optional

# Configure module logger
logger = logging.getLogger(__name__)

def generate_cloudfront_signed_url(distribution_domain: str, object_path: str, expiration_time: int) -> str:
    """
    Generates a signed URL for accessing content via AWS CloudFront.

    This function creates a signed URL that provides temporary, secure access to private content
    distributed through CloudFront. It uses the CloudFront key pair for signing the URL.

    Args:
        distribution_domain (str): CloudFront distribution domain name
        object_path (str): Path to the object in the distribution
        expiration_time (int): URL expiration time in seconds from now

    Returns:
        str: Signed URL for accessing the content

    Raises:
        ClientError: If CloudFront signing fails
        ValueError: If CloudFront credentials are not properly configured
        Exception: For other unexpected errors

    Requirements Addressed:
    - Storage Solutions (7.2 Component Details/Data Storage Components):
      Implements secure access to stored content via signed URLs
    """
    try:
        # Initialize CloudFront client
        cloudfront_client = boto3.client('cloudfront')
        
        # Get CloudFront configuration from environment variables
        key_id = os.environ.get('CLOUDFRONT_KEY_ID')
        key_path = os.environ.get('CLOUDFRONT_PRIVATE_KEY_PATH')
        
        if not key_id or not key_path:
            logger.error("CloudFront signing credentials not configured")
            raise ValueError("CloudFront key ID or private key path not found in environment variables")

        # Read the private key file
        try:
            with open(key_path, 'rb') as key_file:
                private_key = key_file.read()
        except FileNotFoundError:
            logger.error(f"CloudFront private key file not found at {key_path}")
            raise ValueError(f"CloudFront private key file not found at {key_path}")

        # Calculate expiration timestamp
        expiration_date = datetime.utcnow() + timedelta(seconds=expiration_time)
        
        # Ensure the object path starts with a forward slash
        if not object_path.startswith('/'):
            object_path = f"/{object_path}"

        # Generate the signed URL
        signed_url = cloudfront_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': distribution_domain.split('.')[0],  # Extract bucket name from domain
                'Key': object_path.lstrip('/'),  # Remove leading slash for S3 key
                'SigningKeyId': key_id,
                'SigningKey': private_key,
                'Expires': int(expiration_date.timestamp())
            }
        )

        logger.info(
            f"Generated signed URL for {object_path} with expiration in {expiration_time} seconds"
        )
        return signed_url

    except ClientError as e:
        logger.error(f"AWS CloudFront error generating signed URL: {str(e)}")
        raise
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error generating signed URL: {str(e)}")
        raise