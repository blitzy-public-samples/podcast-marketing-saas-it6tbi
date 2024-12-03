"""
Backend Validators Module

This module provides validation functions for ensuring data integrity and compliance
with business rules across backend services.

Requirements Addressed:
- Data Validation and Integrity (7.3.2 Communication Patterns):
  Ensures that data inputs and file uploads comply with predefined business rules
  and constraints.

Human Tasks:
1. Review error messages to ensure they align with the application's error handling
   strategy and user experience guidelines
2. Verify that the validation rules align with any upstream or downstream system
   requirements
"""

import os
from .constants import SUPPORTED_AUDIO_FORMATS, MAX_AUDIO_FILE_SIZE_MB
from .exceptions import ValidationError, FileSizeLimitExceeded


def validate_audio_file(file_name: str, file_size_mb: int) -> bool:
    """
    Validates the format and size of an uploaded audio file.

    This function performs two main validations:
    1. Checks if the file extension is in the list of supported audio formats
    2. Verifies that the file size does not exceed the maximum allowed limit

    Args:
        file_name (str): The name of the audio file including its extension
        file_size_mb (int): The size of the file in megabytes

    Returns:
        bool: True if all validations pass

    Raises:
        ValidationError: If the file format is not supported
        FileSizeLimitExceeded: If the file size exceeds the maximum allowed limit

    Requirements Addressed:
    - Data Validation and Integrity (7.3.2 Communication Patterns):
      Implements specific validation rules for audio file uploads
    """
    # Extract file extension and convert to lowercase for case-insensitive comparison
    _, file_extension = os.path.splitext(file_name.lower())

    # Validate file format
    if file_extension not in SUPPORTED_AUDIO_FORMATS:
        raise ValidationError(
            f"Unsupported audio format: {file_extension}. "
            f"Supported formats are: {', '.join(SUPPORTED_AUDIO_FORMATS)}"
        )

    # Validate file size
    if file_size_mb > MAX_AUDIO_FILE_SIZE_MB:
        raise FileSizeLimitExceeded(
            f"File size ({file_size_mb}MB) exceeds the maximum allowed size "
            f"of {MAX_AUDIO_FILE_SIZE_MB}MB"
        )

    return True