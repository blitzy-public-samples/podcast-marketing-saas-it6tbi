"""
Authentication Service App Configuration

This module defines the Django app configuration for the authentication service,
specifying app-level settings and initialization logic.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Provides a structured and secure authentication workflow, including user creation,
  authentication, and role-based access control.
"""

# Django imports - version 4.2+
from django.apps import AppConfig

class AuthServiceConfig(AppConfig):
    """
    Configuration class for the authentication service Django app.
    
    This class specifies the app name and default database field type for models,
    ensuring consistent configuration across the authentication service.
    """
    
    # Use BigAutoField as the primary key field type for all models
    default_auto_field = 'django.db.models.BigAutoField'
    
    # Specify the app name for Django to identify this application
    name = 'auth_service'