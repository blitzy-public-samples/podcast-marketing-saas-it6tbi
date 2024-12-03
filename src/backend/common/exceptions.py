"""
Custom Exception Classes for Backend Services

This module defines custom exception classes used across the backend services to handle
specific error scenarios in a structured and consistent manner.

Requirements Addressed:
- Error Handling and Debugging (7.3.2 Communication Patterns):
  Provides structured and reusable exception classes to handle errors consistently
  across the backend services.

Human Tasks:
1. Review logging configuration to ensure error messages are properly captured
   in the logging infrastructure
2. Verify error message format aligns with any existing error handling patterns
   in the system
"""

import logging
from .constants import SUPPORTED_AUDIO_FORMATS

# Configure module logger
logger = logging.getLogger(__name__)

class ValidationError(Exception):
    """
    Exception raised for validation errors in user inputs or data processing.
    
    This exception should be used when input validation fails or when data
    processing encounters invalid data structures or formats.
    
    Attributes:
        message (str): Detailed description of the validation error
    """
    
    def __init__(self, message: str) -> None:
        """
        Initialize ValidationError with a specific error message.
        
        Args:
            message (str): Detailed description of the validation error
        """
        self.message = message
        logger.error(f"ValidationError: {message}")
        super().__init__(self.message)


class FileSizeLimitExceeded(Exception):
    """
    Exception raised when the size of an uploaded file exceeds the allowed limit.
    
    This exception should be used specifically for file upload scenarios where
    the file size validation fails.
    
    Attributes:
        message (str): Detailed description of the file size limit error
    """
    
    def __init__(self, message: str) -> None:
        """
        Initialize FileSizeLimitExceeded with a specific error message.
        
        Args:
            message (str): Detailed description of the file size limit error
        """
        self.message = message
        logger.error(f"FileSizeLimitExceeded: {message}")
        super().__init__(self.message)