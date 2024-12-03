"""
Marketing Service Test Suite Initialization

This module initializes the test suite for the marketing service, aggregating all test cases
for models, services, views, and tasks.

Requirements Addressed:
- Centralized Test Initialization (7.3 Technical Decisions/7.3.2 Communication Patterns):
  Provides a single entry point for running all test cases related to the marketing service,
  ensuring consistency and maintainability in the test suite.
"""

# pytest v7.4.0
from .test_models import (
    TestSocialMediaPost,
    TestMarketingCampaign
)
from .test_services import (
    test_schedule_social_media_post,
    test_get_campaign_analytics
)
from .test_views import (
    test_create_marketing_campaign,
    test_schedule_social_media_post
)
from ...common.tests.test_utils import (
    test_process_audio_file_valid
)

# Export all test cases for discovery by pytest
__all__ = [
    # Model test cases
    'TestSocialMediaPost',
    'TestMarketingCampaign',
    
    # Service test cases
    'test_schedule_social_media_post',
    'test_get_campaign_analytics',
    
    # View test cases
    'test_create_marketing_campaign',
    'test_schedule_social_media_post',
    
    # Utility test cases
    'test_process_audio_file_valid'
]