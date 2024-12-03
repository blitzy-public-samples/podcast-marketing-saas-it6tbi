"""
AI Service Module Initialization

This module initializes the AI service by exposing key functionalities and components for 
transcription, content generation, and audio-to-content processing.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides a unified interface for AI-driven transcription and content generation functionalities.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports automated transcription of audio files using the Whisper AI model.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports AI-driven content generation using GPT.

Human Tasks:
1. Verify that all required AI service dependencies are installed and configured
2. Ensure proper environment variables are set for AI service API keys
3. Review logging configuration for AI service components
4. Validate integration points with external AI services
"""

# Import transcription functionality
from .processors.whisper import transcribe_audio

# Import content generation functionality
from .processors.gpt import generate_content

# Import unified audio-to-content processing
from .processors.content_generator import process_audio_to_content

# Import task models
from .models import (
    TranscriptionTask,
    ContentGenerationTask
)

# Import serializers
from .serializers import (
    TranscriptionTaskSerializer,
    ContentGenerationTaskSerializer
)

# Import asynchronous tasks
from .tasks import (
    transcription_task,
    content_generation_task,
    process_audio_and_generate_content_task
)

# Define package exports
__all__ = [
    # Core processing functions
    'transcribe_audio',
    'generate_content',
    'process_audio_to_content',
    
    # Task models
    'TranscriptionTask',
    'ContentGenerationTask',
    
    # Serializers
    'TranscriptionTaskSerializer',
    'ContentGenerationTaskSerializer',
    
    # Asynchronous tasks
    'transcription_task',
    'content_generation_task',
    'process_audio_and_generate_content_task'
]

# Version information
__version__ = '1.0.0'
__author__ = 'Podcast Automation Team'