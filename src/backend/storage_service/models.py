"""
Storage Service Models Module

This module defines the database models for the storage service, particularly
the FileStorage model which handles metadata for files stored in AWS S3.

Requirements Addressed:
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Provides cloud-based distributed storage for audio files and transcripts.

Human Tasks:
1. Verify that the database migrations are applied correctly
2. Ensure AWS S3 bucket permissions are configured appropriately
3. Review file size limits against infrastructure capacity
"""

from django.db import models  # Django 4.2+
from src.backend.common.constants import (
    SUPPORTED_AUDIO_FORMATS,
    MAX_AUDIO_FILE_SIZE_MB
)
from src.backend.common.exceptions import ValidationError


class FileStorage(models.Model):
    """
    Represents metadata for files stored in AWS S3, including file name,
    size, format, and S3 URL.
    """
    
    # File metadata fields
    file_name = models.CharField(
        max_length=255,
        help_text="Original name of the uploaded file"
    )
    file_size = models.PositiveIntegerField(
        help_text="Size of the file in bytes"
    )
    file_format = models.CharField(
        max_length=10,
        help_text="File format extension (e.g., .mp3, .wav)"
    )
    s3_url = models.URLField(
        max_length=2048,
        help_text="Complete S3 URL for file access"
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the file was uploaded"
    )

    class Meta:
        db_table = 'storage_file_storage'
        indexes = [
            models.Index(fields=['file_name']),
            models.Index(fields=['uploaded_at']),
        ]
        verbose_name = 'File Storage'
        verbose_name_plural = 'File Storage'

    def __str__(self):
        """String representation of the FileStorage object."""
        return f"{self.file_name} ({self.file_format})"

    def validate_file_size(self) -> bool:
        """
        Validates if the file size is within the allowed limit.

        Returns:
            bool: True if the file size is valid

        Raises:
            ValidationError: If file size exceeds the maximum limit
        """
        max_size_bytes = MAX_AUDIO_FILE_SIZE_MB * 1024 * 1024  # Convert MB to bytes
        
        if self.file_size > max_size_bytes:
            raise ValidationError(
                f"File size ({self.file_size} bytes) exceeds the maximum "
                f"allowed size of {MAX_AUDIO_FILE_SIZE_MB}MB"
            )
        return True

    def validate_file_format(self) -> bool:
        """
        Validates if the file format is supported.

        Returns:
            bool: True if the file format is valid

        Raises:
            ValidationError: If file format is not supported
        """
        if self.file_format.lower() not in SUPPORTED_AUDIO_FORMATS:
            raise ValidationError(
                f"File format {self.file_format} is not supported. "
                f"Supported formats are: {', '.join(SUPPORTED_AUDIO_FORMATS)}"
            )
        return True

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to perform validations
        before saving the instance.
        """
        self.validate_file_size()
        self.validate_file_format()
        super().save(*args, **kwargs)