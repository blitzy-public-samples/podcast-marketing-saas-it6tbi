"""
AI Service Integration Module

This module provides high-level service functions that integrate transcription and content
generation functionalities, acting as a bridge between processors, models, and tasks.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides high-level service functions to integrate transcription and content generation.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports automated transcription of audio files using the Whisper AI model.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports AI-driven content generation using GPT.

Human Tasks:
1. Review error handling and logging configuration
2. Verify integration with task queue system
3. Monitor service performance and resource utilization
4. Validate input/output data formats with frontend requirements
"""

import logging
from .processors.whisper import transcribe_audio
from .processors.gpt import generate_content
from .processors.content_generator import process_audio_to_content
from .models import TranscriptionTask, ContentGenerationTask
from .serializers import TranscriptionTaskSerializer, ContentGenerationTaskSerializer
from .tasks import (
    transcription_task,
    content_generation_task,
    process_audio_and_generate_content_task
)

# Configure module logger
logger = logging.getLogger(__name__)

def process_transcription_service(audio_file_path: str) -> dict:
    """
    Handles the transcription of audio files by orchestrating the TranscriptionTask model
    and its serializer.

    Args:
        audio_file_path (str): Path to the audio file to be transcribed

    Returns:
        dict: A dictionary containing the transcription details

    Raises:
        ValidationError: If the audio file path is invalid
        RuntimeError: If transcription processing fails

    Requirements Addressed:
    - Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
      Implements the service layer for audio transcription
    """
    try:
        logger.info(f"Starting transcription service for file: {audio_file_path}")

        # Validate audio file path using serializer
        serializer = TranscriptionTaskSerializer(data={'audio_file_path': audio_file_path})
        serializer.validate_audio_file_path(audio_file_path)

        # Create transcription task instance
        transcription_task = TranscriptionTask.objects.create(
            audio_file_path=audio_file_path,
            status='PENDING'
        )

        # Perform transcription
        transcribed_text = transcription_task.perform_transcription()

        # Prepare response
        result = {
            'task_id': str(transcription_task.id),
            'audio_file_path': audio_file_path,
            'transcription': transcribed_text,
            'status': transcription_task.status
        }

        logger.info(f"Transcription service completed successfully for file: {audio_file_path}")
        return result

    except Exception as e:
        logger.error(f"Transcription service failed: {str(e)}")
        raise

def process_content_generation_service(
    prompt: str,
    max_tokens: int,
    temperature: float
) -> dict:
    """
    Handles the generation of AI-driven content by orchestrating the ContentGenerationTask
    model and its serializer.

    Args:
        prompt (str): The input prompt for content generation
        max_tokens (int): Maximum number of tokens in the response
        temperature (float): Controls randomness in the output (0.0 to 1.0)

    Returns:
        dict: A dictionary containing the generated content details

    Raises:
        ValidationError: If the prompt or parameters are invalid
        RuntimeError: If content generation fails

    Requirements Addressed:
    - AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
      Implements the service layer for content generation
    """
    try:
        logger.info("Starting content generation service")
        logger.debug(f"Generation parameters - max_tokens: {max_tokens}, temperature: {temperature}")

        # Validate prompt using serializer
        serializer = ContentGenerationTaskSerializer(data={'prompt': prompt})
        serializer.validate_prompt(prompt)

        # Create content generation task instance
        content_task = ContentGenerationTask.objects.create(
            prompt=prompt,
            status='PENDING'
        )

        # Generate content
        generated_content = content_task.generate_content_task()

        # Prepare response
        result = {
            'task_id': str(content_task.id),
            'prompt': prompt,
            'generated_content': generated_content,
            'status': content_task.status
        }

        logger.info("Content generation service completed successfully")
        return result

    except Exception as e:
        logger.error(f"Content generation service failed: {str(e)}")
        raise

def process_audio_to_content_service(
    audio_file_path: str,
    max_tokens: int,
    temperature: float
) -> dict:
    """
    Processes an audio file by transcribing it and generating AI-driven content.

    Args:
        audio_file_path (str): Path to the audio file to be processed
        max_tokens (int): Maximum number of tokens for the generated content
        temperature (float): Controls randomness in content generation (0.0 to 1.0)

    Returns:
        dict: A dictionary containing the transcription and generated content details

    Raises:
        ValidationError: If the input parameters are invalid
        RuntimeError: If processing fails

    Requirements Addressed:
    - AI Integration (1.2 System Overview/High-Level Description/AI Integration):
      Implements the integrated service for audio processing and content generation
    """
    try:
        logger.info(f"Starting audio-to-content service for file: {audio_file_path}")

        # First, process transcription
        transcription_result = process_transcription_service(audio_file_path)
        logger.info("Transcription phase completed successfully")

        # Use transcription as prompt for content generation
        content_result = process_content_generation_service(
            prompt=transcription_result['transcription'],
            max_tokens=max_tokens,
            temperature=temperature
        )
        logger.info("Content generation phase completed successfully")

        # Combine results
        result = {
            'transcription_task_id': transcription_result['task_id'],
            'content_task_id': content_result['task_id'],
            'audio_file_path': audio_file_path,
            'transcription': transcription_result['transcription'],
            'generated_content': content_result['generated_content'],
            'status': 'COMPLETED'
        }

        logger.info("Audio-to-content service completed successfully")
        return result

    except Exception as e:
        logger.error(f"Audio-to-content service failed: {str(e)}")
        raise