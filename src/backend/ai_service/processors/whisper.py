"""
Whisper AI Model Integration Module

This module implements the Whisper AI model integration for transcribing audio files into text.
It provides functionality to process audio files and return their transcriptions.

Requirements Addressed:
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Implements automated transcription of audio files using the Whisper AI model.
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides transcription capabilities as part of the AI-driven functionalities.

Human Tasks:
1. Verify that the OpenAI API key is properly configured in the environment
2. Ensure sufficient GPU resources are available for Whisper model inference
3. Review error handling and retry strategies for API failures
4. Confirm audio file format compatibility with Whisper model requirements
"""

import logging
from typing import Optional

# openai-whisper v20231117
import whisper
from ..common.utils import process_audio_file

# Configure module logger
logger = logging.getLogger(__name__)

def transcribe_audio(audio_file_path: str) -> str:
    """
    Transcribes an audio file into text using the Whisper AI model.

    This function processes the audio file through validation checks and then
    uses the Whisper model to generate a text transcription of the audio content.

    Args:
        audio_file_path (str): Path to the audio file to be transcribed

    Returns:
        str: The transcribed text from the audio file

    Raises:
        ValidationError: If the audio file fails validation checks
        RuntimeError: If transcription fails due to model or processing errors

    Requirements Addressed:
    - Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
      Implements the core transcription functionality using Whisper AI
    """
    try:
        logger.info(f"Starting transcription process for file: {audio_file_path}")

        # Validate the audio file
        # Note: process_audio_file expects file name and size, extracting from path
        import os
        file_name = os.path.basename(audio_file_path)
        file_size_mb = os.path.getsize(audio_file_path) // (1024 * 1024)
        process_audio_file(file_name, file_size_mb)

        # Load the Whisper model (using the base model for balance of accuracy and speed)
        logger.debug("Loading Whisper model")
        model = whisper.load_model("base")

        # Perform transcription
        logger.info("Transcribing audio file")
        result = model.transcribe(audio_file_path)

        # Extract transcribed text
        transcribed_text = result["text"].strip()
        
        if not transcribed_text:
            raise RuntimeError("Transcription resulted in empty text")

        logger.info("Successfully transcribed audio file")
        logger.debug(f"Transcription length: {len(transcribed_text)} characters")

        return transcribed_text

    except Exception as e:
        logger.error(f"Failed to transcribe audio file: {str(e)}")
        raise RuntimeError(f"Transcription failed: {str(e)}")