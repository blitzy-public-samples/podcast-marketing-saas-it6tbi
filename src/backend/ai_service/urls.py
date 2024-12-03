"""
URL routing configuration for the AI service.

This module defines the URL patterns for the AI service, mapping endpoints to their
respective views for transcription, content generation, and audio-to-content processing.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides URL routing for AI-driven transcription and content generation functionalities.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports routing for automated transcription of audio files.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports routing for AI-driven content generation.

Human Tasks:
1. Verify API endpoint URLs match the API documentation
2. Ensure rate limiting is properly configured for production load
3. Review URL patterns for RESTful design compliance
4. Confirm schema endpoint is accessible to API consumers
"""

# Django built-in imports
from django.urls import path

# Internal imports
from .views import (
    TranscriptionView,
    ContentGenerationView,
    AudioToContentView
)
from src.backend.api.schema import SchemaView
from src.backend.api.versioning import get_version_from_request

# URL patterns for the AI service
urlpatterns = [
    # Transcription endpoint
    # Handles POST requests for audio file transcription
    path(
        'transcribe/',
        TranscriptionView.as_view(),
        name='transcribe'
    ),

    # Content generation endpoint
    # Handles POST requests for AI-driven content generation
    path(
        'generate/',
        ContentGenerationView.as_view(),
        name='generate'
    ),

    # Combined audio-to-content endpoint
    # Handles POST requests for processing audio into transcription and content
    path(
        'process-audio/',
        AudioToContentView.as_view(),
        name='process-audio'
    ),

    # API schema endpoint
    # Serves the OpenAPI schema for the AI service
    path(
        'schema/',
        SchemaView.as_view(),
        name='schema'
    ),
]