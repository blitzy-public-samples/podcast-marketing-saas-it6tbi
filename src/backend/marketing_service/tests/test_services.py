"""
Unit Tests for Marketing Service Core Business Logic

This module contains unit tests for validating the core business logic of the marketing service,
including social media post scheduling and campaign analytics.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Validates the correctness of multi-platform post scheduling, content optimization, and campaign analytics.
- Social Media Integration (1.3 Scope/Implementation Boundaries/Supported Platforms):
  Ensures proper integration with Facebook, Twitter, LinkedIn, and Instagram for marketing content distribution.

Human Tasks:
1. Configure test database with appropriate test data
2. Set up mock social media platform credentials for testing
3. Review test coverage metrics and add additional test cases as needed
4. Verify test environment matches production configuration
"""

# Third-party imports
import pytest  # version 7.4.0
from unittest.mock import Mock, patch

# Internal imports
from ..services import (
    schedule_social_media_post,
    get_campaign_analytics,
    schedule_post_task
)
from ..models import SocialMediaPost, MarketingCampaign
from ..social_platforms.facebook import post_to_facebook
from ..social_platforms.twitter import post_to_twitter
from ..social_platforms.linkedin import post_to_linkedin
from ..social_platforms.instagram import schedule_post

# Test data constants
TEST_CONTENT = "Test marketing post content"
TEST_CAMPAIGN_ID = "test-campaign-123"

@pytest.mark.parametrize("platform,post_func", [
    ("FB", "post_to_facebook"),
    ("TW", "post_to_twitter"),
    ("LI", "post_to_linkedin"),
    ("IG", "schedule_post")
])
def test_schedule_social_media_post(platform, post_func):
    """
    Tests the scheduling of social media posts across different platforms.
    
    Requirements Addressed:
    - Social Media Integration: Validates posting functionality for each supported platform
    - Marketing Automation: Ensures correct scheduling behavior
    """
    # Mock the platform-specific posting function
    with patch(f"src.backend.marketing_service.services.{post_func}") as mock_post:
        # Configure mock to return success
        mock_post.return_value = True
        
        # Test successful post scheduling
        result = schedule_social_media_post(
            platform=platform,
            content=TEST_CONTENT,
            scheduled_time="2024-01-01T12:00:00Z"
        )
        
        # Verify the post was scheduled successfully
        assert result is True
        mock_post.assert_called_once()
        
        # Verify correct parameters were passed
        call_args = mock_post.call_args[0]
        assert TEST_CONTENT in call_args
        
        # Test with invalid content
        result = schedule_social_media_post(
            platform=platform,
            content="",  # Empty content should fail
            scheduled_time="2024-01-01T12:00:00Z"
        )
        assert result is False

def test_get_campaign_analytics():
    """
    Tests the retrieval of analytics data for marketing campaigns.
    
    Requirements Addressed:
    - Marketing Automation: Validates campaign analytics functionality
    """
    # Mock the MarketingCampaign model and its methods
    with patch("src.backend.marketing_service.services.MarketingCampaign") as MockCampaign:
        # Configure mock campaign instance
        mock_campaign = Mock()
        mock_campaign.get_campaign_insights.return_value = {
            "total_posts": 10,
            "engagement_rate": 0.15,
            "total_likes": 500,
            "total_shares": 100
        }
        MockCampaign.objects.get.return_value = mock_campaign
        
        # Test successful analytics retrieval
        analytics = get_campaign_analytics(TEST_CAMPAIGN_ID)
        
        # Verify the analytics data
        assert isinstance(analytics, dict)
        assert analytics["total_posts"] == 10
        assert analytics["engagement_rate"] == 0.15
        assert analytics["total_likes"] == 500
        assert analytics["total_shares"] == 100
        
        # Verify the campaign was queried correctly
        MockCampaign.objects.get.assert_called_once_with(id=TEST_CAMPAIGN_ID)
        mock_campaign.get_campaign_insights.assert_called_once()
        
        # Test with non-existent campaign
        MockCampaign.objects.get.side_effect = MarketingCampaign.DoesNotExist
        analytics = get_campaign_analytics("non-existent-id")
        assert analytics == {}

def test_schedule_post_task():
    """
    Tests the asynchronous scheduling of social media posts.
    
    Requirements Addressed:
    - Marketing Automation: Validates asynchronous post scheduling functionality
    """
    # Mock the SocialMediaPost model and schedule_social_media_post function
    with patch("src.backend.marketing_service.services.schedule_social_media_post") as mock_schedule:
        # Configure mock to return success
        mock_schedule.return_value = True
        
        # Test successful task scheduling
        result = schedule_post_task(
            platform="FB",
            content=TEST_CONTENT,
            scheduled_time="2024-01-01T12:00:00Z"
        )
        
        # Verify the task was scheduled successfully
        assert result is True
        mock_schedule.assert_called_once()
        
        # Test scheduling with invalid parameters
        result = schedule_post_task(
            platform="",  # Empty platform should fail
            content=TEST_CONTENT,
            scheduled_time="2024-01-01T12:00:00Z"
        )
        assert result is False
        
        # Test scheduling with past datetime
        result = schedule_post_task(
            platform="FB",
            content=TEST_CONTENT,
            scheduled_time="2020-01-01T12:00:00Z"  # Past date should fail
        )
        assert result is False