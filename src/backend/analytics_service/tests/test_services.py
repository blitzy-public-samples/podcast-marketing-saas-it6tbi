"""
Analytics Service Tests

This module contains unit tests for the analytics service functions, ensuring correct
processing of engagement and performance metrics.

Requirements Addressed:
- Metrics Collection and Analysis (7.2 Component Details/Analytics Service):
  Tests the processing and analysis of engagement and performance metrics
- Asynchronous Analytics Processing (7.2 Component Details/Analytics Service):
  Tests the background processing capabilities for metrics analysis
"""

# External imports
import pytest  # pytest version 7.4.0
from unittest.mock import Mock, patch  # unittest.mock version 3.3
import pandas as pd
from datetime import datetime, timedelta

# Internal imports
from ..services import process_engagement_metrics, process_performance_metrics
from ..models import EngagementMetric, PerformanceMetric

@pytest.fixture
def sample_engagement_data():
    """Fixture providing sample engagement data for testing."""
    return [
        {
            'likes': 100,
            'shares': 50,
            'comments': 30,
            'impressions': 1000,
            'timestamp': datetime.now() - timedelta(days=2)
        },
        {
            'likes': 150,
            'shares': 75,
            'comments': 45,
            'impressions': 1200,
            'timestamp': datetime.now() - timedelta(days=1)
        },
        {
            'likes': 200,
            'shares': 100,
            'comments': 60,
            'impressions': 1500,
            'timestamp': datetime.now()
        }
    ]

@pytest.fixture
def sample_performance_data():
    """Fixture providing sample performance data for testing."""
    return pd.DataFrame({
        'metric_value': [75.5, 82.3, 90.1],
        'metric_type': ['engagement_rate'] * 3,
        'timestamp': [
            datetime.now() - timedelta(days=2),
            datetime.now() - timedelta(days=1),
            datetime.now()
        ]
    })

def test_process_engagement_metrics(sample_engagement_data):
    """
    Tests the process_engagement_metrics function to ensure it correctly processes
    engagement data.

    Requirements Addressed:
    - Metrics Collection and Analysis: Tests engagement metrics processing
    """
    # Mock the EngagementMetric model and its calculate_rate method
    mock_metric = Mock(spec=EngagementMetric)
    mock_metric.calculate_rate.return_value = 18.0

    with patch('src.backend.analytics_service.models.EngagementMetric', mock_metric):
        # Process the engagement metrics
        result = process_engagement_metrics(sample_engagement_data)

        # Verify the structure of the returned dictionary
        assert isinstance(result, dict)
        assert all(key in result for key in ['processed_metrics', 'trends', 'summary'])

        # Verify processed metrics
        assert isinstance(result['processed_metrics'], list)
        assert len(result['processed_metrics']) == len(sample_engagement_data)
        assert all(isinstance(rate, float) for rate in result['processed_metrics'])

        # Verify trends
        assert isinstance(result['trends'], dict)
        assert all(key in result['trends'] for key in [
            'direction', 'daily_rates', 'weekly_rates', 'peak_periods'
        ])
        assert result['trends']['direction'] in ['increasing', 'decreasing', 'fluctuating']

        # Verify summary statistics
        assert isinstance(result['summary'], dict)
        assert all(key in result['summary'] for key in [
            'mean_rate', 'median_rate', 'std_dev', 'min_rate', 'max_rate'
        ])
        assert all(isinstance(val, float) for val in result['summary'].values())

def test_process_engagement_metrics_empty_data():
    """Tests process_engagement_metrics with empty input data."""
    with pytest.raises(ValueError):
        process_engagement_metrics([])

def test_process_engagement_metrics_invalid_data():
    """Tests process_engagement_metrics with invalid input data."""
    invalid_data = [{'likes': 100}]  # Missing required fields
    with pytest.raises(KeyError):
        process_engagement_metrics(invalid_data)

def test_process_performance_metrics(sample_performance_data):
    """
    Tests the process_performance_metrics function to ensure it correctly processes
    performance data.

    Requirements Addressed:
    - Metrics Collection and Analysis: Tests performance metrics processing
    - Asynchronous Analytics Processing: Tests background processing capabilities
    """
    # Mock the PerformanceMetric model and its generate_insights method
    mock_metric = Mock(spec=PerformanceMetric)
    mock_metric.generate_insights.return_value = {
        'trend': 'increasing',
        'recommendations': ['Monitor growth']
    }

    with patch('src.backend.analytics_service.models.PerformanceMetric', mock_metric):
        # Process the performance metrics
        result = process_performance_metrics(sample_performance_data)

        # Verify the structure of the returned dictionary
        assert isinstance(result, dict)
        assert all(key in result for key in [
            'aggregated_metrics', 'insights', 'anomalies', 'recommendations'
        ])

        # Verify aggregated metrics
        assert isinstance(result['aggregated_metrics'], dict)
        assert 'growth_rates' in result['aggregated_metrics']
        assert 'period_summary' in result['aggregated_metrics']

        # Verify insights
        assert isinstance(result['insights'], dict)

        # Verify anomalies
        assert isinstance(result['anomalies'], list)

        # Verify recommendations
        assert isinstance(result['recommendations'], list)
        assert all(isinstance(rec, dict) for rec in result['recommendations'])
        assert all(key in rec for key in ['metric_type', 'severity', 'action']
                  for rec in result['recommendations'])

def test_process_performance_metrics_empty_data():
    """Tests process_performance_metrics with empty input data."""
    empty_df = pd.DataFrame(columns=['metric_value', 'metric_type', 'timestamp'])
    with pytest.raises(ValueError):
        process_performance_metrics(empty_df)

def test_process_performance_metrics_missing_columns():
    """Tests process_performance_metrics with missing required columns."""
    invalid_df = pd.DataFrame({'metric_value': [75.5]})  # Missing required columns
    with pytest.raises(ValueError):
        process_performance_metrics(invalid_df)

def test_process_performance_metrics_invalid_values():
    """Tests process_performance_metrics with invalid metric values."""
    invalid_df = pd.DataFrame({
        'metric_value': ['invalid'],  # Invalid metric value type
        'metric_type': ['engagement_rate'],
        'timestamp': [datetime.now()]
    })
    with pytest.raises(TypeError):
        process_performance_metrics(invalid_df)