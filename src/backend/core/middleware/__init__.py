"""
Middleware Initialization Module

This file initializes and aggregates middleware components for the Django backend application.
It provides a centralized location for importing and managing middleware classes and functions.

Requirements Addressed:
- Middleware Initialization (7.3.1 Architecture Patterns):
  Ensures that all middleware components are properly initialized and accessible from a single
  entry point.

Human Tasks:
1. Review middleware order to ensure correct request/response processing flow
2. Verify CORS configuration in environment variables
3. Ensure logging directory permissions are set correctly
4. Configure security headers according to production requirements
"""

# Internal imports - using relative imports from current package
from .cors import configure_cors
from .logging import LoggingMiddleware
from .security import SecurityMiddleware

def initialize_middleware() -> list:
    """
    Aggregates and initializes all middleware components for the Django application.
    
    This function:
    1. Configures CORS settings
    2. Sets up logging middleware
    3. Configures security middleware
    4. Returns the complete middleware stack in the correct order
    
    Returns:
        list: A list of middleware classes and functions to be included in Django settings
    """
    # Configure CORS settings first
    configure_cors()
    
    # Return the complete middleware stack in the correct order
    # The order is important as middleware are processed in sequence for requests
    # and in reverse sequence for responses
    return [
        # Security middleware should be at the beginning to enforce HTTPS
        # and add security headers
        SecurityMiddleware,
        
        # Django's built-in security middleware
        'django.middleware.security.SecurityMiddleware',
        
        # Session middleware
        'django.contrib.sessions.middleware.SessionMiddleware',
        
        # CORS middleware must be placed before CommonMiddleware
        'corsheaders.middleware.CorsMiddleware',
        
        # Django's common middleware
        'django.middleware.common.CommonMiddleware',
        
        # CSRF protection
        'django.middleware.csrf.CsrfViewMiddleware',
        
        # Authentication middleware
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        
        # Message middleware
        'django.contrib.messages.middleware.MessageMiddleware',
        
        # Clickjacking protection
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
        
        # Custom logging middleware for request/response logging
        LoggingMiddleware,
    ]