"""
Django Test Settings Module

This module contains test-specific settings for the Django backend application,
extending the base settings with configurations optimized for running automated tests.

Requirements Addressed:
- Test Environment Configuration (7.3.1 Architecture Patterns):
  Provides a dedicated configuration for the test environment, ensuring isolated
  and efficient testing.

Human Tasks:
1. Verify django-nose package is installed in the test environment
2. Ensure test database permissions are properly configured
3. Review test logging configuration if needed
"""

# Standard library imports
import os  # standard-library

# Import base settings
from .base import (
    BASE_DIR,
    INSTALLED_APPS,
    MIDDLEWARE,
)

# Disable debug mode in test environment
DEBUG = False

# Use in-memory SQLite database for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
}

# Add django-nose to installed apps for enhanced test runner capabilities
# django-nose version 1.4.7 or higher recommended
INSTALLED_APPS = INSTALLED_APPS + ['django_nose']

# Configure django-nose as the test runner
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

# Add test-specific middleware
MIDDLEWARE = MIDDLEWARE + ['src.backend.core.middleware.TestMiddleware']

class TestMiddleware:
    """
    Middleware for handling test-specific HTTP request and response processing.
    Provides logging and debugging capabilities during test execution.
    """

    def __init__(self):
        """
        Initialize the TestMiddleware.
        Sets up configurations specific to test requests and responses.
        """
        # Initialize logging for test requests
        self.logger = logging.getLogger(__name__)

    def process_request(self, request):
        """
        Process incoming HTTP requests during tests.
        
        Args:
            request (HttpRequest): The incoming HTTP request object
            
        Returns:
            None
        """
        # Log request details for debugging
        self.logger.debug(
            f"Test request received - Method: {request.method}, "
            f"Path: {request.path}"
        )

    def process_response(self, request, response):
        """
        Process outgoing HTTP responses during tests.
        
        Args:
            request (HttpRequest): The HTTP request object
            response (HttpResponse): The response object to be processed
            
        Returns:
            HttpResponse: The processed response object
        """
        # Log response details for debugging
        self.logger.debug(
            f"Test response generated - Status Code: {response.status_code}"
        )
        return response