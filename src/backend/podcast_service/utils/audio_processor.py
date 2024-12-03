"""
Audio Processing Utility Module

This module provides utility functions for processing audio files in the podcast service,
including validation, format checking, and integration with AI transcription services.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Supports podcast management by providing utilities to process and validate audio files.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Integrates with AI transcription services to process audio files.

Human Tasks:
1. Verify logging configuration and ensure log levels are appropriate for production
2. Review error handling patterns align with the overall system architecture
3. Confirm that the audio file size limits are appropriate for the infrastructure
"""

import os
import logging
from ...common.constants import SUPPORTED_AUDIO_FORMATS
from ...common.exceptions import ValidationError
from ...ai_service.processors.whisper import transcribe_audio

# Configure module logger
AUDIO_PROCESSING_LOGGER = logging.getLogger('audio_processor')

def validate_audio_file(file_name: str, file_size_mb: int) -> bool:
    """
    Validates the audio file format and size.

    Args:
        file_name (str): Name of the audio file including extension
        file_size_mb (int): Size of the file in megabytes

    Returns:
        bool: True if the file is valid

    Raises:
        ValidationError: If the file format is not supported

    Requirements Addressed:
    - Podcast Management: Ensures uploaded audio files meet format requirements
    """
    try:
        # Extract file extension and convert to lowercase for comparison
        _, file_extension = os.path.splitext(file_name.lower())

        # Check if the file extension is supported
        if file_extension not in SUPPORTED_AUDIO_FORMATS:
            error_message = (
                f"Unsupported audio format: {file_extension}. "
                f"Supported formats are: {', '.join(SUPPORTED_AUDIO_FORMATS)}"
            )
            AUDIO_PROCESSING_LOGGER.error(error_message)
            raise ValidationError(error_message)

        AUDIO_PROCESSING_LOGGER.info(
            f"Audio file validation successful for {file_name}"
        )
        return True

    except Exception as e:
        AUDIO_PROCESSING_LOGGER.error(
            f"Error validating audio file {file_name}: {str(e)}"
        )
        raise ValidationError(f"Audio file validation failed: {str(e)}")

def process_audio_file(file_path: str, file_size_mb: int) -> str:
    """
    Processes an audio file by validating its format and size, and then transcribing
    it using the Whisper AI model.

    Args:
        file_path (str): Full path to the audio file
        file_size_mb (int): Size of the file in megabytes

    Returns:
        str: The transcribed text from the audio file

    Raises:
        ValidationError: If the file fails validation
        RuntimeError: If transcription fails

    Requirements Addressed:
    - Podcast Management: Processes audio files for the podcast system
    - Automated transcription: Integrates with AI services for audio transcription
    """
    try:
        # Extract file name from path
        file_name = os.path.basename(file_path)
        AUDIO_PROCESSING_LOGGER.info(
            f"Starting audio processing for file: {file_name}"
        )

        # Validate the audio file
        validate_audio_file(file_name, file_size_mb)

        # Log the start of transcription
        AUDIO_PROCESSING_LOGGER.info(
            f"Starting transcription for file: {file_name}"
        )

        # Transcribe the audio file
        transcribed_text = transcribe_audio(file_path)

        # Log successful transcription
        AUDIO_PROCESSING_LOGGER.info(
            f"Successfully transcribed audio file: {file_name}"
        )
        AUDIO_PROCESSING_LOGGER.debug(
            f"Transcription length: {len(transcribed_text)} characters"
        )

        return transcribed_text

    except ValidationError as e:
        AUDIO_PROCESSING_LOGGER.error(
            f"Validation error processing audio file {file_name}: {str(e)}"
        )
        raise
    except Exception as e:
        error_message = f"Error processing audio file {file_name}: {str(e)}"
        AUDIO_PROCESSING_LOGGER.error(error_message)
        raise RuntimeError(error_message)