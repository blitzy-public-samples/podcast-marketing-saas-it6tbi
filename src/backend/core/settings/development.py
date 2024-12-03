"""
Django Development Settings Module

This module contains development-specific settings for the Django backend application.
It extends the base settings and includes configurations optimized for local development.

Requirements Addressed:
- Development Environment Configuration (7.3.1 Architecture Patterns):
  Provides a dedicated configuration for the development environment, ensuring ease of
  debugging and local testing.

Human Tasks:
1. Ensure SQLite database file location is accessible and has appropriate permissions
2. Verify that localhost and 127.0.0.1 are sufficient for local development needs
3. Review logging middleware configuration for local development debugging
"""

# Standard library imports
import os  # standard-library
import logging  # standard-library

# Import settings from base configuration
from .base import (
    BASE_DIR,
    SECRET_KEY,
    DEBUG,
    ALLOWED_HOSTS,
)

# Override debug setting for development
DEBUG = True

# Configure allowed hosts for development
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Database configuration for development
# Using SQLite for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

class LocalLoggingMiddleware:
    """
    A localized middleware class for logging HTTP requests and responses in development.
    This middleware is specifically designed for development environment debugging.
    """
    
    def __init__(self):
        """Initialize the logging configuration for the middleware."""
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)

    def process_request(self, request):
        """
        Log details of incoming HTTP requests.

        Args:
            request (HttpRequest): The incoming request object

        Returns:
            None
        """
        self.logger.debug(
            f'[Development] Incoming request: {request.method} {request.path}'
        )

    def process_response(self, request, response):
        """
        Log details of outgoing HTTP responses.

        Args:
            request (HttpRequest): The request object
            response (HttpResponse): The response object

        Returns:
            HttpResponse: The unmodified response object
        """
        self.logger.debug(
            f'[Development] Response status: {response.status_code}'
        )
        return response

# Middleware configuration for development
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'src.backend.core.settings.development.LocalLoggingMiddleware',
]

# Static files configuration
STATIC_URL = '/static/'