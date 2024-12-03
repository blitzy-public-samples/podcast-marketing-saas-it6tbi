"""
API Test Suite Initialization Module

This module initializes the test suite for the API module of the Django backend,
ensuring that all test cases are discoverable and executable by the testing framework.

Requirements Addressed:
- API Module Testing (7.3.1 Architecture Patterns):
  Provides a centralized initialization mechanism for the API module's test suite,
  ensuring modularity and maintainability.

Human Tasks:
1. Verify that pytest is installed with version 7.4.0 or higher
2. Ensure all test files are properly discovered by the test runner
3. Review test database configuration for appropriate isolation
"""

# Standard library imports
import unittest  # standard-library

# Third-party imports
import pytest  # pytest v7.4.0

# Internal imports
from ...common.validators import validate_audio_file
from ...common.exceptions import ValidationError
from ..schema import generate_schema
from .test_schema import TestAPISchema
from ...core.settings.test import DATABASES

# Configure test discovery
def load_tests(loader, standard_tests, pattern):
    """
    Configures test discovery for the API module test suite.
    
    This function is called by the test runner to load all test cases in the API module.
    It ensures that all test files are properly discovered and included in the test suite.
    
    Args:
        loader: The test loader instance
        standard_tests: The standard test suite
        pattern: The test file pattern to match
        
    Returns:
        TestSuite: The complete test suite for the API module
    """
    # Create a test suite for the API module
    suite = unittest.TestSuite()
    
    # Add test cases from test_schema.py
    suite.addTests(loader.loadTestsFromTestCase(TestAPISchema))
    
    # Add any additional test modules here as they are created
    
    return suite

def pytest_configure(config):
    """
    Configures pytest for running the API test suite.
    
    This function is called by pytest during test initialization to set up
    the test environment with appropriate configurations.
    
    Args:
        config: The pytest configuration object
    """
    # Use in-memory SQLite database for testing
    config.DATABASES = DATABASES
    
    # Configure test-specific settings
    config.addinivalue_line(
        "markers",
        "schema: marks tests related to API schema generation and validation"
    )
    config.addinivalue_line(
        "markers",
        "validation: marks tests related to input validation"
    )

def pytest_collection_modifyitems(items):
    """
    Modifies test items during collection to add markers and metadata.
    
    This function is called by pytest after test collection to allow for
    modification of test items before execution.
    
    Args:
        items: List of collected test items
    """
    for item in items:
        # Add markers based on test module
        if "test_schema" in item.nodeid:
            item.add_marker(pytest.mark.schema)
        if "validators" in item.nodeid:
            item.add_marker(pytest.mark.validation)

# Initialize test environment
def setup_test_environment():
    """
    Sets up the test environment for the API module.
    
    This function is called during test suite initialization to prepare
    the environment for testing, including database setup and validation
    configurations.
    """
    # Verify database configuration
    if DATABASES['default']['ENGINE'] != 'django.db.backends.sqlite3':
        raise ValidationError("Test database must be SQLite for isolation")
    
    if DATABASES['default']['NAME'] != ':memory:':
        raise ValidationError("Test database must use in-memory SQLite")