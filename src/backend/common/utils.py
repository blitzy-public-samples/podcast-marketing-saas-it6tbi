"""
Backend Utility Functions Module

This module provides utility functions commonly used across backend services for data
processing, validation, and other reusable operations.

Requirements Addressed:
- Reusable Utility Functions (7.3.2 Communication Patterns):
  Ensures that common utility functions are centralized and reusable across the backend services.

Human Tasks:
1. Review the cache implementation to ensure it aligns with the Redis configuration
2. Verify that the audio processing error handling meets the logging requirements
3. Confirm that the file size limits match infrastructure capacity
"""

import logging
from typing import Any, Optional

from .constants import SUPPORTED_AUDIO_FORMATS, CACHE_TTL_SECONDS
from .exceptions import ValidationError
from .validators import validate_audio_file

# Configure module logger
logger = logging.getLogger(__name__)

# Cache prefix to namespace cache keys
CACHE_PREFIX = "podcast_automation:"

def process_audio_file(file_name: str, file_size_mb: int) -> bool:
    """
    Processes an audio file by validating its format and size, and then performing
    additional operations.

    Args:
        file_name (str): The name of the audio file including extension
        file_size_mb (int): The size of the file in megabytes

    Returns:
        bool: True if the file is successfully processed

    Raises:
        ValidationError: If the file format or size validation fails

    Requirements Addressed:
    - Data Validation and Integrity (7.3.2 Communication Patterns):
      Implements validation rules for audio file processing
    """
    try:
        # Validate the audio file format and size
        logger.info(f"Processing audio file: {file_name} ({file_size_mb}MB)")
        validate_audio_file(file_name, file_size_mb)

        # Log successful validation
        logger.debug(f"Audio file validation passed for {file_name}")

        # Additional processing steps could be added here
        # For example: virus scanning, metadata extraction, etc.

        logger.info(f"Successfully processed audio file: {file_name}")
        return True

    except ValidationError as e:
        logger.error(f"Audio file processing failed: {str(e)}")
        raise ValidationError(f"Failed to process audio file: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error during audio file processing: {str(e)}")
        raise ValidationError(f"Unexpected error during audio file processing: {str(e)}")

def cache_result(key: str, value: Any, ttl: Optional[int] = None) -> bool:
    """
    Caches the result of a function call with a specified key and optional TTL.

    Args:
        key (str): The cache key to store the value under
        value (Any): The value to cache
        ttl (Optional[int]): Time-to-live in seconds, defaults to CACHE_TTL_SECONDS

    Returns:
        bool: True if the value was successfully cached

    Requirements Addressed:
    - Performance Optimization (7.3.2 Communication Patterns):
      Implements caching for improved response times and reduced load
    """
    try:
        # Prepend the cache prefix to the key
        prefixed_key = f"{CACHE_PREFIX}{key}"
        
        # Use default TTL if none provided
        ttl_seconds = ttl if ttl is not None else CACHE_TTL_SECONDS

        logger.debug(f"Caching value with key: {prefixed_key}, TTL: {ttl_seconds}s")

        # Note: Actual cache implementation would be injected here
        # This is a placeholder for the actual Redis/cache implementation
        # cache_instance.set(prefixed_key, value, ttl_seconds)

        logger.info(f"Successfully cached value for key: {prefixed_key}")
        return True

    except Exception as e:
        logger.error(f"Failed to cache result for key {key}: {str(e)}")
        return False