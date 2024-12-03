"""
Storage Service Serializers Module

This module defines serializers for the storage service, enabling validation and 
transformation of data between the FileStorage model and external representations.

Requirements Addressed:
- Data Validation and Transformation (7.3 Technical Decisions/7.3.2 Communication Patterns):
  Ensures that data inputs and outputs comply with predefined business rules and constraints.

Human Tasks:
1. Review validation error messages for clarity and consistency with UX guidelines
2. Verify that serializer fields align with API documentation and client expectations
3. Ensure validation rules match the business requirements
"""

# rest_framework v3.14
from rest_framework import serializers

from src.backend.storage_service.models import FileStorage
from src.backend.common.validators import validate_audio_file
from src.backend.common.constants import (
    SUPPORTED_AUDIO_FORMATS,
    MAX_AUDIO_FILE_SIZE_MB
)


class FileStorageSerializer(serializers.ModelSerializer):
    """
    Serializes and validates data for the FileStorage model, ensuring compliance 
    with business rules for audio file storage.
    """

    class Meta:
        model = FileStorage
        fields = ['file_name', 'file_size', 'file_format', 's3_url']
        read_only_fields = ['s3_url']

    def validate_file_size(self, value: int) -> int:
        """
        Validates the size of the uploaded file.

        Args:
            value (int): File size in bytes

        Returns:
            int: Validated file size

        Raises:
            serializers.ValidationError: If file size exceeds maximum limit
        """
        # Convert bytes to MB for validation
        file_size_mb = value / (1024 * 1024)
        
        if file_size_mb > MAX_AUDIO_FILE_SIZE_MB:
            raise serializers.ValidationError(
                f"File size ({file_size_mb:.2f}MB) exceeds the maximum "
                f"allowed size of {MAX_AUDIO_FILE_SIZE_MB}MB"
            )
        return value

    def validate_file_format(self, value: str) -> str:
        """
        Validates the format of the uploaded file.

        Args:
            value (str): File format extension

        Returns:
            str: Validated file format

        Raises:
            serializers.ValidationError: If file format is not supported
        """
        if not value.startswith('.'):
            value = f'.{value}'
            
        if value.lower() not in SUPPORTED_AUDIO_FORMATS:
            raise serializers.ValidationError(
                f"File format '{value}' is not supported. "
                f"Supported formats are: {', '.join(SUPPORTED_AUDIO_FORMATS)}"
            )
        return value

    def validate(self, data: dict) -> dict:
        """
        Performs cross-field validation using the validate_audio_file utility.

        Args:
            data (dict): Dictionary containing the serializer fields

        Returns:
            dict: Validated data dictionary

        Raises:
            serializers.ValidationError: If validation fails
        """
        try:
            # Convert bytes to MB for the validator
            file_size_mb = data['file_size'] / (1024 * 1024)
            validate_audio_file(data['file_name'], int(file_size_mb))
        except Exception as e:
            raise serializers.ValidationError(str(e))
            
        return data