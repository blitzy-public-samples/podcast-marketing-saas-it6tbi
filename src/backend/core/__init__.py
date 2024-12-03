"""
Core Module Initializer

This file initializes the core module of the Django backend application by consolidating
and exposing key components such as settings, middleware, and Celery configurations.

Requirements Addressed:
- Backend Initialization (7.3.1 Architecture Patterns):
  Provides a centralized initialization point for the core backend module, ensuring
  consistency and maintainability.

Human Tasks:
1. Verify environment variables are properly set in deployment configurations
2. Ensure Redis is running for Celery broker/backend if using default configuration
3. Review middleware order in production environment
4. Confirm logging directory permissions are set correctly
"""

# Internal imports using relative paths based on the JSON specification
from .settings import load_settings
from .middleware import initialize_middleware
from .celery import make_celery

# Export the required functions as specified in the JSON specification
__all__ = [
    'load_settings',
    'initialize_middleware',
    'make_celery'
]

# Initialize settings when the core module is imported
# This ensures that environment-specific configurations are loaded
load_settings()