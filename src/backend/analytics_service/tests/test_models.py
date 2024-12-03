"""
Unit tests for analytics service models.

This module contains test cases for the EngagementMetric and PerformanceMetric models,
ensuring their correctness and reliability.

Requirements Addressed:
- Analytics Data Validation (7.2 Component Details/Analytics Service):
  Ensures that the analytics models store and process data correctly and adhere to
  the defined business logic.
"""

# pytest version 7.4.0
import pytest
from datetime import datetime
import pandas as pd
from ..models import EngagementMetric, PerformanceMetric


@pytest.fixture
def sample_engagement_metric():
    """Fixture providing a sample EngagementMetric instance for testing."""
    return EngagementMetric(
        likes=100,
        shares=50,
        comments=25,
        impressions=1000,
        timestamp=datetime.now()
    )


@pytest.fixture
def sample_performance_metric():
    """Fixture providing a sample PerformanceMetric instance for testing."""
    return PerformanceMetric(
        engagement_rate=17.5,
        growth_rate=5.2,
        timestamp=datetime.now()
    )


def test_engagement_metric_calculate_rate(sample_engagement_metric):
    """
    Tests the calculate_rate function of the EngagementMetric model.
    
    Requirements Addressed:
    - Analytics Data Validation: Verifies that engagement rate calculations
      are accurate and follow the defined formula.
    """
    # Calculate expected rate: (likes + shares + comments) / impressions * 100
    expected_rate = ((100 + 50 + 25) / 1000) * 100  # 17.5%
    
    # Get actual rate from model
    actual_rate = sample_engagement_metric.calculate_rate()
    
    # Assert the calculated rate matches expected value
    assert abs(actual_rate - expected_rate) < 0.001, \
        f"Expected engagement rate {expected_rate}%, got {actual_rate}%"


def test_engagement_metric_calculate_rate_zero_impressions():
    """
    Tests the calculate_rate function with zero impressions.
    
    Requirements Addressed:
    - Analytics Data Validation: Ensures proper handling of edge cases
      in engagement rate calculations.
    """
    metric = EngagementMetric(
        likes=10,
        shares=5,
        comments=2,
        impressions=0
    )
    
    with pytest.raises(ValueError) as exc_info:
        metric.calculate_rate()
    
    assert str(exc_info.value) == "Impressions must be greater than zero"


def test_engagement_metric_calculate_rate_negative_values():
    """
    Tests the calculate_rate function with negative metric values.
    
    Requirements Addressed:
    - Analytics Data Validation: Ensures proper validation of input values
      in engagement rate calculations.
    """
    metric = EngagementMetric(
        likes=-10,
        shares=5,
        comments=2,
        impressions=100
    )
    
    with pytest.raises(ValueError) as exc_info:
        metric.calculate_rate()
    
    assert str(exc_info.value) == "Engagement metrics cannot be negative"


def test_performance_metric_generate_insights(sample_performance_metric):
    """
    Tests the generate_insights function of the PerformanceMetric model.
    
    Requirements Addressed:
    - Analytics Data Validation: Verifies that performance insights
      are generated correctly with the expected structure.
    """
    # Generate insights
    insights = sample_performance_metric.generate_insights()
    
    # Verify insights structure and content
    assert isinstance(insights, dict), "Insights should be returned as a dictionary"
    
    # Check that insights contain expected metric types
    metrics_data = pd.DataFrame(insights['daily_avg']).reset_index()
    assert 'engagement_rate' in metrics_data['metric_type'].values
    assert 'growth_rate' in metrics_data['metric_type'].values
    
    # Verify metric values
    engagement_data = metrics_data[metrics_data['metric_type'] == 'engagement_rate']
    assert abs(engagement_data['metric_value'].iloc[0] - 17.5) < 0.001
    
    growth_data = metrics_data[metrics_data['metric_type'] == 'growth_rate']
    assert abs(growth_data['metric_value'].iloc[0] - 5.2) < 0.001


def test_performance_metric_generate_insights_empty_metrics():
    """
    Tests the generate_insights function with empty metric values.
    
    Requirements Addressed:
    - Analytics Data Validation: Ensures proper handling of edge cases
      in performance insight generation.
    """
    metric = PerformanceMetric(
        engagement_rate=0.0,
        growth_rate=0.0
    )
    
    insights = metric.generate_insights()
    
    # Verify insights are generated even with zero values
    assert isinstance(insights, dict)
    metrics_data = pd.DataFrame(insights['daily_avg']).reset_index()
    assert len(metrics_data) > 0
    assert all(metrics_data['metric_value'] == 0.0)


def test_performance_metric_generate_insights_timestamp_handling(sample_performance_metric):
    """
    Tests timestamp handling in the generate_insights function.
    
    Requirements Addressed:
    - Analytics Data Validation: Verifies proper handling of temporal data
      in performance insights.
    """
    insights = sample_performance_metric.generate_insights()
    
    # Verify timestamp handling
    metrics_data = pd.DataFrame(insights['daily_avg']).reset_index()
    
    # Check that timestamps are properly parsed
    assert all(isinstance(ts, pd.Timestamp) for ts in metrics_data['timestamp'])
    
    # Verify timestamp is within expected range
    current_time = pd.Timestamp.now()
    assert all(ts <= current_time for ts in metrics_data['timestamp'])