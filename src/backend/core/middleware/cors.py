"""
CORS Middleware Configuration Module

This module configures Cross-Origin Resource Sharing (CORS) settings for the Django backend
application, enabling secure communication between frontend applications and external APIs.

Requirements Addressed:
- Cross-Origin Resource Sharing (CORS) Support (7.4.2 Security Architecture):
  Implements CORS policies to allow secure cross-origin requests, ensuring compatibility
  with frontend applications and external APIs.

Human Tasks:
1. Set CORS_ALLOWED_ORIGINS in environment variables for each deployment environment
2. Configure CORS_ALLOW_CREDENTIALS based on security requirements
3. Verify ALLOWED_HOSTS includes all necessary domains for CORS
"""

# Standard library imports
import os  # standard-library

# Django imports
# django-cors-headers v3.14.0
from corsheaders.middleware.cors import CorsMiddleware

# Internal imports
from core.settings.base import (
    BASE_DIR,
    ALLOWED_HOSTS,
)

def configure_cors() -> None:
    """
    Configures the CORS settings for the Django application.
    
    This function sets up CORS-related settings by:
    1. Loading allowed origins from environment variables
    2. Configuring credentials settings
    3. Adding CORS middleware to the middleware stack
    4. Ensuring ALLOWED_HOSTS includes CORS domains
    
    The function modifies Django's settings module directly to include
    CORS configurations.
    """
    from django.conf import settings
    
    # Load CORS allowed origins from environment variables
    # If not set, defaults to an empty list to ensure strict security
    cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
    cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]
    
    # Configure CORS settings
    settings.CORS_ALLOWED_ORIGINS = cors_origins
    
    # Configure credentials handling based on environment variable
    # Defaults to False for security
    settings.CORS_ALLOW_CREDENTIALS = os.getenv('CORS_ALLOW_CREDENTIALS', 'False') == 'True'
    
    # Add CORS middleware to the beginning of the middleware stack
    # It needs to be placed before any middleware that may generate responses
    if 'corsheaders.middleware.CorsMiddleware' not in settings.MIDDLEWARE:
        settings.MIDDLEWARE.insert(
            0, 'corsheaders.middleware.CorsMiddleware'
        )
    
    # Ensure all CORS domains are included in ALLOWED_HOSTS
    # Extract domains from CORS origins (removing protocol and port)
    cors_domains = set()
    for origin in cors_origins:
        try:
            # Handle origins that might be invalid or empty
            if origin:
                # Remove protocol and port if present
                domain = origin.split('://')[-1].split(':')[0]
                cors_domains.add(domain)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Invalid CORS origin format: {origin}. Error: {str(e)}")
    
    # Update ALLOWED_HOSTS to include CORS domains
    settings.ALLOWED_HOSTS.extend(list(cors_domains - set(settings.ALLOWED_HOSTS)))