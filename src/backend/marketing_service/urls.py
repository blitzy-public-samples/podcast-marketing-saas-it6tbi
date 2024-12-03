"""
Marketing Service URL Configuration

This module defines URL patterns for the marketing service API endpoints, enabling
functionalities such as scheduling social media posts and managing marketing campaigns.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Implements URL routing for API endpoints related to multi-platform post scheduling,
  content optimization, and campaign analytics.
- API Design (8.3 API Design/8.3.2 Interface Specifications):
  Defines URL patterns for accessing marketing-related API endpoints.

Human Tasks:
1. Verify API endpoint URLs match API documentation
2. Review URL patterns for RESTful compliance
3. Ensure rate limiting is configured for all endpoints
4. Set up monitoring for endpoint usage and performance
"""

# Django URL routing - version 4.2
from django.urls import path

# Import views from the marketing service
from .views import (
    SocialMediaPostView,
    MarketingCampaignView
)

# Define URL patterns for the marketing service
urlpatterns = [
    # Social Media Post endpoints
    path(
        'posts/schedule/',
        SocialMediaPostView.as_view(),
        name='schedule_post'
    ),
    
    # Marketing Campaign endpoints
    path(
        'campaigns/create/',
        MarketingCampaignView.as_view(),
        name='create_campaign'
    ),
    path(
        'campaigns/<str:campaign_id>/analytics/',
        MarketingCampaignView.as_view(),
        name='campaign_analytics'
    )
]