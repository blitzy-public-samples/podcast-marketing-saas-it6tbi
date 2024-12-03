"""
Database models for the podcast service, defining core entities for podcast and episode management.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Provides database models to store and manage podcast and episode data.

Human Tasks:
1. Configure appropriate storage backend for audio file uploads
2. Set up database migrations after model changes
3. Configure media file serving in Django settings
4. Review database indexes for performance optimization
"""

# django.db.models v4.2+
from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError as DjangoValidationError

# Internal imports with relative paths
from ..common.constants import SUPPORTED_AUDIO_FORMATS, MAX_AUDIO_FILE_SIZE_MB
from ..common.exceptions import ValidationError, FileSizeLimitExceeded


class Podcast(models.Model):
    """
    Represents a podcast entity in the database.
    
    This model stores metadata about a podcast including its title, description,
    and timestamps for creation and updates.
    """
    
    title = models.CharField(
        max_length=255,
        help_text="The title of the podcast"
    )
    description = models.TextField(
        help_text="Detailed description of the podcast"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the podcast was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the podcast was last updated"
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        """Validate podcast data before saving."""
        if not self.title:
            raise ValidationError("Podcast title cannot be empty")
        if not self.description:
            raise ValidationError("Podcast description cannot be empty")


def validate_audio_file_size(value):
    """
    Validate that the audio file size does not exceed the maximum limit.
    
    Args:
        value: The uploaded file object
        
    Raises:
        FileSizeLimitExceeded: If file size exceeds MAX_AUDIO_FILE_SIZE_MB
    """
    if value.size > MAX_AUDIO_FILE_SIZE_MB * 1024 * 1024:  # Convert MB to bytes
        raise FileSizeLimitExceeded(
            f"Audio file size cannot exceed {MAX_AUDIO_FILE_SIZE_MB}MB"
        )


class Episode(models.Model):
    """
    Represents an episode entity in the database.
    
    This model stores metadata about a podcast episode including its title,
    audio file, duration, and timestamps. It maintains a foreign key relationship
    with the Podcast model.
    """
    
    podcast = models.ForeignKey(
        Podcast,
        on_delete=models.CASCADE,
        related_name='episodes',
        help_text="The podcast this episode belongs to"
    )
    title = models.CharField(
        max_length=255,
        help_text="The title of the episode"
    )
    audio_file = models.FileField(
        upload_to='episodes/audio/%Y/%m/%d/',
        validators=[
            FileExtensionValidator(
                allowed_extensions=[fmt.strip('.') for fmt in SUPPORTED_AUDIO_FORMATS]
            ),
            validate_audio_file_size
        ],
        help_text=f"Audio file for the episode. Supported formats: {', '.join(SUPPORTED_AUDIO_FORMATS)}"
    )
    duration = models.PositiveIntegerField(
        help_text="Duration of the episode in seconds"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the episode was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the episode was last updated"
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['created_at']),
            models.Index(fields=['podcast', 'created_at']),
        ]

    def __str__(self):
        return f"{self.podcast.title} - {self.title}"

    def clean(self):
        """Validate episode data before saving."""
        if not self.title:
            raise ValidationError("Episode title cannot be empty")
        if not self.audio_file:
            raise ValidationError("Audio file is required")
        if self.duration <= 0:
            raise ValidationError("Episode duration must be greater than 0")
        
        try:
            # Ensure the audio file is validated
            self.audio_file.file.seek(0)  # Reset file pointer
            validate_audio_file_size(self.audio_file)
        except AttributeError:
            # Handle the case where file is not yet uploaded
            pass
        except Exception as e:
            raise ValidationError(f"Audio file validation failed: {str(e)}")

    def save(self, *args, **kwargs):
        """Override save method to ensure validation is performed."""
        self.full_clean()
        super().save(*args, **kwargs)