"""
Social Platforms Integration Module

This module provides a unified interface for integrating with various social media platforms,
enabling consistent content distribution and scheduling across platforms.

Requirements Addressed:
- Social Media Integration (1.3 Scope/Implementation Boundaries/Supported Platforms):
  Supports integration with Facebook, Twitter, LinkedIn, and Instagram for marketing content distribution.
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Provides a unified interface for multi-platform post scheduling and analytics retrieval.

Human Tasks:
1. Verify API credentials are properly configured for all social media platforms
2. Review rate limiting settings for each platform integration
3. Set up monitoring for cross-platform posting failures
4. Configure error notification channels for failed posts
"""

# Internal imports using relative paths based on the file's location
from .facebook import authenticate, post_to_facebook
from .twitter import post_to_twitter
from .linkedin import post_to_linkedin
from .instagram import schedule_post

# Export specific functions as per the JSON specification
__all__ = [
    'authenticate',      # Facebook authentication
    'post_to_facebook', # Facebook posting
    'post_to_twitter',  # Twitter posting
    'post_to_linkedin', # LinkedIn posting
    'schedule_post'     # Instagram scheduling
]

# Version information for the social platforms integration module
__version__ = '1.0.0'

# Platform support status
SUPPORTED_PLATFORMS = {
    'facebook': True,
    'twitter': True,
    'linkedin': True,
    'instagram': True
}

def is_platform_supported(platform: str) -> bool:
    """
    Checks if a given social media platform is supported by the module.
    
    Args:
        platform (str): Name of the social media platform to check
        
    Returns:
        bool: True if the platform is supported, False otherwise
        
    Requirements Addressed:
    - Social Media Integration: Provides platform support verification
    """
    return SUPPORTED_PLATFORMS.get(platform.lower(), False)