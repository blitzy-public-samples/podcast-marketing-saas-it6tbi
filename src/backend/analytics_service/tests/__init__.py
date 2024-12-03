"""
Analytics Service Test Suite Initialization

This module initializes the test suite for the analytics service, aggregating and exposing
all test cases for engagement and performance metrics.

Requirements Addressed:
- Centralized Test Initialization (7.3.2 Communication Patterns):
  Provides a single entry point for running all test cases related to the analytics service,
  ensuring consistency and maintainability in the test suite.

Human Tasks:
1. Verify that pytest.ini configuration aligns with the test suite structure
2. Ensure test fixtures directory contains required test data files
3. Review test coverage configuration to meet project requirements
"""

# pytest v7.4.0
import pytest

# Import models for testing
from ..models import (
    EngagementMetric,
    PerformanceMetric
)

# Import serializers for testing
from ..serializers import (
    EngagementMetricSerializer,
    PerformanceMetricSerializer
)

# Import service functions for testing
from ..services import (
    process_engagement_metrics,
    process_performance_metrics
)

# Import test utilities
from ...common.tests.test_utils import (
    test_validate_audio_file_valid
)

# Mark this directory as a pytest test package
pytest.register_assert_rewrite('analytics_service.tests')

# Export test utilities for reuse in other test modules
__all__ = [
    'test_validate_audio_file_valid',
    # Models
    'EngagementMetric',
    'PerformanceMetric',
    # Serializers
    'EngagementMetricSerializer',
    'PerformanceMetricSerializer',
    # Service functions
    'process_engagement_metrics',
    'process_performance_metrics'
]

# Configure test markers
def pytest_configure(config):
    """
    Configures custom pytest markers for the analytics service test suite.
    
    Requirements Addressed:
    - Centralized Test Initialization: Provides consistent test categorization
    """
    markers = [
        'engagement: marks tests related to engagement metrics',
        'performance: marks tests related to performance metrics',
        'serializers: marks tests for data serialization',
        'services: marks tests for service functions',
        'integration: marks integration tests',
        'unit: marks unit tests'
    ]
    for marker in markers:
        config.addinivalue_line('markers', marker)

# Test suite configuration
def pytest_collection_modifyitems(items):
    """
    Modifies test items to add markers based on test module location.
    
    Requirements Addressed:
    - Centralized Test Initialization: Ensures consistent test categorization
    """
    for item in items:
        # Add unit/integration markers based on directory structure
        if 'integration' in str(item.fspath):
            item.add_marker(pytest.mark.integration)
        else:
            item.add_marker(pytest.mark.unit)
            
        # Add specific markers based on test module names
        if 'test_engagement' in str(item.fspath):
            item.add_marker(pytest.mark.engagement)
        elif 'test_performance' in str(item.fspath):
            item.add_marker(pytest.mark.performance)
        elif 'test_serializers' in str(item.fspath):
            item.add_marker(pytest.mark.serializers)
        elif 'test_services' in str(item.fspath):
            item.add_marker(pytest.mark.services)