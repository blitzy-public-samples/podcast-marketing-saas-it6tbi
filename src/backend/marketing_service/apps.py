"""
Django app configuration for the marketing service.

This module defines the configuration for the marketing_service Django app, which provides
foundational setup for marketing automation features including multi-platform post scheduling,
content optimization, and campaign analytics.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Provides the foundational configuration for the marketing service, enabling functionalities
  such as multi-platform post scheduling, content optimization, and campaign analytics.
"""

# django.apps.AppConfig - v4.2
from django.apps import AppConfig


class MarketingServiceConfig(AppConfig):
    """
    Configuration class for the marketing_service Django app.
    
    This class defines the basic configuration settings required for the marketing service
    app to function within the Django framework, including the database configuration and
    app naming.
    """
    
    # Use BigAutoField as the primary key type for all models in this app
    default_auto_field = 'django.db.models.BigAutoField'
    
    # Define the app name that Django will use to reference this app
    name = 'marketing_service'