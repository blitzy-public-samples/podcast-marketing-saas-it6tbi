"""
AI Service Test Suite Initialization

This module initializes the test suite for the AI service, ensuring that all test modules
in the ai_service directory are properly loaded and executed.

Requirements Addressed:
- AI Integration Testing (1.2 System Overview/High-Level Description/AI Integration):
  Ensures that all test modules for AI-driven functionalities like transcription and
  content generation are properly initialized and executed.

Human Tasks:
1. Verify that pytest is properly configured in the development environment
2. Ensure test database is properly configured and accessible
3. Review test coverage reports and add missing test cases if needed
4. Configure CI/CD pipeline to run the test suite automatically
"""

# Import test modules
# unittest (builtin)
import unittest

# Import test modules relatively from current package
from .test_models import TestTranscriptionTask, TestContentGenerationTask
from .test_services import (
    test_process_transcription_service_success,
    test_process_transcription_service_invalid_input,
    test_process_content_generation_service_success,
    test_process_content_generation_service_invalid_input,
    test_process_audio_to_content_service_success,
    test_process_audio_to_content_service_error_handling
)
from .test_views import (
    TestTranscriptionView,
    TestContentGenerationView,
    TestAudioToContentView
)

def load_tests(loader: unittest.TestLoader, standard_tests: unittest.TestSuite, pattern: str) -> unittest.TestSuite:
    """
    Load and organize all test cases into a single test suite.

    Args:
        loader (unittest.TestLoader): The test loader instance
        standard_tests (unittest.TestSuite): The standard test suite
        pattern (str): The pattern to match test files

    Returns:
        unittest.TestSuite: The complete test suite containing all test cases

    Requirements Addressed:
    - AI Integration Testing (1.2 System Overview/AI Integration):
      Organizes and loads all AI service test cases into a cohesive test suite
    """
    # Create the test suite
    suite = unittest.TestSuite()

    # Add model tests
    suite.addTests(loader.loadTestsFromTestCase(TestTranscriptionTask))
    suite.addTests(loader.loadTestsFromTestCase(TestContentGenerationTask))

    # Add view tests
    suite.addTests(loader.loadTestsFromTestCase(TestTranscriptionView))
    suite.addTests(loader.loadTestsFromTestCase(TestContentGenerationView))
    suite.addTests(loader.loadTestsFromTestCase(TestAudioToContentView))

    return suite

# Initialize test suite when module is loaded
def initialize_test_suite():
    """
    Initialize the test suite by performing any necessary setup.

    Requirements Addressed:
    - AI Integration Testing (1.2 System Overview/AI Integration):
      Ensures proper initialization of the AI service test environment
    """
    # Create test loader
    loader = unittest.TestLoader()
    
    # Load tests
    suite = load_tests(loader, None, None)
    
    return suite

# Create the test suite when this module is imported
test_suite = initialize_test_suite()