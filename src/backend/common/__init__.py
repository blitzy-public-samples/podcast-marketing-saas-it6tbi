"""
Backend Common Module Entry Point

This module serves as the entry point for the 'common' module, aggregating and exposing
shared utilities, constants, and configurations for use across the backend services.

Requirements Addressed:
- Centralized Module Access (7.3.2 Communication Patterns):
  Provides a single access point for shared utilities, constants, and configurations,
  ensuring consistency and maintainability across the backend services.
"""

# Import constants
from .constants import (
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    SUPPORTED_AUDIO_FORMATS,
    CACHE_TTL_SECONDS
)

# Import exception classes
from .exceptions import (
    ValidationError,
    FileSizeLimitExceeded
)

# Import validation utilities
from .validators import validate_audio_file

# Import audio processing utilities
from .utils import process_audio_file

# Import logging configuration
from .logging import configure_logging

# Import pagination utilities
from .pagination import get_paginated_response

# Import caching utilities
from .cache import set_cache

# Define public API
__all__ = [
    # Constants
    'DEFAULT_PAGE_SIZE',
    'MAX_PAGE_SIZE',
    'SUPPORTED_AUDIO_FORMATS',
    'CACHE_TTL_SECONDS',
    
    # Exception classes
    'ValidationError',
    'FileSizeLimitExceeded',
    
    # Validation utilities
    'validate_audio_file',
    
    # Audio processing utilities
    'process_audio_file',
    
    # Logging configuration
    'configure_logging',
    
    # Pagination utilities
    'get_paginated_response',
    
    # Caching utilities
    'set_cache'
]