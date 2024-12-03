"""
Marketing Service Views

This module defines API views for managing social media posts and marketing campaigns,
providing endpoints for scheduling posts and retrieving analytics.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Implements API endpoints for multi-platform post scheduling and campaign analytics.
- API Design (8.3 API Design/8.3.2 Interface Specifications):
  Provides RESTful views for handling marketing-related API requests.

Human Tasks:
1. Configure rate limiting for API endpoints
2. Set up monitoring for failed API requests
3. Review error messages for user-friendliness
4. Verify API endpoint security settings
"""

# Django REST Framework imports - version 3.14.0
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Internal imports - models
from .models import SocialMediaPost, MarketingCampaign

# Internal imports - serializers
from .serializers import SocialMediaPostSerializer, MarketingCampaignSerializer

# Internal imports - services
from .services import schedule_social_media_post, get_campaign_analytics

# Internal imports - permissions
from ..auth_service.permissions import IsAuthenticatedUser

# Internal imports - pagination
from ..common.pagination import get_paginated_response

import logging

# Configure module logger
logger = logging.getLogger(__name__)

class SocialMediaPostView(APIView):
    """
    Handles API requests for managing social media posts.
    
    Requirements Addressed:
    - Marketing Automation: Enables scheduling posts across multiple platforms
    """
    
    permission_classes = [IsAuthenticatedUser]
    
    def post(self, request):
        """
        Creates and schedules a new social media post.
        
        Args:
            request: HTTP request containing post data
            
        Returns:
            Response: JSON response with created post details or error message
        """
        try:
            logger.info("Processing social media post creation request")
            
            # Validate request data
            serializer = SocialMediaPostSerializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Post validation failed: {serializer.errors}")
                return Response(
                    {"error": "Invalid post data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Schedule the post
            post_data = serializer.validated_data
            success = schedule_social_media_post(
                platform=post_data['platform'],
                content=post_data['content'],
                scheduled_time=post_data['scheduled_time']
            )
            
            if success:
                logger.info("Successfully scheduled social media post")
                return Response(
                    {"message": "Post scheduled successfully", "data": serializer.data},
                    status=status.HTTP_201_CREATED
                )
            else:
                logger.error("Failed to schedule social media post")
                return Response(
                    {"error": "Failed to schedule post"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            logger.error(f"Error processing post request: {str(e)}")
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MarketingCampaignView(APIView):
    """
    Handles API requests for managing marketing campaigns.
    
    Requirements Addressed:
    - Marketing Automation: Enables campaign management and analytics retrieval
    """
    
    permission_classes = [IsAuthenticatedUser]
    
    def post(self, request):
        """
        Creates a new marketing campaign.
        
        Args:
            request: HTTP request containing campaign data
            
        Returns:
            Response: JSON response with created campaign details or error message
        """
        try:
            logger.info("Processing marketing campaign creation request")
            
            # Validate request data
            serializer = MarketingCampaignSerializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Campaign validation failed: {serializer.errors}")
                return Response(
                    {"error": "Invalid campaign data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create the campaign
            campaign = serializer.save()
            logger.info(f"Successfully created campaign with ID: {campaign.id}")
            
            return Response(
                {"message": "Campaign created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Error creating campaign: {str(e)}")
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request, campaign_id):
        """
        Retrieves analytics for a specific marketing campaign.
        
        Args:
            request: HTTP request
            campaign_id: ID of the campaign to retrieve analytics for
            
        Returns:
            Response: JSON response with campaign analytics or error message
        """
        try:
            logger.info(f"Retrieving analytics for campaign {campaign_id}")
            
            # Get campaign analytics
            analytics = get_campaign_analytics(campaign_id)
            
            if analytics:
                # Generate paginated response if needed
                if request.query_params.get('page'):
                    page = int(request.query_params.get('page', 1))
                    analytics = get_paginated_response(
                        items=analytics,
                        page_number=page
                    )
                
                logger.info(f"Successfully retrieved analytics for campaign {campaign_id}")
                return Response(
                    {"data": analytics},
                    status=status.HTTP_200_OK
                )
            else:
                logger.error(f"Campaign not found: {campaign_id}")
                return Response(
                    {"error": "Campaign not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except ValueError as ve:
            logger.error(f"Invalid campaign ID format: {campaign_id}")
            return Response(
                {"error": "Invalid campaign ID format"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error retrieving campaign analytics: {str(e)}")
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )