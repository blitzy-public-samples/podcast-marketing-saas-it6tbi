"""
Database models for the AI service, handling transcription and content generation tasks.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides models to persist and manage AI-driven transcription and content generation tasks.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports automated transcription of audio files using the Whisper AI model.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports AI-driven content generation using GPT.

Human Tasks:
1. Verify that the database migrations have been applied
2. Ensure proper AWS S3 bucket configuration for audio file storage
3. Configure environment variables for AI service API keys
4. Review and adjust file size limits based on infrastructure capacity
"""

import uuid
from django.db import models  # Django built-in
from src.backend.common.exceptions import ValidationError

class TranscriptionTask(models.Model):
    """
    Model representing a transcription task for processing audio files using Whisper AI.
    
    Stores the audio file path, transcription results, and task metadata.
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the transcription task"
    )
    
    audio_file_path = models.CharField(
        max_length=512,
        help_text="S3 path to the audio file for transcription"
    )
    
    transcription_text = models.TextField(
        null=True,
        blank=True,
        help_text="The transcribed text output from Whisper AI"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the task was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the task was last updated"
    )
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('PROCESSING', 'Processing'),
            ('COMPLETED', 'Completed'),
            ('FAILED', 'Failed')
        ],
        default='PENDING',
        help_text="Current status of the transcription task"
    )
    
    error_message = models.TextField(
        null=True,
        blank=True,
        help_text="Error message if the transcription task failed"
    )

    class Meta:
        db_table = 'ai_transcription_tasks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['audio_file_path'])
        ]

    def perform_transcription(self) -> str:
        """
        Executes the transcription process for the associated audio file.
        
        Returns:
            str: The transcribed text from the audio file.
            
        Raises:
            ValidationError: If the audio file path is invalid or file is inaccessible.
        """
        try:
            # Validate the audio file path
            if not self.audio_file_path:
                raise ValidationError(message="Audio file path is required")
                
            # Update task status
            self.status = 'PROCESSING'
            self.save(update_fields=['status', 'updated_at'])
            
            # TODO: Implement Whisper AI API call here
            # This is a placeholder for the actual implementation
            transcribed_text = "Placeholder for transcribed text"
            
            # Update task with results
            self.transcription_text = transcribed_text
            self.status = 'COMPLETED'
            self.save(update_fields=['transcription_text', 'status', 'updated_at'])
            
            return transcribed_text
            
        except Exception as e:
            # Handle errors and update task status
            self.status = 'FAILED'
            self.error_message = str(e)
            self.save(update_fields=['status', 'error_message', 'updated_at'])
            raise ValidationError(message=f"Transcription failed: {str(e)}")


class ContentGenerationTask(models.Model):
    """
    Model representing a content generation task using GPT.
    
    Stores the input prompt and generated content along with task metadata.
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the content generation task"
    )
    
    prompt = models.TextField(
        help_text="Input prompt for content generation"
    )
    
    generated_content = models.TextField(
        null=True,
        blank=True,
        help_text="The AI-generated content output"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the task was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the task was last updated"
    )
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('PROCESSING', 'Processing'),
            ('COMPLETED', 'Completed'),
            ('FAILED', 'Failed')
        ],
        default='PENDING',
        help_text="Current status of the content generation task"
    )
    
    error_message = models.TextField(
        null=True,
        blank=True,
        help_text="Error message if the content generation task failed"
    )

    class Meta:
        db_table = 'ai_content_generation_tasks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at'])
        ]

    def generate_content_task(self) -> str:
        """
        Executes the content generation process using the GPT API.
        
        Returns:
            str: The generated content.
            
        Raises:
            ValidationError: If the prompt is invalid or API call fails.
        """
        try:
            # Validate the prompt
            if not self.prompt:
                raise ValidationError(message="Prompt is required")
            
            # Update task status
            self.status = 'PROCESSING'
            self.save(update_fields=['status', 'updated_at'])
            
            # TODO: Implement GPT API call here
            # This is a placeholder for the actual implementation
            generated_text = "Placeholder for generated content"
            
            # Update task with results
            self.generated_content = generated_text
            self.status = 'COMPLETED'
            self.save(update_fields=['generated_content', 'status', 'updated_at'])
            
            return generated_text
            
        except Exception as e:
            # Handle errors and update task status
            self.status = 'FAILED'
            self.error_message = str(e)
            self.save(update_fields=['status', 'error_message', 'updated_at'])
            raise ValidationError(message=f"Content generation failed: {str(e)}")