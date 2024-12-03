"""
Test Suite Initialization for Backend Common Module

This file initializes the test suite for the 'common' module, aggregating and exposing
all test cases for shared utilities, constants, and configurations.

Requirements Addressed:
- Centralized Test Initialization (7.3.2 Communication Patterns):
  Provides a single entry point for running all test cases related to the 'common'
  module, ensuring consistency and maintainability in the test suite.
"""

# Import test cases from test_utils.py
from .test_utils import (
    test_process_audio_file_valid,
    test_process_audio_file_invalid,
    test_cache_result
)

# Import constants used in tests
from ..constants import (
    DEFAULT_PAGE_SIZE,
    SUPPORTED_AUDIO_FORMATS
)

# Define test suite exports
__all__ = [
    # Test functions for audio file validation
    'test_process_audio_file_valid',
    'test_process_audio_file_invalid',
    'test_cache_result',
]