"""
Serializers for the AI service models, enabling validation and transformation of data for API interactions.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides serializers to validate and transform data for AI-driven transcription and content generation tasks.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports data validation and transformation for automated transcription tasks.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports data validation and transformation for AI-driven content generation tasks.

Human Tasks:
1. Review the maximum length constraints for audio_file_path and prompt fields
2. Verify that the datetime format matches the API requirements
3. Ensure the validation rules align with the business requirements
"""

# rest_framework v3.14+
from rest_framework import serializers

from .models import TranscriptionTask, ContentGenerationTask
from src.backend.common.constants import SUPPORTED_AUDIO_FORMATS, MAX_AUDIO_FILE_SIZE_MB
from src.backend.common.exceptions import ValidationError


class TranscriptionTaskSerializer(serializers.ModelSerializer):
    """
    Serializer for the TranscriptionTask model, validating and transforming data for API interactions.
    """
    
    uuid = serializers.UUIDField(source='id', read_only=True)
    audio_file_path = serializers.CharField(
        max_length=512,
        required=True,
        help_text=f"S3 path to the audio file. Supported formats: {', '.join(SUPPORTED_AUDIO_FORMATS)}"
    )
    transcription_text = serializers.CharField(
        read_only=True,
        allow_null=True,
        help_text="The transcribed text output from Whisper AI"
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    status = serializers.CharField(read_only=True)
    error_message = serializers.CharField(read_only=True, allow_null=True)

    class Meta:
        model = TranscriptionTask
        fields = [
            'uuid', 'audio_file_path', 'transcription_text', 
            'created_at', 'updated_at', 'status', 'error_message'
        ]

    def validate_audio_file_path(self, value: str) -> str:
        """
        Validates the audio file path field.

        Args:
            value (str): The audio file path to validate

        Returns:
            str: The validated audio file path

        Raises:
            ValidationError: If the file path is invalid or unsupported
        """
        if not value:
            raise ValidationError(message="Audio file path cannot be empty")

        # Check if the file extension is supported
        if not any(value.lower().endswith(fmt) for fmt in SUPPORTED_AUDIO_FORMATS):
            raise ValidationError(
                message=f"Unsupported audio format. Supported formats: {', '.join(SUPPORTED_AUDIO_FORMATS)}"
            )

        # Basic S3 path validation
        if not value.startswith('s3://'):
            raise ValidationError(message="Invalid S3 path format. Must start with 's3://'")

        return value


class ContentGenerationTaskSerializer(serializers.ModelSerializer):
    """
    Serializer for the ContentGenerationTask model, validating and transforming data for API interactions.
    """
    
    uuid = serializers.UUIDField(source='id', read_only=True)
    prompt = serializers.CharField(
        required=True,
        help_text="Input prompt for content generation"
    )
    generated_content = serializers.CharField(
        read_only=True,
        allow_null=True,
        help_text="The AI-generated content output"
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    status = serializers.CharField(read_only=True)
    error_message = serializers.CharField(read_only=True, allow_null=True)

    class Meta:
        model = ContentGenerationTask
        fields = [
            'uuid', 'prompt', 'generated_content', 
            'created_at', 'updated_at', 'status', 'error_message'
        ]

    def validate_prompt(self, value: str) -> str:
        """
        Validates the prompt field.

        Args:
            value (str): The prompt to validate

        Returns:
            str: The validated prompt

        Raises:
            ValidationError: If the prompt is empty or invalid
        """
        if not value:
            raise ValidationError(message="Prompt cannot be empty")

        # Check minimum length requirement
        if len(value.strip()) < 10:
            raise ValidationError(message="Prompt must be at least 10 characters long")

        # Check maximum length requirement
        if len(value) > 1000:
            raise ValidationError(message="Prompt cannot exceed 1000 characters")

        return value.strip()