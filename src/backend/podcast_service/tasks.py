"""
Asynchronous tasks for the podcast service, leveraging Celery for distributed task execution.
These tasks handle resource-intensive operations such as audio transcription, metadata extraction,
and AI-driven content generation.

Requirements Addressed:
- Asynchronous Task Processing (7.3.1 Architecture Patterns):
  Provides asynchronous task execution for resource-intensive operations like audio transcription
  and metadata extraction.
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Integrates with AI services like Whisper and GPT for transcription and content generation.
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Supports podcast management by automating tasks such as transcription and metadata extraction.

Human Tasks:
1. Configure Celery worker instances based on system load
2. Monitor task queue lengths and processing times
3. Set up error alerting for failed tasks
4. Review memory allocation for audio processing tasks
5. Configure task retry policies based on production requirements
"""

# Standard library imports
import logging

# Third-party imports
from celery import shared_task  # celery==5.3.0

# Internal imports - using relative imports based on the project structure
from ..core.celery import celery_app
from ..ai_service.processors.whisper import transcribe_audio
from ..ai_service.processors.gpt import generate_content
from ..podcast_service.services import process_podcast_episode

# Configure module logger
logger = logging.getLogger(__name__)

@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=300,  # 5 minutes
    autoretry_for=(Exception,),
    retry_backoff=True
)
def transcribe_audio_task(self, audio_file_path: str) -> str:
    """
    Asynchronous task to transcribe an audio file using the Whisper AI model.

    Args:
        audio_file_path (str): Path to the audio file to be transcribed

    Returns:
        str: The transcribed text from the audio file

    Requirements Addressed:
    - AI Integration: Implements asynchronous audio transcription using Whisper AI
    - Asynchronous Task Processing: Handles resource-intensive transcription in background
    """
    try:
        logger.info(f"Starting audio transcription task for file: {audio_file_path}")
        
        # Call the transcribe_audio function from the Whisper processor
        transcribed_text = transcribe_audio(audio_file_path)
        
        if not transcribed_text:
            raise ValueError("Transcription resulted in empty text")
            
        logger.info(f"Successfully transcribed audio file: {audio_file_path}")
        logger.debug(f"Transcription length: {len(transcribed_text)} characters")
        
        return transcribed_text
        
    except Exception as e:
        logger.error(f"Failed to transcribe audio file: {str(e)}")
        raise self.retry(exc=e)

@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # 1 minute
    autoretry_for=(Exception,),
    retry_backoff=True
)
def generate_content_task(self, prompt: str, max_tokens: int = 2048, temperature: float = 0.7) -> str:
    """
    Asynchronous task to generate AI-driven content using the GPT model.

    Args:
        prompt (str): The input prompt for content generation
        max_tokens (int, optional): Maximum number of tokens in the response. Defaults to 2048.
        temperature (float, optional): Controls randomness in the output. Defaults to 0.7.

    Returns:
        str: The generated content from GPT

    Requirements Addressed:
    - AI Integration: Implements asynchronous content generation using GPT
    - Asynchronous Task Processing: Handles AI content generation in background
    """
    try:
        logger.info(f"Starting content generation task with prompt length: {len(prompt)}")
        logger.debug(f"Generation parameters - max_tokens: {max_tokens}, temperature: {temperature}")
        
        # Call the generate_content function from the GPT processor
        generated_content = generate_content(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        if not generated_content:
            raise ValueError("Content generation resulted in empty text")
            
        logger.info("Successfully generated content")
        logger.debug(f"Generated content length: {len(generated_content)} characters")
        
        return generated_content
        
    except Exception as e:
        logger.error(f"Failed to generate content: {str(e)}")
        raise self.retry(exc=e)

@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=180,  # 3 minutes
    autoretry_for=(Exception,),
    retry_backoff=True
)
def process_episode_task(self, file_path: str, file_size_mb: int, podcast_id: str) -> dict:
    """
    Asynchronous task to process a podcast episode by validating the audio file,
    extracting metadata, and saving the episode data.

    Args:
        file_path (str): Path to the audio file
        file_size_mb (int): Size of the audio file in megabytes
        podcast_id (str): ID of the podcast this episode belongs to

    Returns:
        dict: A dictionary containing the saved episode data

    Requirements Addressed:
    - Podcast Management: Implements asynchronous episode processing
    - Asynchronous Task Processing: Handles resource-intensive operations in background
    """
    try:
        logger.info(f"Starting episode processing task for file: {file_path}")
        logger.debug(f"Processing parameters - size: {file_size_mb}MB, podcast_id: {podcast_id}")
        
        # Call the process_podcast_episode function from the podcast service
        episode_data = process_podcast_episode(
            file_path=file_path,
            file_size_mb=file_size_mb,
            podcast_id=podcast_id
        )
        
        if not episode_data:
            raise ValueError("Episode processing resulted in no data")
            
        logger.info(f"Successfully processed episode: {episode_data.get('id')}")
        
        return episode_data
        
    except Exception as e:
        logger.error(f"Failed to process episode: {str(e)}")
        raise self.retry(exc=e)