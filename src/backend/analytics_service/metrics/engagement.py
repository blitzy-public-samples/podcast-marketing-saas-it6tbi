"""
Engagement Metrics Module

This module provides utility functions for calculating and analyzing engagement metrics
for podcasts and marketing campaigns.

Requirements Addressed:
- Metrics Collection and Analysis (7.2 Component Details/Analytics Service):
  Implements functions for calculating engagement rates and analyzing engagement trends
  to provide insights into content performance.

Human Tasks:
1. Review the engagement rate calculation formula to ensure it aligns with business KPIs
2. Verify that the trend analysis time intervals match reporting requirements
3. Confirm that the engagement metrics thresholds align with industry standards
"""

from typing import Dict, Any
import pandas as pd  # pandas version 2.0.3
from ...common.validators import validate_audio_file
from ...common.constants import SUPPORTED_AUDIO_FORMATS


def calculate_engagement_rate(
    likes: int,
    shares: int,
    comments: int,
    impressions: int
) -> float:
    """
    Calculates the engagement rate based on social interactions and impressions.

    The engagement rate is calculated as:
    ((likes + shares + comments) / impressions) * 100

    Args:
        likes (int): Number of likes/reactions
        shares (int): Number of times the content was shared
        comments (int): Number of comments received
        impressions (int): Total number of times the content was displayed

    Returns:
        float: The engagement rate as a percentage

    Raises:
        ValueError: If impressions is zero or any input is negative
        
    Requirements Addressed:
    - Metrics Collection and Analysis: Implements core engagement rate calculation
    """
    # Validate inputs
    if impressions <= 0:
        raise ValueError("Impressions must be greater than zero")
    if any(metric < 0 for metric in [likes, shares, comments]):
        raise ValueError("Engagement metrics cannot be negative")

    # Calculate total interactions
    total_interactions = likes + shares + comments
    
    # Calculate and return engagement rate as a percentage
    return (total_interactions / impressions) * 100


def analyze_engagement_trends(engagement_data: pd.DataFrame) -> Dict[str, Any]:
    """
    Analyzes trends in engagement metrics over time.

    Expected DataFrame columns:
    - timestamp: datetime
    - likes: int
    - shares: int
    - comments: int
    - impressions: int

    Args:
        engagement_data (pd.DataFrame): DataFrame containing engagement metrics over time

    Returns:
        Dict[str, Any]: Dictionary containing trend analysis results with the following keys:
            - daily_avg: Average daily engagement rate
            - weekly_avg: Average weekly engagement rate
            - trend_direction: String indicating if engagement is increasing/decreasing
            - peak_engagement: Highest engagement rate and its timestamp
            - growth_rate: Percentage change in engagement rate over the period

    Raises:
        ValueError: If required columns are missing or data is empty
        
    Requirements Addressed:
    - Metrics Collection and Analysis: Implements trend analysis for engagement metrics
    """
    required_columns = ['timestamp', 'likes', 'shares', 'comments', 'impressions']
    
    # Validate DataFrame structure
    if engagement_data.empty:
        raise ValueError("Engagement data cannot be empty")
    if not all(col in engagement_data.columns for col in required_columns):
        raise ValueError(f"DataFrame must contain columns: {required_columns}")

    # Ensure timestamp is datetime
    engagement_data['timestamp'] = pd.to_datetime(engagement_data['timestamp'])
    
    # Calculate engagement rate for each row
    engagement_data['engagement_rate'] = engagement_data.apply(
        lambda row: calculate_engagement_rate(
            row['likes'],
            row['shares'],
            row['comments'],
            row['impressions']
        ),
        axis=1
    )

    # Calculate daily averages
    daily_avg = engagement_data.groupby(
        engagement_data['timestamp'].dt.date
    )['engagement_rate'].mean()

    # Calculate weekly averages
    weekly_avg = engagement_data.groupby(
        pd.Grouper(key='timestamp', freq='W')
    )['engagement_rate'].mean()

    # Calculate trend direction
    start_rate = daily_avg.iloc[0]
    end_rate = daily_avg.iloc[-1]
    trend_direction = 'increasing' if end_rate > start_rate else 'decreasing'

    # Find peak engagement
    peak_idx = engagement_data['engagement_rate'].idxmax()
    peak_engagement = {
        'rate': engagement_data.loc[peak_idx, 'engagement_rate'],
        'timestamp': engagement_data.loc[peak_idx, 'timestamp']
    }

    # Calculate growth rate
    growth_rate = ((end_rate - start_rate) / start_rate) * 100

    return {
        'daily_avg': daily_avg.to_dict(),
        'weekly_avg': weekly_avg.to_dict(),
        'trend_direction': trend_direction,
        'peak_engagement': peak_engagement,
        'growth_rate': growth_rate
    }