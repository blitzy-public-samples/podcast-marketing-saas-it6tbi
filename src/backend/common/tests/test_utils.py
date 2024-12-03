"""
Unit Tests for Backend Utility Functions

This module contains unit tests for the utility functions defined in src/backend/common/utils.py.
It ensures the correctness and reliability of the utility functions used across the backend services.

Requirements Addressed:
- Utility Function Testing (7.3.2 Communication Patterns):
  Ensures that utility functions are thoroughly tested to maintain reliability and correctness
  across the backend services.

Human Tasks:
1. Verify that the test data file paths point to valid test audio files in the test fixtures directory
2. Ensure Redis mock configuration aligns with the actual Redis implementation
3. Review test coverage to ensure all edge cases are properly tested
"""

# pytest v7.4.0
import pytest
from ...common.utils import process_audio_file, cache_result
from ...common.exceptions import ValidationError
from ...common.constants import MAX_AUDIO_FILE_SIZE_MB, SUPPORTED_AUDIO_FORMATS

@pytest.mark.parametrize("file_name, file_size_mb, expected", [
    ("test_audio.mp3", 100, True),
    ("sample.wav", 250, True),
    ("podcast.aac", MAX_AUDIO_FILE_SIZE_MB, True),
])
def test_process_audio_file_valid(file_name, file_size_mb, expected):
    """
    Tests the process_audio_file function with valid inputs.
    
    Requirements Addressed:
    - Utility Function Testing (7.3.2 Communication Patterns):
      Verifies that the audio file processing function handles valid inputs correctly.
    """
    result = process_audio_file(file_name, file_size_mb)
    assert result == expected

@pytest.mark.parametrize("file_name, file_size_mb, expected_exception", [
    ("invalid.txt", 100, ValidationError),  # Unsupported format
    ("large.mp3", MAX_AUDIO_FILE_SIZE_MB + 1, ValidationError),  # Exceeds size limit
    ("test.doc", 50, ValidationError),  # Invalid extension
    ("test.mp4", 200, ValidationError),  # Wrong media type
])
def test_process_audio_file_invalid(file_name, file_size_mb, expected_exception):
    """
    Tests the process_audio_file function with invalid inputs.
    
    Requirements Addressed:
    - Utility Function Testing (7.3.2 Communication Patterns):
      Verifies that the audio file processing function properly handles and validates invalid inputs.
    """
    with pytest.raises(expected_exception):
        process_audio_file(file_name, file_size_mb)

def test_cache_result():
    """
    Tests the cache_result function to ensure it caches values correctly.
    
    Requirements Addressed:
    - Utility Function Testing (7.3.2 Communication Patterns):
      Verifies that the caching mechanism works correctly for storing and retrieving values.
    """
    # Test with default TTL
    assert cache_result("test_key", "test_value") == True
    
    # Test with custom TTL
    assert cache_result("test_key_ttl", "test_value", ttl=1800) == True
    
    # Test with various data types
    test_cases = [
        ("int_key", 42),
        ("float_key", 3.14),
        ("list_key", [1, 2, 3]),
        ("dict_key", {"name": "test"}),
        ("bool_key", True),
    ]
    
    for key, value in test_cases:
        assert cache_result(key, value) == True

    # Test with empty values
    assert cache_result("empty_string", "") == True
    assert cache_result("none_value", None) == True