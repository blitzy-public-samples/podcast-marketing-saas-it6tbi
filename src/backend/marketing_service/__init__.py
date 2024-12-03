"""
Marketing Service Module Initialization

This module initializes the marketing_service package and exposes key components for external use.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Provides an entry point for accessing functionalities related to multi-platform post scheduling,
  content optimization, and campaign analytics.
- Social Media Integration (1.3 Scope/Implementation Boundaries/Supported Platforms):
  Exposes components for integrating with Facebook, Twitter, LinkedIn, and Instagram for
  marketing content distribution.
"""

# Import models
from .models import (
    SocialMediaPost,
    MarketingCampaign
)

# Import serializers
from .serializers import (
    SocialMediaPostSerializer,
    MarketingCampaignSerializer
)

# Import services
from .services import (
    schedule_social_media_post,
    get_campaign_analytics
)

# Import tasks
from .tasks import (
    schedule_post_task,
    retrieve_campaign_analytics_task
)

# Import views
from .views import (
    SocialMediaPostView,
    MarketingCampaignView
)

# Define package version
__version__ = '1.0.0'

# Define all importable components
__all__ = [
    # Models
    'SocialMediaPost',
    'MarketingCampaign',
    
    # Serializers
    'SocialMediaPostSerializer',
    'MarketingCampaignSerializer',
    
    # Services
    'schedule_social_media_post',
    'get_campaign_analytics',
    
    # Tasks
    'schedule_post_task',
    'retrieve_campaign_analytics_task',
    
    # Views
    'SocialMediaPostView',
    'MarketingCampaignView'
]