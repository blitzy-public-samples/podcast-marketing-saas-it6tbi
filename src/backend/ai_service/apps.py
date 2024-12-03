"""
Django Application Configuration for AI Service

This module defines the Django application configuration for the AI service,
enabling the integration of AI-driven transcription and content generation functionalities.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides the application configuration for the AI service, enabling integration
  with transcription and content generation functionalities.

Human Tasks:
1. Verify that the application is properly registered in INSTALLED_APPS
2. Ensure all required dependencies are installed and configured
3. Review logging configuration for the AI service
"""

# Django built-in
from django.apps import AppConfig

class AIServiceConfig(AppConfig):
    """
    Configuration class for the AI service Django application.
    
    This class configures the AI service application, which provides:
    - Audio transcription using Whisper AI
    - Content generation using GPT
    - Integration between transcription and content generation services
    """
    
    # Use BigAutoField as the primary key type for all models
    default_auto_field = 'django.db.models.BigAutoField'
    
    # Application name used for Django app registry
    name = 'ai_service'
    
    def ready(self):
        """
        Performs initialization tasks when the application is ready.
        
        This method is called by Django when the application is fully loaded.
        It's used to:
        1. Import signal handlers
        2. Initialize application-specific settings
        3. Set up any required connections or resources
        """
        # Import signal handlers to ensure they are registered
        from . import models  # Import models to register any signals
        from . import tasks  # Import tasks to register Celery tasks
        from . import services  # Import services to initialize any resources