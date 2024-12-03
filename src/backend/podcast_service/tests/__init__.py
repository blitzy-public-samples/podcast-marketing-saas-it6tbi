"""
Test suite initialization for the podcast service module.

Requirements Addressed:
- Test Environment Configuration (7.3 Technical Decisions/7.3.1 Architecture Patterns):
  Ensures that the test suite for the podcast service is properly initialized and 
  integrated with the test environment.

Human Tasks:
1. Verify that test database settings are properly configured
2. Ensure test media storage is set up correctly
3. Review test coverage requirements and thresholds
4. Configure test logging settings if needed
"""

# django.test v4.2+
from django.test import TestCase

# Internal imports with relative paths
from .test_models import TestPodcastModels
from .test_views import TestPodcastViewSet
from .test_services import test_process_podcast_episode_valid
from ...core.settings.test import DATABASES

# Verify test database configuration
if DATABASES['default']['ENGINE'] != 'django.db.backends.sqlite3' or \
   DATABASES['default']['NAME'] != ':memory:':
    raise ValueError(
        "Test database must be configured to use in-memory SQLite for isolation"
    )

# Define test categories for better organization
model_tests = [
    TestPodcastModels.test_podcast_model_fields,
    TestPodcastModels.test_episode_model_fields
]

view_tests = [
    TestPodcastViewSet.test_list_podcasts,
    TestPodcastViewSet.test_create_podcast
]

service_tests = [
    test_process_podcast_episode_valid
]

# Export test cases for discovery
__all__ = [
    'TestPodcastModels',
    'TestPodcastViewSet',
    'test_process_podcast_episode_valid'
]