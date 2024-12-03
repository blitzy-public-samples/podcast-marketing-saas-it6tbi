"""
Performance Metrics Module

This module provides utility functions and classes for analyzing performance metrics,
such as growth rates and insights, for podcasts and marketing campaigns.

Requirements Addressed:
- Metrics Collection and Analysis (7.2 Component Details/Analytics Service):
  Implements functions for calculating growth rates and analyzing performance metrics
  to provide insights into content performance.

Human Tasks:
1. Review growth rate calculation thresholds for alignment with business KPIs
2. Verify that performance insights match reporting requirements
3. Validate that the performance analysis time periods align with business needs
"""

from typing import Dict, Any
import pandas as pd  # pandas version 2.0.3
import numpy as np  # numpy version 1.24.2
from .engagement import calculate_engagement_rate, analyze_engagement_trends


def calculate_growth_rate(previous_value: float, current_value: float) -> float:
    """
    Calculates the growth rate based on previous and current values.

    Args:
        previous_value (float): The baseline value
        current_value (float): The current value

    Returns:
        float: The growth rate as a percentage

    Raises:
        ValueError: If previous_value is zero or negative

    Requirements Addressed:
    - Metrics Collection and Analysis: Implements core growth rate calculation
    """
    if previous_value <= 0:
        raise ValueError("Previous value must be greater than zero")

    change = current_value - previous_value
    growth_rate = (change / previous_value) * 100
    return growth_rate


def generate_performance_insights(performance_data: pd.DataFrame) -> Dict[str, Any]:
    """
    Generates insights based on performance metrics data.

    Expected DataFrame columns:
    - timestamp: datetime
    - metric_value: float
    - metric_type: str

    Args:
        performance_data (pd.DataFrame): DataFrame containing performance metrics

    Returns:
        Dict[str, Any]: Dictionary containing key insights:
            - growth_rates: Dict of growth rates by metric type
            - trends: Dict of trend analysis by metric type
            - summary_stats: Dict of statistical summaries
            - anomalies: List of detected anomalies

    Raises:
        ValueError: If required columns are missing or data is empty

    Requirements Addressed:
    - Metrics Collection and Analysis: Implements comprehensive performance analysis
    """
    required_columns = ['timestamp', 'metric_value', 'metric_type']
    
    if performance_data.empty:
        raise ValueError("Performance data cannot be empty")
    if not all(col in performance_data.columns for col in required_columns):
        raise ValueError(f"DataFrame must contain columns: {required_columns}")

    # Ensure timestamp is datetime
    performance_data['timestamp'] = pd.to_datetime(performance_data['timestamp'])

    # Calculate growth rates for each metric type
    growth_rates = {}
    for metric_type in performance_data['metric_type'].unique():
        metric_data = performance_data[performance_data['metric_type'] == metric_type]
        if len(metric_data) >= 2:
            first_value = metric_data['metric_value'].iloc[0]
            last_value = metric_data['metric_value'].iloc[-1]
            growth_rates[metric_type] = calculate_growth_rate(first_value, last_value)

    # Calculate trends and patterns
    trends = {}
    for metric_type in performance_data['metric_type'].unique():
        metric_data = performance_data[performance_data['metric_type'] == metric_type]
        trends[metric_type] = {
            'daily_avg': metric_data.groupby(
                metric_data['timestamp'].dt.date
            )['metric_value'].mean().to_dict(),
            'weekly_avg': metric_data.groupby(
                pd.Grouper(key='timestamp', freq='W')
            )['metric_value'].mean().to_dict()
        }

    # Calculate summary statistics
    summary_stats = {
        metric_type: {
            'mean': group['metric_value'].mean(),
            'median': group['metric_value'].median(),
            'std': group['metric_value'].std(),
            'min': group['metric_value'].min(),
            'max': group['metric_value'].max()
        }
        for metric_type, group in performance_data.groupby('metric_type')
    }

    # Detect anomalies (values outside 2 standard deviations)
    anomalies = []
    for metric_type, group in performance_data.groupby('metric_type'):
        mean = group['metric_value'].mean()
        std = group['metric_value'].std()
        anomaly_mask = np.abs(group['metric_value'] - mean) > (2 * std)
        if anomaly_mask.any():
            anomalies.extend([
                {
                    'metric_type': metric_type,
                    'timestamp': row['timestamp'],
                    'value': row['metric_value']
                }
                for _, row in group[anomaly_mask].iterrows()
            ])

    return {
        'growth_rates': growth_rates,
        'trends': trends,
        'summary_stats': summary_stats,
        'anomalies': anomalies
    }


class PerformanceAnalyzer:
    """
    A class for analyzing performance metrics and generating insights.

    Requirements Addressed:
    - Metrics Collection and Analysis: Provides a reusable class for performance analysis
    """

    def __init__(self, performance_data: pd.DataFrame):
        """
        Initializes the PerformanceAnalyzer with performance data.

        Args:
            performance_data (pd.DataFrame): DataFrame containing performance metrics

        Raises:
            ValueError: If performance_data is empty or has invalid structure
        """
        if performance_data.empty:
            raise ValueError("Performance data cannot be empty")
        
        required_columns = ['timestamp', 'metric_value', 'metric_type']
        if not all(col in performance_data.columns for col in required_columns):
            raise ValueError(f"DataFrame must contain columns: {required_columns}")
        
        self.performance_data = performance_data.copy()
        self.performance_data['timestamp'] = pd.to_datetime(
            self.performance_data['timestamp']
        )

    def generate_insights(self) -> Dict[str, Any]:
        """
        Generates insights from the performance data.

        Returns:
            Dict[str, Any]: Dictionary containing:
                - performance_metrics: Results from generate_performance_insights
                - engagement_analysis: Results from analyze_engagement_trends
                - combined_insights: Aggregated insights from both analyses

        Requirements Addressed:
        - Metrics Collection and Analysis: Implements comprehensive insight generation
        """
        # Generate performance metrics insights
        performance_metrics = generate_performance_insights(self.performance_data)

        # Generate engagement insights if engagement metrics are present
        engagement_columns = ['likes', 'shares', 'comments', 'impressions']
        if all(col in self.performance_data.columns for col in engagement_columns):
            engagement_analysis = analyze_engagement_trends(self.performance_data)
        else:
            engagement_analysis = None

        # Combine insights
        combined_insights = {
            'overall_growth': np.mean(list(performance_metrics['growth_rates'].values())),
            'metric_correlations': self._calculate_metric_correlations(),
            'top_performing_periods': self._identify_top_periods()
        }

        return {
            'performance_metrics': performance_metrics,
            'engagement_analysis': engagement_analysis,
            'combined_insights': combined_insights
        }

    def _calculate_metric_correlations(self) -> Dict[str, float]:
        """
        Calculates correlations between different metric types.

        Returns:
            Dict[str, float]: Dictionary of correlation coefficients
        """
        correlations = {}
        metric_types = self.performance_data['metric_type'].unique()
        
        for i, metric1 in enumerate(metric_types):
            for metric2 in metric_types[i+1:]:
                df1 = self.performance_data[
                    self.performance_data['metric_type'] == metric1
                ]['metric_value']
                df2 = self.performance_data[
                    self.performance_data['metric_type'] == metric2
                ]['metric_value']
                
                if len(df1) == len(df2):
                    correlation = df1.corr(df2)
                    correlations[f"{metric1}_vs_{metric2}"] = correlation

        return correlations

    def _identify_top_periods(self, top_n: int = 5) -> Dict[str, Any]:
        """
        Identifies the top performing time periods for each metric.

        Args:
            top_n (int): Number of top periods to identify

        Returns:
            Dict[str, Any]: Dictionary containing top periods by metric type
        """
        top_periods = {}
        
        for metric_type in self.performance_data['metric_type'].unique():
            metric_data = self.performance_data[
                self.performance_data['metric_type'] == metric_type
            ]
            
            # Calculate daily averages
            daily_data = metric_data.groupby(
                metric_data['timestamp'].dt.date
            )['metric_value'].mean()
            
            # Get top N days
            top_days = daily_data.nlargest(top_n)
            
            top_periods[metric_type] = {
                'dates': top_days.index.tolist(),
                'values': top_days.values.tolist()
            }

        return top_periods