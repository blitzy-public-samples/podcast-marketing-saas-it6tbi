# Django 4.2+ app configuration for the podcast service
# Requirement addressed: Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities)
# - Registers the podcast service application within the Django project, enabling podcast management features.

from django.apps import AppConfig  # version: 4.2+


class PodcastServiceConfig(AppConfig):
    """Configures the 'podcast_service' Django application."""
    
    # The name property is required by Django and must match the directory name
    # containing the application code
    name = 'podcast_service'