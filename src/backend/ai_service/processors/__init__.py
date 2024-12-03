"""
AI Service Processors Module Initializer

This module consolidates and exposes key functionalities for transcription and AI-driven
content generation from the AI service processors.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides a unified interface for transcription and content generation functionalities.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports automated transcription of audio files using the Whisper AI model.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports AI-driven content generation using GPT.

Human Tasks:
1. Verify that all required AI service dependencies are properly installed
2. Ensure environment variables for AI services are correctly configured
3. Monitor API usage and costs for both Whisper and GPT services
4. Review logging configuration for proper tracking of AI service operations
"""

from .whisper import transcribe_audio
from .gpt import generate_content
from .content_generator import process_audio_to_content

# Define the public interface of the module
__all__ = [
    'transcribe_audio',
    'generate_content',
    'process_audio_to_content'
]