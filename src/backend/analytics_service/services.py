"""
Analytics Service Functions

This module provides core service functions for processing and analyzing engagement
and performance metrics. These services are used by tasks, views, and other
components to handle analytics-related operations.

Requirements Addressed:
- Metrics Collection and Analysis (7.2 Component Details/Analytics Service):
  Implements functions for processing and analyzing metrics to provide insights
  into content performance.
- Asynchronous Analytics Processing (7.2 Component Details/Analytics Service):
  Implements service functions that support background task processing of metrics.

Human Tasks:
1. Review performance thresholds for metric processing
2. Verify that the metrics aggregation aligns with reporting requirements
3. Confirm that the trend analysis periods match business needs
"""

# Internal imports
from .models import EngagementMetric, PerformanceMetric
from .metrics.engagement import calculate_engagement_rate
from .metrics.performance import generate_performance_insights

# External imports - versions specified as per requirements
import pandas as pd  # pandas version 2.0.3
import numpy as np  # numpy version 1.24.2


def process_engagement_metrics(engagement_data: list) -> dict:
    """
    Processes engagement metrics by calculating engagement rates and analyzing trends.

    This function takes a list of engagement data entries and processes them to
    calculate engagement rates and identify trends in user engagement.

    Args:
        engagement_data (list): List of dictionaries containing engagement metrics
            Each dictionary should have:
            - likes (int): Number of likes
            - shares (int): Number of shares
            - comments (int): Number of comments
            - impressions (int): Number of impressions
            - timestamp (datetime): When the metrics were recorded

    Returns:
        dict: A dictionary containing:
            - processed_metrics: List of calculated engagement rates
            - trends: Engagement trend analysis results
            - summary: Statistical summary of engagement data

    Requirements Addressed:
    - Metrics Collection and Analysis: Implements engagement metrics processing
    """
    # Convert engagement data to DataFrame for analysis
    df = pd.DataFrame(engagement_data)
    
    # Calculate engagement rates for each entry
    df['engagement_rate'] = df.apply(
        lambda row: calculate_engagement_rate(
            row['likes'],
            row['shares'],
            row['comments'],
            row['impressions']
        ),
        axis=1
    )
    
    # Calculate daily and weekly aggregates
    daily_rates = df.groupby(
        pd.Grouper(key='timestamp', freq='D')
    )['engagement_rate'].mean()
    
    weekly_rates = df.groupby(
        pd.Grouper(key='timestamp', freq='W')
    )['engagement_rate'].mean()
    
    # Calculate trend indicators
    trend_direction = 'increasing' if df['engagement_rate'].is_monotonic_increasing else (
        'decreasing' if df['engagement_rate'].is_monotonic_decreasing else 'fluctuating'
    )
    
    # Calculate statistical summary
    summary_stats = {
        'mean_rate': df['engagement_rate'].mean(),
        'median_rate': df['engagement_rate'].median(),
        'std_dev': df['engagement_rate'].std(),
        'min_rate': df['engagement_rate'].min(),
        'max_rate': df['engagement_rate'].max()
    }
    
    # Identify peak engagement periods
    peak_periods = df.nlargest(3, 'engagement_rate')[['timestamp', 'engagement_rate']]
    
    return {
        'processed_metrics': df['engagement_rate'].tolist(),
        'trends': {
            'direction': trend_direction,
            'daily_rates': daily_rates.to_dict(),
            'weekly_rates': weekly_rates.to_dict(),
            'peak_periods': peak_periods.to_dict('records')
        },
        'summary': summary_stats
    }


def process_performance_metrics(performance_data: pd.DataFrame) -> dict:
    """
    Processes performance metrics by aggregating data and generating insights.

    This function analyzes performance metrics data to generate insights and
    identify patterns in content performance.

    Args:
        performance_data (pd.DataFrame): DataFrame containing performance metrics
            Required columns:
            - metric_value (float): The performance metric value
            - metric_type (str): Type of metric being measured
            - timestamp (datetime): When the metric was recorded

    Returns:
        dict: A dictionary containing:
            - aggregated_metrics: Aggregated performance metrics
            - insights: Generated performance insights
            - anomalies: Detected anomalies in performance
            - recommendations: Suggested actions based on analysis

    Requirements Addressed:
    - Metrics Collection and Analysis: Implements performance metrics processing
    - Asynchronous Analytics Processing: Supports background processing of metrics
    """
    # Validate required columns
    required_columns = ['metric_value', 'metric_type', 'timestamp']
    if not all(col in performance_data.columns for col in required_columns):
        raise ValueError(f"DataFrame must contain columns: {required_columns}")
    
    # Ensure timestamp is datetime type
    performance_data['timestamp'] = pd.to_datetime(performance_data['timestamp'])
    
    # Calculate growth rates for each metric type
    growth_rates = {}
    for metric_type in performance_data['metric_type'].unique():
        metric_data = performance_data[
            performance_data['metric_type'] == metric_type
        ].sort_values('timestamp')
        
        if len(metric_data) >= 2:
            initial_value = metric_data['metric_value'].iloc[0]
            final_value = metric_data['metric_value'].iloc[-1]
            if initial_value > 0:  # Avoid division by zero
                growth_rate = ((final_value - initial_value) / initial_value) * 100
                growth_rates[metric_type] = growth_rate
    
    # Generate insights using the performance metrics module
    insights = generate_performance_insights(performance_data)
    
    # Detect anomalies (values outside 2 standard deviations)
    anomalies = []
    for metric_type in performance_data['metric_type'].unique():
        metric_data = performance_data[
            performance_data['metric_type'] == metric_type
        ]
        mean = metric_data['metric_value'].mean()
        std = metric_data['metric_value'].std()
        
        anomaly_mask = np.abs(metric_data['metric_value'] - mean) > (2 * std)
        if anomaly_mask.any():
            anomalies.extend(
                metric_data[anomaly_mask][['timestamp', 'metric_value', 'metric_type']]
                .to_dict('records')
            )
    
    # Generate recommendations based on insights and anomalies
    recommendations = []
    for metric_type, growth_rate in growth_rates.items():
        if growth_rate < -10:
            recommendations.append({
                'metric_type': metric_type,
                'severity': 'high',
                'action': f'Investigate declining performance in {metric_type}',
                'growth_rate': growth_rate
            })
        elif growth_rate < 0:
            recommendations.append({
                'metric_type': metric_type,
                'severity': 'medium',
                'action': f'Monitor {metric_type} for continued decline',
                'growth_rate': growth_rate
            })
    
    return {
        'aggregated_metrics': {
            'growth_rates': growth_rates,
            'period_summary': {
                metric_type: {
                    'mean': group['metric_value'].mean(),
                    'median': group['metric_value'].median(),
                    'std': group['metric_value'].std()
                }
                for metric_type, group in performance_data.groupby('metric_type')
            }
        },
        'insights': insights,
        'anomalies': anomalies,
        'recommendations': recommendations
    }