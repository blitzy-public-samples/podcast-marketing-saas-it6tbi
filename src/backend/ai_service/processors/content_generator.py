"""
Audio Processing and Content Generation Integration Module

This module provides a unified function to process audio files into AI-generated content
by integrating transcription and content generation functionalities.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides a unified function to process audio files into AI-generated content.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports automated transcription of audio files using the Whisper AI model.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports AI-driven content generation using GPT.

Human Tasks:
1. Review logging configuration to ensure proper tracking of the integrated process
2. Verify error handling aligns with the overall system error management strategy
3. Monitor system resources during parallel processing of audio and content generation
4. Validate the output format meets downstream system requirements
"""

import logging
from .whisper import transcribe_audio
from .gpt import generate_content
from ...common.exceptions import ValidationError

# Configure module logger
logger = logging.getLogger(__name__)

def process_audio_to_content(audio_file_path: str, max_tokens: int, temperature: float) -> dict:
    """
    Processes an audio file by transcribing it and generating AI-driven content.

    This function orchestrates the complete process of:
    1. Transcribing an audio file using Whisper AI
    2. Using the transcription to generate enhanced content using GPT

    Args:
        audio_file_path (str): Path to the audio file to be processed
        max_tokens (int): Maximum number of tokens for the generated content
        temperature (float): Controls randomness in content generation (0.0 to 1.0)

    Returns:
        dict: A dictionary containing:
            - transcription: The original transcribed text
            - generated_content: The AI-generated content based on the transcription

    Raises:
        ValidationError: If any validation checks fail during processing
        RuntimeError: If processing fails due to system or API errors

    Requirements Addressed:
    - AI Integration (1.2 System Overview):
      Implements the core integration of multiple AI services
    - Automated transcription (1.3 Scope/AI Services):
      Handles the audio transcription process
    - AI Content Generation (1.3 Scope/AI Services):
      Manages the content generation process
    """
    try:
        logger.info(f"Starting audio processing for file: {audio_file_path}")

        # Step 1: Transcribe the audio file
        logger.debug("Initiating audio transcription")
        transcription = transcribe_audio(audio_file_path)

        # Validate transcription result
        if not transcription or not isinstance(transcription, str):
            error_msg = "Transcription failed: Empty or invalid result"
            logger.error(error_msg)
            raise ValidationError(error_msg)

        logger.info(f"Successfully transcribed audio, length: {len(transcription)} characters")

        # Step 2: Generate content based on transcription
        logger.debug("Initiating content generation from transcription")
        generated_content = generate_content(
            prompt=transcription,
            max_tokens=max_tokens,
            temperature=temperature
        )

        # Validate generated content
        if not generated_content or not isinstance(generated_content, str):
            error_msg = "Content generation failed: Empty or invalid result"
            logger.error(error_msg)
            raise ValidationError(error_msg)

        logger.info(f"Successfully generated content, length: {len(generated_content)} characters")

        # Prepare the result dictionary
        result = {
            "transcription": transcription,
            "generated_content": generated_content
        }

        logger.info("Successfully completed audio processing and content generation")
        return result

    except ValidationError as e:
        logger.error(f"Validation error during processing: {str(e)}")
        raise ValidationError(f"Processing failed: {str(e)}")
    except Exception as e:
        error_msg = f"Unexpected error during audio processing: {str(e)}"
        logger.error(error_msg)
        raise RuntimeError(error_msg)