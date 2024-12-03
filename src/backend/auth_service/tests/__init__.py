"""
Authentication Service Test Suite Initialization

This module initializes the test suite for the authentication service, ensuring that
all test modules are properly recognized and executed during testing.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Ensures the correctness of the authentication service through comprehensive unit tests
  for models, services, and views.

Human Tasks:
1. Verify test database configuration in Django settings.py
2. Ensure test coverage reporting tools are properly configured
3. Review CI/CD pipeline test stage configuration
4. Configure test data fixtures if needed
"""

# Import test cases from test modules
from .test_models import TestUserModel
from .test_services import test_authenticate_user
from .test_views import test_login_view

# Define test suite components
__all__ = [
    'TestUserModel',
    'test_authenticate_user',
    'test_login_view'
]

# Initialize test suite configuration
# Note: This ensures that the test runner recognizes all test modules
# and executes them in the correct order

def load_tests(loader, standard_tests, pattern):
    """
    Custom test loader function to ensure all test modules are properly loaded
    and executed in the correct order.
    
    Args:
        loader: TestLoader instance used to load the tests
        standard_tests: The standard test suite
        pattern: Pattern used to match test files
        
    Returns:
        TestSuite: The complete test suite for the authentication service
    """
    # Create a test suite for the authentication service
    suite = loader.loadTestsFromNames([
        'src.backend.auth_service.tests.test_models',
        'src.backend.auth_service.tests.test_services',
        'src.backend.auth_service.tests.test_views'
    ])
    
    return suite