"""
Podcast Service Module Initialization

This module initializes the podcast service, making its components accessible for use
in other parts of the application.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Supports podcast management by exposing models, serializers, services, and utilities
  for handling podcasts and episodes.
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Facilitates AI-driven features like transcription and content generation by exposing
  relevant services and tasks.
"""

# Import models
from .models import (
    Podcast,
    Episode
)

# Import serializers
from .serializers import (
    PodcastSerializer,
    EpisodeSerializer
)

# Import services
from .services import process_podcast_episode

# Import tasks
from .tasks import (
    transcribe_audio_task,
    generate_content_task
)

# Import views
from .views import (
    PodcastView,
    EpisodeView
)

# Import URL router
from .urls import router

# Import utilities
from .utils.audio_processor import validate_audio_file
from .utils.metadata_extractor import extract_metadata

# Define the items that should be available when importing from this module
__all__ = [
    # Models
    'Podcast',
    'Episode',
    
    # Serializers
    'PodcastSerializer',
    'EpisodeSerializer',
    
    # Services
    'process_podcast_episode',
    
    # Tasks
    'transcribe_audio_task',
    'generate_content_task',
    
    # Views
    'PodcastView',
    'EpisodeView',
    
    # URL Router
    'router',
    
    # Utilities
    'validate_audio_file',
    'extract_metadata'
]