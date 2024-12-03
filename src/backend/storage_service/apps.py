"""
Storage Service App Configuration

This module defines the Django app configuration for the storage_service app,
ensuring proper registration and integration within the Django project.

Requirements Addressed:
- Backend Configuration Management (7.3.1 Architecture Patterns):
  Ensures that the storage_service app is properly registered and integrated
  into the Django project.
"""

# Django imports
from django.apps import AppConfig  # django==4.2


class StorageServiceConfig(AppConfig):
    """
    Configuration class for the storage_service Django app.
    
    This class defines the basic configuration settings required for the
    storage_service app to be properly recognized and integrated into the
    Django project structure.
    """
    
    # Use BigAutoField as the primary key field type for all models by default
    default_auto_field = 'django.db.models.BigAutoField'
    
    # Define the app name that Django will use to reference this app
    name = 'storage_service'