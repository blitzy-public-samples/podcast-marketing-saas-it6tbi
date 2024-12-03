"""
AI Service Tasks Module

This module defines asynchronous tasks for the AI service, including transcription,
content generation, and combined audio-to-content processing using Celery.

Requirements Addressed:
- Asynchronous Task Processing (7.3.1 Architecture Patterns):
  Provides asynchronous task definitions for transcription, content generation,
  and audio-to-content processing.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports asynchronous transcription of audio files using the Whisper AI model.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports asynchronous AI-driven content generation using GPT.
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides asynchronous tasks to integrate transcription and content generation.

Human Tasks:
1. Configure Celery worker instances with appropriate resource allocation
2. Set up monitoring for task queues and worker performance
3. Review task retry policies and error handling strategies
4. Configure task routing based on resource requirements
"""

# Standard library imports
import logging  # builtin

# Third-party imports
from celery import Celery  # celery==5.3.0

# Internal imports
from ..core.celery import celery_app
from .processors.whisper import transcribe_audio
from .processors.gpt import generate_content
from .processors.content_generator import process_audio_to_content

# Configure module logger
logger = logging.getLogger(__name__)

@celery_app.task
def transcription_task(audio_file_path: str) -> str:
    """
    Asynchronous task to transcribe an audio file using the Whisper AI model.

    Args:
        audio_file_path (str): Path to the audio file to be transcribed

    Returns:
        str: The transcribed text from the audio file

    Requirements Addressed:
    - Automated transcription (1.3 Scope/AI Services):
      Implements asynchronous audio transcription using Whisper AI
    """
    try:
        logger.info(f"Starting transcription task for file: {audio_file_path}")
        
        # Perform transcription
        transcribed_text = transcribe_audio(audio_file_path)
        
        logger.info(f"Transcription task completed successfully for: {audio_file_path}")
        return transcribed_text

    except Exception as e:
        logger.error(f"Transcription task failed: {str(e)}")
        raise

@celery_app.task
def content_generation_task(prompt: str, max_tokens: int, temperature: float) -> str:
    """
    Asynchronous task to generate AI-driven content using GPT.

    Args:
        prompt (str): The input prompt for content generation
        max_tokens (int): Maximum number of tokens in the response
        temperature (float): Controls randomness in the output (0.0 to 1.0)

    Returns:
        str: The generated content from GPT

    Requirements Addressed:
    - AI Content Generation (1.3 Scope/AI Services):
      Implements asynchronous content generation using GPT
    """
    try:
        logger.info("Starting content generation task")
        logger.debug(f"Generation parameters - max_tokens: {max_tokens}, temperature: {temperature}")
        
        # Generate content
        generated_content = generate_content(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        logger.info("Content generation task completed successfully")
        return generated_content

    except Exception as e:
        logger.error(f"Content generation task failed: {str(e)}")
        raise

@celery_app.task
def process_audio_and_generate_content_task(
    audio_file_path: str,
    max_tokens: int,
    temperature: float
) -> dict:
    """
    Asynchronous task to process an audio file by transcribing it and generating
    AI-driven content.

    Args:
        audio_file_path (str): Path to the audio file to be processed
        max_tokens (int): Maximum number of tokens for the generated content
        temperature (float): Controls randomness in content generation (0.0 to 1.0)

    Returns:
        dict: A dictionary containing:
            - transcription: The original transcribed text
            - generated_content: The AI-generated content based on the transcription

    Requirements Addressed:
    - AI Integration (1.2 System Overview):
      Implements asynchronous integration of transcription and content generation
    """
    try:
        logger.info(f"Starting audio-to-content processing task for: {audio_file_path}")
        
        # Process audio and generate content
        result = process_audio_to_content(
            audio_file_path=audio_file_path,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        logger.info("Audio-to-content processing task completed successfully")
        return result

    except Exception as e:
        logger.error(f"Audio-to-content processing task failed: {str(e)}")
        raise