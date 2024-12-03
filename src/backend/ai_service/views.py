"""
AI Service Views Module

This module defines the views for the AI service, providing endpoints for transcription
and content generation functionalities.

Requirements Addressed:
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Provides API endpoints for transcription and content generation functionalities.
- Automated transcription (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports API endpoints for automated transcription of audio files.
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Supports API endpoints for AI-driven content generation.

Human Tasks:
1. Review API endpoint documentation for completeness
2. Verify error handling aligns with frontend requirements
3. Configure appropriate rate limiting for production load
4. Monitor endpoint performance and resource utilization
"""

# Standard library imports
import logging

# Third-party imports
from rest_framework.views import APIView  # rest_framework v3.14+
from rest_framework.response import Response  # rest_framework v3.14+
from rest_framework import status  # rest_framework v3.14+

# Internal imports
from .models import TranscriptionTask, ContentGenerationTask
from .serializers import TranscriptionTaskSerializer, ContentGenerationTaskSerializer
from .services import (
    process_transcription_service,
    process_content_generation_service,
    process_audio_to_content_service
)
from src.backend.api.schema import SchemaView
from src.backend.api.throttling import CustomThrottle

# Configure module logger
logger = logging.getLogger(__name__)

class TranscriptionView(APIView):
    """
    View for handling transcription requests.
    
    Provides endpoints for creating and managing transcription tasks.
    """
    
    throttle_classes = [CustomThrottle]
    
    def post(self, request):
        """
        Handle POST requests to create a new transcription task.
        
        Args:
            request (HttpRequest): The incoming request containing audio file path
            
        Returns:
            Response: The transcription task details or error message
            
        Requirements Addressed:
        - Automated transcription (1.3 Scope/AI Services):
          Implements endpoint for audio file transcription
        """
        try:
            logger.info("Received transcription request")
            
            # Validate request data using serializer
            serializer = TranscriptionTaskSerializer(data=request.data)
            serializer.validate_audio_file_path(request.data.get('audio_file_path'))
            
            # Process transcription
            result = process_transcription_service(
                audio_file_path=request.data.get('audio_file_path')
            )
            
            logger.info(f"Transcription task created successfully: {result['task_id']}")
            return Response(result, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Transcription request failed: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class ContentGenerationView(APIView):
    """
    View for handling content generation requests.
    
    Provides endpoints for creating and managing content generation tasks.
    """
    
    throttle_classes = [CustomThrottle]
    
    def post(self, request):
        """
        Handle POST requests to create a new content generation task.
        
        Args:
            request (HttpRequest): The incoming request containing prompt and parameters
            
        Returns:
            Response: The content generation task details or error message
            
        Requirements Addressed:
        - AI Content Generation (1.3 Scope/AI Services):
          Implements endpoint for AI-driven content generation
        """
        try:
            logger.info("Received content generation request")
            
            # Validate request data using serializer
            serializer = ContentGenerationTaskSerializer(data=request.data)
            serializer.validate_prompt(request.data.get('prompt'))
            
            # Process content generation
            result = process_content_generation_service(
                prompt=request.data.get('prompt'),
                max_tokens=request.data.get('max_tokens', 2048),
                temperature=request.data.get('temperature', 0.7)
            )
            
            logger.info(f"Content generation task created successfully: {result['task_id']}")
            return Response(result, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Content generation request failed: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class AudioToContentView(APIView):
    """
    View for handling combined audio processing and content generation requests.
    
    Provides endpoints for processing audio files into transcriptions and generating content.
    """
    
    throttle_classes = [CustomThrottle]
    
    def post(self, request):
        """
        Handle POST requests to process audio into transcription and generated content.
        
        Args:
            request (HttpRequest): The incoming request containing audio file and parameters
            
        Returns:
            Response: The combined task details or error message
            
        Requirements Addressed:
        - AI Integration (1.2 System Overview):
          Implements endpoint for integrated audio processing and content generation
        """
        try:
            logger.info("Received audio-to-content request")
            
            # Validate audio file path
            serializer = TranscriptionTaskSerializer(data=request.data)
            serializer.validate_audio_file_path(request.data.get('audio_file_path'))
            
            # Process audio to content
            result = process_audio_to_content_service(
                audio_file_path=request.data.get('audio_file_path'),
                max_tokens=request.data.get('max_tokens', 2048),
                temperature=request.data.get('temperature', 0.7)
            )
            
            logger.info(
                f"Audio-to-content task created successfully: "
                f"Transcription: {result['transcription_task_id']}, "
                f"Content: {result['content_task_id']}"
            )
            return Response(result, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Audio-to-content request failed: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )