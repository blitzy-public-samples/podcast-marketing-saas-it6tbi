"""
Backend Logging Configuration Module

This module provides centralized logging configurations and utilities for the backend services.
It ensures consistent logging formats, levels, and handlers across the application.

Requirements Addressed:
- Centralized Logging (7.4.2 Security Architecture):
  Ensures that logging configurations are centralized and reusable across the backend services
  for consistent monitoring and debugging.

Human Tasks:
1. Verify that the logs directory has appropriate write permissions
2. Review log rotation policies with infrastructure team
3. Confirm log level configuration matches environment requirements
4. Ensure log file path aligns with deployment environment
"""

import logging
import os
from typing import Optional, Dict, Any, Union, List
from logging.handlers import RotatingFileHandler

# Third-party imports
from .constants import SUPPORTED_AUDIO_FORMATS  # Used for logging validation messages
from .exceptions import ValidationError  # Used for error handling in logging setup

# Global logging configuration
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
DEFAULT_LOG_FILE = os.path.join(os.getcwd(), 'logs', 'application.log')
DEFAULT_LOG_LEVEL = 'INFO'

# Maximum log file size (10 MB) and backup count
MAX_LOG_SIZE = 10 * 1024 * 1024
BACKUP_COUNT = 5

def configure_logging() -> bool:
    """
    Configures the logging settings for the backend application.
    
    This function sets up a centralized logging configuration including:
    - File handler with rotation
    - Consistent log format
    - Appropriate log levels
    - Error handling and validation
    
    Returns:
        bool: True if logging is successfully configured, False otherwise
    
    Raises:
        ValidationError: If logging configuration fails due to permission or path issues
    """
    try:
        # Create logs directory if it doesn't exist
        log_dir = os.path.dirname(DEFAULT_LOG_FILE)
        if not os.path.exists(log_dir):
            os.makedirs(log_dir, exist_ok=True)
        
        # Create and configure the root logger
        root_logger = logging.getLogger()
        root_logger.setLevel(getattr(logging, DEFAULT_LOG_LEVEL))
        
        # Remove existing handlers to prevent duplicate logging
        for handler in root_logger.handlers[:]:
            root_logger.removeHandler(handler)
        
        # Create formatter
        formatter = logging.Formatter(LOG_FORMAT)
        
        # Configure file handler with rotation
        file_handler = RotatingFileHandler(
            filename=DEFAULT_LOG_FILE,
            maxBytes=MAX_LOG_SIZE,
            backupCount=BACKUP_COUNT,
            encoding='utf-8'
        )
        file_handler.setFormatter(formatter)
        file_handler.setLevel(getattr(logging, DEFAULT_LOG_LEVEL))
        
        # Configure console handler for development environment
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        console_handler.setLevel(getattr(logging, DEFAULT_LOG_LEVEL))
        
        # Add handlers to root logger
        root_logger.addHandler(file_handler)
        root_logger.addHandler(console_handler)
        
        # Log successful configuration
        root_logger.info(
            "Logging configured successfully with format: %s, level: %s, file: %s",
            LOG_FORMAT,
            DEFAULT_LOG_LEVEL,
            DEFAULT_LOG_FILE
        )
        
        # Log supported audio formats for reference
        root_logger.debug("Supported audio formats: %s", SUPPORTED_AUDIO_FORMATS)
        
        return True
        
    except (OSError, IOError) as e:
        # Handle file system related errors
        error_msg = f"Failed to configure logging due to file system error: {str(e)}"
        raise ValidationError(error_msg)
        
    except Exception as e:
        # Handle unexpected errors
        error_msg = f"Unexpected error during logging configuration: {str(e)}"
        raise ValidationError(error_msg)
        
    return False