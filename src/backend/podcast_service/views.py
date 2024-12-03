"""
Views for the podcast service, handling HTTP requests for podcast and episode management.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Implements API endpoints for creating, retrieving, updating, and deleting podcasts
  and episodes.
- API Design (8.3 API Design/8.3.2 Interface Specifications):
  Provides RESTful API endpoints following REST principles and best practices.

Human Tasks:
1. Review API endpoint security configuration
2. Configure rate limiting for API endpoints
3. Set up monitoring for API performance metrics
4. Verify error response format matches API documentation
"""

# rest_framework v3.14+
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
import logging

# Internal imports with relative paths
from .models import Podcast, Episode
from .serializers import PodcastSerializer, EpisodeSerializer
from .services import process_podcast_episode

# Configure module logger
logger = logging.getLogger(__name__)

class PodcastView(APIView):
    """
    Handles API requests for managing podcasts.
    
    Provides endpoints for:
    - GET: Retrieve all podcasts or a specific podcast by ID
    - POST: Create a new podcast
    """

    def get(self, request, podcast_id=None):
        """
        Retrieve all podcasts or a specific podcast by ID.

        Args:
            request: The HTTP request object
            podcast_id (int, optional): The ID of the specific podcast to retrieve

        Returns:
            Response: JSON response containing podcast data

        Requirements Addressed:
        - API Design: Implements RESTful GET endpoint for podcast retrieval
        """
        try:
            if podcast_id:
                logger.info(f"Retrieving podcast with ID: {podcast_id}")
                podcast = get_object_or_404(Podcast, id=podcast_id)
                serializer = PodcastSerializer(podcast)
                return Response(serializer.data)
            
            logger.info("Retrieving all podcasts")
            podcasts = Podcast.objects.all()
            serializer = PodcastSerializer(podcasts, many=True)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error retrieving podcast(s): {str(e)}")
            return Response(
                {"error": "Failed to retrieve podcast(s)"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Create a new podcast.

        Args:
            request: The HTTP request object containing podcast data

        Returns:
            Response: JSON response containing the created podcast data

        Requirements Addressed:
        - API Design: Implements RESTful POST endpoint for podcast creation
        - Podcast Management: Supports creation of new podcasts
        """
        try:
            logger.info("Creating new podcast")
            serializer = PodcastSerializer(data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Successfully created podcast: {serializer.data['id']}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            logger.error(f"Invalid podcast data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error creating podcast: {str(e)}")
            return Response(
                {"error": "Failed to create podcast"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EpisodeView(APIView):
    """
    Handles API requests for managing podcast episodes.
    
    Provides endpoints for:
    - GET: Retrieve all episodes or a specific episode by ID
    - POST: Create a new episode
    """

    def get(self, request, episode_id=None):
        """
        Retrieve all episodes or a specific episode by ID.

        Args:
            request: The HTTP request object
            episode_id (int, optional): The ID of the specific episode to retrieve

        Returns:
            Response: JSON response containing episode data

        Requirements Addressed:
        - API Design: Implements RESTful GET endpoint for episode retrieval
        """
        try:
            if episode_id:
                logger.info(f"Retrieving episode with ID: {episode_id}")
                episode = get_object_or_404(Episode, id=episode_id)
                serializer = EpisodeSerializer(episode)
                return Response(serializer.data)
            
            logger.info("Retrieving all episodes")
            episodes = Episode.objects.all()
            serializer = EpisodeSerializer(episodes, many=True)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error retrieving episode(s): {str(e)}")
            return Response(
                {"error": "Failed to retrieve episode(s)"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Create a new episode.

        Args:
            request: The HTTP request object containing episode data

        Returns:
            Response: JSON response containing the created episode data

        Requirements Addressed:
        - API Design: Implements RESTful POST endpoint for episode creation
        - Podcast Management: Supports creation of new episodes with audio processing
        """
        try:
            logger.info("Creating new episode")
            serializer = EpisodeSerializer(data=request.data)
            
            if serializer.is_valid():
                # Process the audio file and create episode
                audio_file = request.FILES.get('audio_file')
                if not audio_file:
                    logger.error("No audio file provided")
                    return Response(
                        {"error": "Audio file is required"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Calculate file size in MB
                file_size_mb = audio_file.size / (1024 * 1024)
                
                # Process the episode using the service
                episode_data = process_podcast_episode(
                    file_path=audio_file.temporary_file_path(),
                    file_size_mb=file_size_mb,
                    podcast_id=request.data.get('podcast')
                )

                logger.info(f"Successfully created episode: {episode_data['id']}")
                return Response(episode_data, status=status.HTTP_201_CREATED)
            
            logger.error(f"Invalid episode data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error creating episode: {str(e)}")
            return Response(
                {"error": f"Failed to create episode: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )