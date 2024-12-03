"""
Analytics Service Models

This module defines the data models for storing and managing analytics data for podcasts
and marketing campaigns.

Requirements Addressed:
- Analytics Data Storage (7.2 Component Details/Analytics Service):
  Implements models to store and manage engagement and performance metrics data.

Human Tasks:
1. Review database indexes for optimal query performance
2. Verify foreign key relationships with podcast and campaign models
3. Confirm that the metric fields' precision matches reporting requirements
"""

from django.db import models  # django version 4.2
import pandas as pd  # pandas version 2.0.3
from .metrics.engagement import calculate_engagement_rate
from .metrics.performance import generate_performance_insights


class EngagementMetric(models.Model):
    """
    A model representing engagement metrics for podcasts and marketing campaigns.
    
    This model stores various engagement metrics such as likes, shares, comments,
    and impressions, along with timestamps for trend analysis.
    
    Requirements Addressed:
    - Analytics Data Storage: Implements storage for engagement metrics
    """
    
    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=models.UUIDField.default
    )
    
    podcast = models.ForeignKey(
        'podcast.Podcast',
        on_delete=models.CASCADE,
        related_name='engagement_metrics',
        help_text='The podcast associated with these engagement metrics'
    )
    
    likes = models.IntegerField(
        default=0,
        help_text='Number of likes/reactions received'
    )
    
    shares = models.IntegerField(
        default=0,
        help_text='Number of times the content was shared'
    )
    
    comments = models.IntegerField(
        default=0,
        help_text='Number of comments received'
    )
    
    impressions = models.IntegerField(
        default=0,
        help_text='Total number of times the content was displayed'
    )
    
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text='When these metrics were recorded'
    )
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['podcast', 'timestamp']),
            models.Index(fields=['timestamp'])
        ]
    
    def calculate_rate(self) -> float:
        """
        Calculates the engagement rate for the metric.
        
        Returns:
            float: The engagement rate as a percentage.
            
        Requirements Addressed:
        - Analytics Data Storage: Implements engagement rate calculation
        """
        return calculate_engagement_rate(
            likes=self.likes,
            shares=self.shares,
            comments=self.comments,
            impressions=self.impressions
        )


class PerformanceMetric(models.Model):
    """
    A model representing performance metrics for marketing campaigns.
    
    This model stores calculated performance metrics including engagement rates
    and growth rates for marketing campaign analysis.
    
    Requirements Addressed:
    - Analytics Data Storage: Implements storage for performance metrics
    """
    
    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=models.UUIDField.default
    )
    
    campaign = models.ForeignKey(
        'marketing.Campaign',
        on_delete=models.CASCADE,
        related_name='performance_metrics',
        help_text='The marketing campaign associated with these performance metrics'
    )
    
    engagement_rate = models.FloatField(
        default=0.0,
        help_text='The calculated engagement rate as a percentage'
    )
    
    growth_rate = models.FloatField(
        default=0.0,
        help_text='The calculated growth rate as a percentage'
    )
    
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text='When these metrics were recorded'
    )
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['campaign', 'timestamp']),
            models.Index(fields=['timestamp'])
        ]
    
    def generate_insights(self) -> dict:
        """
        Generates insights for the performance metric.
        
        Returns:
            dict: A dictionary containing key insights about the performance metrics.
            
        Requirements Addressed:
        - Analytics Data Storage: Implements performance insight generation
        """
        # Create a DataFrame with the current and historical metrics
        metrics_data = pd.DataFrame({
            'timestamp': [self.timestamp],
            'metric_value': [self.engagement_rate],
            'metric_type': ['engagement_rate']
        })
        
        # Add growth rate data
        metrics_data = pd.concat([
            metrics_data,
            pd.DataFrame({
                'timestamp': [self.timestamp],
                'metric_value': [self.growth_rate],
                'metric_type': ['growth_rate']
            })
        ])
        
        return generate_performance_insights(metrics_data)