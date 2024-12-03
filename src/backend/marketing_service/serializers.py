"""
Marketing Service Serializers

This module defines serializers for transforming marketing-related data types into JSON format
and handling validation logic.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Provides serialization and validation for marketing-related data, supporting multi-platform
  post scheduling and campaign analytics.
- Social Media Integration (1.3 Scope/Implementation Boundaries/Supported Platforms):
  Supports serialization of data for integration with Facebook, Twitter, LinkedIn, and Instagram.

Human Tasks:
1. Review platform-specific character limits to ensure they match current API specifications
2. Verify datetime format configuration aligns with frontend requirements
3. Confirm validation error messages meet UX guidelines
"""

# rest_framework v3.14.0
from rest_framework import serializers

from .models import SocialMediaPost, MarketingCampaign, PLATFORM_CHOICES, STATUS_CHOICES


class SocialMediaPostSerializer(serializers.ModelSerializer):
    """
    Serializer for SocialMediaPost model, handling transformation and validation of social media post data.
    
    Requirements Addressed:
    - Social Media Integration: Validates platform-specific constraints
    - Marketing Automation: Enables post scheduling across multiple platforms
    """
    
    platform = serializers.ChoiceField(
        choices=PLATFORM_CHOICES,
        help_text="Social media platform for the post"
    )
    content = serializers.CharField(
        max_length=2200,
        help_text="Post content with platform-specific formatting"
    )
    scheduled_time = serializers.DateTimeField(
        help_text="Scheduled publication time for the post"
    )
    status = serializers.ChoiceField(
        choices=STATUS_CHOICES,
        help_text="Current status of the post"
    )

    class Meta:
        model = SocialMediaPost
        fields = ['id', 'platform', 'content', 'scheduled_time', 'status', 
                 'media_url', 'media_type', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_platform(self, platform):
        """
        Validates that the platform is supported and active.
        
        Args:
            platform (str): The social media platform code
            
        Returns:
            str: The validated platform code
            
        Raises:
            serializers.ValidationError: If the platform is invalid
        """
        platform_dict = dict(PLATFORM_CHOICES)
        if platform not in platform_dict:
            raise serializers.ValidationError(
                f"Invalid platform. Supported platforms are: {', '.join(platform_dict.values())}"
            )
        return platform

    def validate_content(self, content):
        """
        Validates content against platform-specific character limits.
        
        Args:
            content (str): The post content
            
        Returns:
            str: The validated content
            
        Raises:
            serializers.ValidationError: If content exceeds platform limits
        """
        platform = self.initial_data.get('platform')
        if platform:
            platform_limits = {
                'FB': 63206,
                'TW': 280,
                'LI': 2200,
                'IG': 2200
            }
            if len(content) > platform_limits[platform]:
                raise serializers.ValidationError(
                    f"Content exceeds {platform} character limit of {platform_limits[platform]}"
                )
        return content


class MarketingCampaignSerializer(serializers.ModelSerializer):
    """
    Serializer for MarketingCampaign model, handling transformation and validation of campaign data.
    
    Requirements Addressed:
    - Marketing Automation: Enables campaign management with date validation
    """
    
    name = serializers.CharField(
        max_length=200,
        help_text="Name of the marketing campaign"
    )
    start_date = serializers.DateTimeField(
        help_text="Campaign start date and time"
    )
    end_date = serializers.DateTimeField(
        help_text="Campaign end date and time"
    )
    posts = SocialMediaPostSerializer(
        many=True,
        read_only=True,
        source='campaign_posts.post',
        help_text="List of social media posts in this campaign"
    )

    class Meta:
        model = MarketingCampaign
        fields = ['id', 'name', 'start_date', 'end_date', 'description', 
                 'is_active', 'posts', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_dates(self, start_date, end_date):
        """
        Validates that the campaign end date is after the start date.
        
        Args:
            start_date (datetime): Campaign start date
            end_date (datetime): Campaign end date
            
        Returns:
            bool: True if dates are valid
            
        Raises:
            serializers.ValidationError: If end date is not after start date
        """
        if end_date <= start_date:
            raise serializers.ValidationError(
                "Campaign end date must be after start date"
            )
        return True

    def validate(self, data):
        """
        Performs cross-field validation for the campaign dates.
        
        Args:
            data (dict): The campaign data to validate
            
        Returns:
            dict: The validated data
            
        Raises:
            serializers.ValidationError: If date validation fails
        """
        if 'start_date' in data and 'end_date' in data:
            self.validate_dates(data['start_date'], data['end_date'])
        return data