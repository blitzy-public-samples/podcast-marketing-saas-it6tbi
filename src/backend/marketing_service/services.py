"""
Marketing Service Core Business Logic

This module implements core business logic for scheduling, posting, and retrieving analytics
for social media marketing campaigns across multiple platforms.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Implements core business logic for multi-platform post scheduling, content optimization,
  and campaign analytics.
- Social Media Integration (1.3 Scope/Implementation Boundaries/Supported Platforms):
  Provides integration with Facebook, Twitter, LinkedIn, and Instagram for marketing content
  distribution.

Human Tasks:
1. Configure social media platform API credentials in environment variables
2. Review and adjust rate limiting settings for each platform
3. Set up monitoring for failed posts and analytics retrieval
4. Configure logging infrastructure for service operations
"""

# Standard library imports
import logging
from datetime import datetime

# Internal imports - models and serializers
from .models import SocialMediaPost, MarketingCampaign
from .serializers import SocialMediaPostSerializer

# Internal imports - platform-specific modules
from .social_platforms.facebook import post_to_facebook
from .social_platforms.twitter import post_to_twitter
from .social_platforms.linkedin import post_to_linkedin
from .social_platforms.instagram import schedule_post

# Configure module logger
logger = logging.getLogger(__name__)

def schedule_social_media_post(platform: str, content: str, scheduled_time: datetime) -> bool:
    """
    Schedules a social media post on a specified platform.

    Args:
        platform (str): Target social media platform code (FB, TW, LI, IG)
        content (str): Content to be posted
        scheduled_time (datetime): Scheduled time for the post

    Returns:
        bool: True if post was successfully scheduled, False otherwise

    Requirements Addressed:
    - Marketing Automation: Enables scheduling posts across multiple platforms
    - Social Media Integration: Supports multiple social media platforms
    """
    try:
        logger.info(f"Scheduling post for platform {platform} at {scheduled_time}")

        # Validate input data using serializer
        serializer = SocialMediaPostSerializer(data={
            'platform': platform,
            'content': content,
            'scheduled_time': scheduled_time,
            'status': 'SCHEDULED'
        })
        
        if not serializer.is_valid():
            logger.error(f"Validation failed: {serializer.errors}")
            return False

        # Create social media post instance
        post = SocialMediaPost(
            platform=platform,
            content=content,
            scheduled_time=scheduled_time,
            status='SCHEDULED'
        )
        post.clean()
        post.save()

        # Route to platform-specific posting function
        platform_functions = {
            'FB': post_to_facebook,
            'TW': post_to_twitter,
            'LI': post_to_linkedin,
            'IG': schedule_post
        }

        if platform not in platform_functions:
            logger.error(f"Unsupported platform: {platform}")
            return False

        # Call platform-specific function
        success = platform_functions[platform](content, scheduled_time)
        
        if success:
            logger.info(f"Successfully scheduled post for {platform}")
            return True
        else:
            logger.error(f"Failed to schedule post for {platform}")
            return False

    except Exception as e:
        logger.error(f"Error scheduling post: {str(e)}")
        return False

def get_campaign_analytics(campaign_id: str) -> dict:
    """
    Retrieves aggregated analytics data for a marketing campaign.

    Args:
        campaign_id (str): Unique identifier of the marketing campaign

    Returns:
        dict: Aggregated metrics including total likes, shares, and comments

    Requirements Addressed:
    - Marketing Automation: Provides campaign performance analytics
    """
    try:
        logger.info(f"Retrieving analytics for campaign {campaign_id}")

        # Retrieve campaign instance
        campaign = MarketingCampaign.objects.get(id=campaign_id)
        
        # Get campaign insights using the model method
        analytics = campaign.get_campaign_insights()
        
        logger.info(f"Successfully retrieved analytics for campaign {campaign_id}")
        return analytics

    except MarketingCampaign.DoesNotExist:
        logger.error(f"Campaign not found: {campaign_id}")
        return {}
    except Exception as e:
        logger.error(f"Error retrieving campaign analytics: {str(e)}")
        return {}

def schedule_post_task(platform: str, content: str, scheduled_time: datetime) -> bool:
    """
    Provides an asynchronous interface for scheduling social media posts.

    Args:
        platform (str): Target social media platform code
        content (str): Content to be posted
        scheduled_time (datetime): Scheduled time for the post

    Returns:
        bool: True if task was successfully scheduled, False otherwise

    Requirements Addressed:
    - Marketing Automation: Enables asynchronous post scheduling
    """
    try:
        logger.info(f"Creating async task for {platform} post at {scheduled_time}")

        # Validate input parameters
        if not platform or not content or not scheduled_time:
            logger.error("Missing required parameters")
            return False

        if scheduled_time <= datetime.now():
            logger.error("Scheduled time must be in the future")
            return False

        # Create social media post instance
        post = SocialMediaPost(
            platform=platform,
            content=content,
            scheduled_time=scheduled_time,
            status='DRAFT'
        )
        post.clean()
        post.save()

        # Schedule the actual post
        success = schedule_social_media_post(platform, content, scheduled_time)
        
        if success:
            post.status = 'SCHEDULED'
            post.save()
            logger.info(f"Successfully scheduled async task for {platform} post")
            return True
        else:
            post.status = 'FAILED'
            post.save()
            logger.error(f"Failed to schedule async task for {platform} post")
            return False

    except Exception as e:
        logger.error(f"Error scheduling async task: {str(e)}")
        return False