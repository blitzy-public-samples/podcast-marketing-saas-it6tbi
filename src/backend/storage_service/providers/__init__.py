"""
Storage Service Providers Module

This module initializes the providers package and exposes key functionalities for 
interacting with AWS S3 and CloudFront services.

Requirements Addressed:
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Provides cloud-based distributed storage for audio files and transcripts.

Human Tasks:
1. Verify AWS credentials and permissions are properly configured
2. Ensure S3 bucket and CloudFront distribution are set up correctly
3. Review security policies and access controls
"""

# Import storage provider functions
from .s3 import (
    upload_file_to_s3,
    delete_file_from_s3,
    generate_signed_url
)
from .cloudfront import generate_cloudfront_signed_url

# Define package exports
__all__ = [
    'upload_file_to_s3',
    'delete_file_from_s3',
    'generate_signed_url',
    'generate_cloudfront_signed_url'
]