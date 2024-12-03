"""
Backend Constants Module

This module centralizes constants used across backend services to ensure consistency
and maintainability.

Requirements Addressed:
- Centralized Configuration (7.3.2 Communication Patterns):
  Provides a single source of truth for configuration constants used across
  the backend services.

Human Tasks:
1. Review the MAX_AUDIO_FILE_SIZE_MB value to ensure it aligns with the storage 
   infrastructure capacity
2. Verify CACHE_TTL_SECONDS matches the caching infrastructure configuration
3. Confirm SUPPORTED_AUDIO_FORMATS align with the audio processing capabilities 
   of the system
"""

# Pagination Constants
# Used for controlling the number of items returned in paginated API responses
DEFAULT_PAGE_SIZE: int = 20
MAX_PAGE_SIZE: int = 100

# Audio Processing Constants
# Supported file extensions for audio uploads
SUPPORTED_AUDIO_FORMATS: tuple[str, ...] = ('.mp3', '.wav', '.aac')

# Maximum file size for audio uploads (in megabytes)
# This should be aligned with infrastructure capacity and any upstream limitations
# (e.g., API gateway, load balancer)
MAX_AUDIO_FILE_SIZE_MB: int = 500

# Caching Configuration
# Default TTL for cached items in seconds (1 hour)
CACHE_TTL_SECONDS: int = 3600

# Type hints for exported constants
__all__ = [
    'DEFAULT_PAGE_SIZE',
    'MAX_PAGE_SIZE',
    'SUPPORTED_AUDIO_FORMATS',
    'MAX_AUDIO_FILE_SIZE_MB',
    'CACHE_TTL_SECONDS'
]