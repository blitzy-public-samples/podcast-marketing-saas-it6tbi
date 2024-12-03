"""
Storage Service Test Suite Initialization

This module initializes the test suite for the 'storage_service' module, aggregating and exposing
all test cases for models, services, views, and providers.

Requirements Addressed:
- Centralized Test Initialization (7.3 Technical Decisions/7.3.2 Communication Patterns):
  Provides a single entry point for running all test cases related to the 'storage_service'
  module, ensuring consistency and maintainability in the test suite.
"""

# pytest v7.4.0
import pytest

# Import test cases from test modules
from .test_models import test_file_storage_creation
from .test_services import test_upload_file
from .test_views import test_file_upload

# Export test cases for discovery by pytest
__all__ = [
    'test_file_storage_creation',
    'test_upload_file',
    'test_file_upload'
]

# Register test markers for categorizing tests
def pytest_configure(config):
    """
    Configures pytest markers for the storage service test suite.
    These markers help in organizing and selectively running tests.
    """
    config.addinivalue_line(
        "markers",
        "models: tests for storage service models"
    )
    config.addinivalue_line(
        "markers",
        "services: tests for storage service business logic"
    )
    config.addinivalue_line(
        "markers",
        "views: tests for storage service API endpoints"
    )
    config.addinivalue_line(
        "markers",
        "integration: tests that verify integration between components"
    )

# Test collection modifiers
def pytest_collection_modifyitems(items):
    """
    Modifies test collection to add markers based on test module names.
    This helps in automatic categorization of tests.
    """
    for item in items:
        if "test_models" in item.nodeid:
            item.add_marker(pytest.mark.models)
        elif "test_services" in item.nodeid:
            item.add_marker(pytest.mark.services)
        elif "test_views" in item.nodeid:
            item.add_marker(pytest.mark.views)