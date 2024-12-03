"""
Marketing Service Database Models

This module defines the database models for managing social media posts and marketing campaigns.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Models support multi-platform post scheduling, content optimization, and campaign analytics.
- Social Media Integration (1.3 Scope/Implementation Boundaries/Supported Platforms):
  Models support integration with Facebook, Twitter, LinkedIn, and Instagram.

Human Tasks:
1. Configure database migrations for the new models
2. Set up social media platform API credentials in environment variables
3. Review and adjust any database indexes for performance optimization
4. Verify field lengths and constraints align with social media platform limits
"""

from django.db import models  # Django 4.2
from datetime import datetime
from ..common.exceptions import ValidationError
from ..common.utils import process_audio_file

# Platform choices for social media posts
PLATFORM_CHOICES = [
    ('FB', 'Facebook'),
    ('TW', 'Twitter'),
    ('LI', 'LinkedIn'),
    ('IG', 'Instagram')
]

# Status choices for social media posts
STATUS_CHOICES = [
    ('DRAFT', 'Draft'),
    ('SCHEDULED', 'Scheduled'),
    ('PUBLISHED', 'Published'),
    ('FAILED', 'Failed')
]

class SocialMediaPost(models.Model):
    """
    Represents a social media post with platform-specific content and scheduling details.
    
    Requirements Addressed:
    - Social Media Integration: Supports multiple social media platforms
    - Marketing Automation: Enables post scheduling and status tracking
    """
    
    # Basic post information
    platform = models.CharField(
        max_length=2,
        choices=PLATFORM_CHOICES,
        help_text="Social media platform for the post"
    )
    content = models.TextField(
        max_length=2200,  # Accommodates longest platform limit (LinkedIn)
        help_text="Post content with platform-specific formatting"
    )
    scheduled_time = models.DateTimeField(
        help_text="Scheduled publication time for the post"
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='DRAFT',
        help_text="Current status of the post"
    )
    
    # Metadata fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Optional media attachments
    media_url = models.URLField(
        blank=True,
        null=True,
        help_text="URL to attached media content"
    )
    media_type = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        choices=[('IMAGE', 'Image'), ('VIDEO', 'Video'), ('AUDIO', 'Audio')],
        help_text="Type of attached media"
    )

    class Meta:
        indexes = [
            models.Index(fields=['platform', 'status', 'scheduled_time']),
            models.Index(fields=['scheduled_time'])
        ]
        ordering = ['-scheduled_time']

    def clean(self):
        """Validates post content against platform-specific constraints."""
        platform_limits = {
            'FB': 63206,
            'TW': 280,
            'LI': 2200,
            'IG': 2200
        }
        
        if len(self.content) > platform_limits[self.platform]:
            raise ValidationError(
                f"Content exceeds {self.platform} character limit of {platform_limits[self.platform]}"
            )

    def publish(self) -> bool:
        """
        Publishes the post to the specified social media platform.
        
        Returns:
            bool: True if successfully published, False otherwise
        """
        try:
            self.clean()
            
            # Process any attached audio files
            if self.media_type == 'AUDIO' and self.media_url:
                # Extract filename and size from media_url
                # This is a simplified example - actual implementation would need proper file handling
                filename = self.media_url.split('/')[-1]
                file_size_mb = 0  # Would be calculated from actual file
                process_audio_file(filename, file_size_mb)
            
            # Platform-specific publishing logic would be implemented here
            # This would typically involve calling the respective platform's API
            
            self.status = 'PUBLISHED'
            self.save()
            return True
            
        except ValidationError as e:
            self.status = 'FAILED'
            self.save()
            return False
        except Exception:
            self.status = 'FAILED'
            self.save()
            return False


class MarketingCampaign(models.Model):
    """
    Represents a marketing campaign that groups related social media posts together.
    
    Requirements Addressed:
    - Marketing Automation: Enables campaign management and analytics
    """
    
    name = models.CharField(
        max_length=200,
        help_text="Name of the marketing campaign"
    )
    start_date = models.DateTimeField(
        help_text="Campaign start date and time"
    )
    end_date = models.DateTimeField(
        help_text="Campaign end date and time"
    )
    description = models.TextField(
        blank=True,
        help_text="Detailed campaign description"
    )
    
    # Campaign status
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the campaign is currently active"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['start_date', 'end_date']),
            models.Index(fields=['is_active'])
        ]
        ordering = ['-start_date']

    def clean(self):
        """Validates campaign dates."""
        if self.end_date <= self.start_date:
            raise ValidationError("End date must be after start date")

    def add_post(self, post: SocialMediaPost) -> bool:
        """
        Adds a social media post to the campaign.
        
        Args:
            post: SocialMediaPost instance to add to the campaign
            
        Returns:
            bool: True if post was successfully added
        """
        try:
            if not isinstance(post, SocialMediaPost):
                raise ValidationError("Invalid post type")
                
            # Create campaign post relationship
            CampaignPost.objects.create(
                campaign=self,
                post=post
            )
            return True
            
        except Exception:
            return False

    def get_campaign_insights(self) -> dict:
        """
        Retrieves aggregated analytics data for the campaign.
        
        Returns:
            dict: Aggregated metrics for the campaign
        """
        metrics = {
            'total_posts': 0,
            'posts_by_platform': {},
            'posts_by_status': {},
            'scheduled_posts': 0,
            'published_posts': 0,
            'failed_posts': 0
        }
        
        # Get all posts for the campaign
        campaign_posts = CampaignPost.objects.filter(campaign=self).select_related('post')
        
        for campaign_post in campaign_posts:
            post = campaign_post.post
            metrics['total_posts'] += 1
            
            # Count by platform
            platform = post.get_platform_display()
            metrics['posts_by_platform'][platform] = metrics['posts_by_platform'].get(platform, 0) + 1
            
            # Count by status
            status = post.status
            metrics['posts_by_status'][status] = metrics['posts_by_status'].get(status, 0) + 1
            
            # Update status counters
            if status == 'SCHEDULED':
                metrics['scheduled_posts'] += 1
            elif status == 'PUBLISHED':
                metrics['published_posts'] += 1
            elif status == 'FAILED':
                metrics['failed_posts'] += 1
        
        return metrics


class CampaignPost(models.Model):
    """
    Associates social media posts with marketing campaigns.
    
    This is a junction table that allows many-to-many relationship
    between campaigns and posts with additional metadata.
    """
    
    campaign = models.ForeignKey(
        MarketingCampaign,
        on_delete=models.CASCADE,
        related_name='campaign_posts'
    )
    post = models.ForeignKey(
        SocialMediaPost,
        on_delete=models.CASCADE,
        related_name='post_campaigns'
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['campaign', 'post']
        indexes = [
            models.Index(fields=['campaign', 'post'])
        ]