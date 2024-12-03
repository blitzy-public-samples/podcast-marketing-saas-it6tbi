"""
Podcast Audio Metadata Extractor

This module provides utility functions for extracting metadata from podcast audio files,
supporting operations like retrieving duration, format, and other relevant metadata.

Requirements Addressed:
- Podcast Metadata Extraction (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Provides utilities to extract metadata from audio files for episode management.

Human Tasks:
1. Verify that the mutagen library is installed with version 1.45.1
2. Ensure proper file permissions are set for accessing audio files
3. Review error handling and logging configuration
"""

import os
from typing import Dict, Union
import logging

# mutagen v1.45.1
from mutagen import File
from mutagen.mp3 import MP3
from mutagen.wave import WAVE
from mutagen.aac import AAC

from ...common.constants import SUPPORTED_AUDIO_FORMATS
from ...common.utils import process_audio_file

# Configure module logger
logger = logging.getLogger(__name__)

def extract_metadata(file_path: str) -> Dict[str, Union[float, str, int]]:
    """
    Extracts metadata from an audio file, including duration, format, and other relevant details.

    Args:
        file_path (str): Path to the audio file from which to extract metadata

    Returns:
        Dict[str, Union[float, str, int]]: A dictionary containing metadata with the following keys:
            - duration: Length of the audio in seconds
            - format: Audio file format (e.g., 'mp3', 'wav', 'aac')
            - file_size: Size of the file in bytes
            - bit_rate: Bit rate in bits per second (if available)
            - sample_rate: Sample rate in Hz (if available)
            - channels: Number of audio channels (if available)

    Raises:
        ValidationError: If the file format is not supported or file processing fails
        FileNotFoundError: If the specified file does not exist
        OSError: If there are permission issues or other OS-level errors
        Exception: For other unexpected errors during metadata extraction

    Requirements Addressed:
    - Podcast Metadata Extraction (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
      Extracts essential metadata for podcast episode management
    """
    try:
        # Verify file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Audio file not found: {file_path}")

        # Get file size in MB for validation
        file_size_bytes = os.path.getsize(file_path)
        file_size_mb = file_size_bytes / (1024 * 1024)

        # Get file extension and validate format
        _, file_extension = os.path.splitext(file_path.lower())
        if file_extension not in SUPPORTED_AUDIO_FORMATS:
            raise ValueError(f"Unsupported audio format: {file_extension}")

        # Process the audio file (includes validation)
        process_audio_file(os.path.basename(file_path), int(file_size_mb))

        # Initialize metadata dictionary
        metadata = {
            'file_size': file_size_bytes,
            'format': file_extension[1:]  # Remove the leading dot
        }

        # Load audio file using mutagen
        audio = File(file_path)
        if audio is None:
            raise ValueError("Failed to load audio file metadata")

        # Extract format-specific metadata
        if file_extension == '.mp3':
            mp3_file = MP3(file_path)
            metadata.update({
                'duration': mp3_file.info.length,
                'bit_rate': mp3_file.info.bitrate,
                'sample_rate': mp3_file.info.sample_rate,
                'channels': mp3_file.info.channels
            })
        elif file_extension == '.wav':
            wave_file = WAVE(file_path)
            metadata.update({
                'duration': wave_file.info.length,
                'sample_rate': wave_file.info.sample_rate,
                'channels': wave_file.info.channels
            })
        elif file_extension == '.aac':
            aac_file = AAC(file_path)
            metadata.update({
                'duration': aac_file.info.length,
                'bit_rate': getattr(aac_file.info, 'bitrate', None),
                'sample_rate': getattr(aac_file.info, 'sample_rate', None),
                'channels': getattr(aac_file.info, 'channels', None)
            })

        # Remove None values from metadata
        metadata = {k: v for k, v in metadata.items() if v is not None}

        logger.info(f"Successfully extracted metadata from {file_path}")
        return metadata

    except FileNotFoundError as e:
        logger.error(f"File not found error: {str(e)}")
        raise
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error extracting metadata from {file_path}: {str(e)}")
        raise