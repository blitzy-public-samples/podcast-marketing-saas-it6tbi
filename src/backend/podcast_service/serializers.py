"""
Serializers for the podcast service, handling data conversion and validation.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Supports podcast management by providing serializers to handle data conversion and 
  validation for Podcast and Episode models.

Human Tasks:
1. Review serializer field validation rules to ensure they align with business requirements
2. Configure appropriate error messages for validation failures in production environment
3. Verify that datetime serialization format matches frontend requirements
"""

# rest_framework v3.14+
from rest_framework import serializers

# Internal imports with relative paths
from .models import Podcast, Episode
from ..common.validators import validate_audio_file
from ..common.exceptions import ValidationError


class PodcastSerializer(serializers.ModelSerializer):
    """
    Serializer for the Podcast model, handling data conversion and validation
    for podcast creation and updates.
    """

    class Meta:
        model = Podcast
        fields = ['id', 'title', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_title(self, value):
        """
        Validate the podcast title.
        
        Args:
            value (str): The title to validate
            
        Returns:
            str: The validated title
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        if not value.strip():
            raise serializers.ValidationError("Podcast title cannot be empty")
        return value.strip()

    def validate_description(self, value):
        """
        Validate the podcast description.
        
        Args:
            value (str): The description to validate
            
        Returns:
            str: The validated description
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        if not value.strip():
            raise serializers.ValidationError("Podcast description cannot be empty")
        return value.strip()


class EpisodeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Episode model, handling data conversion and validation
    for episode creation and updates.
    """
    
    podcast_title = serializers.CharField(source='podcast.title', read_only=True)

    class Meta:
        model = Episode
        fields = [
            'id', 'podcast', 'podcast_title', 'title', 'audio_file',
            'duration', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_title(self, value):
        """
        Validate the episode title.
        
        Args:
            value (str): The title to validate
            
        Returns:
            str: The validated title
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        if not value.strip():
            raise serializers.ValidationError("Episode title cannot be empty")
        return value.strip()

    def validate_duration(self, value):
        """
        Validate the episode duration.
        
        Args:
            value (int): The duration to validate in seconds
            
        Returns:
            int: The validated duration
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        if value <= 0:
            raise serializers.ValidationError("Episode duration must be greater than 0")
        return value

    def validate_audio_file(self, value):
        """
        Validate the episode audio file.
        
        Args:
            value: The uploaded file object
            
        Returns:
            The validated file object
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        if not value:
            raise serializers.ValidationError("Audio file is required")

        try:
            # Convert file size to MB for validation
            file_size_mb = value.size / (1024 * 1024)
            validate_audio_file(value.name, file_size_mb)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        except Exception as e:
            raise serializers.ValidationError(f"Audio file validation failed: {str(e)}")

        return value

    def validate_podcast(self, value):
        """
        Validate the podcast reference.
        
        Args:
            value: The podcast instance
            
        Returns:
            The validated podcast instance
            
        Raises:
            serializers.ValidationError: If validation fails
        """
        if not value:
            raise serializers.ValidationError("Podcast reference is required")
        return value