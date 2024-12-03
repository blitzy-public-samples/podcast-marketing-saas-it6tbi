"""
Unit Tests for FileStorage Model

This module contains unit tests for the FileStorage model in the storage_service module,
ensuring proper validation of file sizes and formats.

Requirements Addressed:
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Ensures the integrity and functionality of the FileStorage model, which is critical
  for managing cloud-based distributed storage for audio files and transcripts.

Human Tasks:
1. Verify test database configuration is properly set up
2. Ensure test environment has appropriate permissions to create/delete test files
3. Review test coverage and add additional test cases if needed
"""

from django.test import TestCase  # Django 4.2
from src.backend.storage_service.models import FileStorage
from src.backend.common.exceptions import ValidationError


class TestFileStorageModel(TestCase):
    """Unit tests for the FileStorage model, including property validation and method functionality."""

    def setUp(self):
        """Sets up the test environment with sample data for FileStorage model tests."""
        self.valid_file_data = {
            'file_name': 'test_audio.mp3',
            'file_size': 1024 * 1024,  # 1MB
            'file_format': '.mp3',
            's3_url': 'https://test-bucket.s3.amazonaws.com/test_audio.mp3'
        }

        self.invalid_size_data = {
            'file_name': 'large_audio.mp3',
            'file_size': 501 * 1024 * 1024,  # 501MB (exceeds 500MB limit)
            'file_format': '.mp3',
            's3_url': 'https://test-bucket.s3.amazonaws.com/large_audio.mp3'
        }

        self.invalid_format_data = {
            'file_name': 'test_audio.flac',
            'file_size': 1024 * 1024,
            'file_format': '.flac',
            's3_url': 'https://test-bucket.s3.amazonaws.com/test_audio.flac'
        }

    def test_validate_file_size(self):
        """
        Tests the validate_file_size method of the FileStorage model.
        
        Verifies that:
        1. Valid file sizes are accepted
        2. Files exceeding size limit raise ValidationError
        """
        # Test valid file size
        valid_file = FileStorage(**self.valid_file_data)
        try:
            self.assertTrue(valid_file.validate_file_size())
        except ValidationError:
            self.fail("validate_file_size() raised ValidationError unexpectedly for valid size")

        # Test invalid file size
        invalid_file = FileStorage(**self.invalid_size_data)
        with self.assertRaises(ValidationError) as context:
            invalid_file.validate_file_size()
        
        self.assertIn("exceeds the maximum allowed size", context.exception.message)

    def test_validate_file_format(self):
        """
        Tests the validate_file_format method of the FileStorage model.
        
        Verifies that:
        1. Supported file formats are accepted
        2. Unsupported formats raise ValidationError
        """
        # Test valid file format
        valid_file = FileStorage(**self.valid_file_data)
        try:
            self.assertTrue(valid_file.validate_file_format())
        except ValidationError:
            self.fail("validate_file_format() raised ValidationError unexpectedly for valid format")

        # Test invalid file format
        invalid_file = FileStorage(**self.invalid_format_data)
        with self.assertRaises(ValidationError) as context:
            invalid_file.validate_file_format()
        
        self.assertIn("is not supported", context.exception.message)

    def test_file_creation_with_validations(self):
        """
        Tests the complete file creation process with all validations.
        
        Verifies that:
        1. Valid files can be created and saved
        2. Invalid files raise appropriate validation errors
        """
        # Test valid file creation
        valid_file = FileStorage(**self.valid_file_data)
        try:
            valid_file.save()
        except ValidationError:
            self.fail("File creation failed with valid data")

        # Test file creation with invalid size
        invalid_size_file = FileStorage(**self.invalid_size_data)
        with self.assertRaises(ValidationError) as context:
            invalid_size_file.save()
        self.assertIn("exceeds the maximum allowed size", context.exception.message)

        # Test file creation with invalid format
        invalid_format_file = FileStorage(**self.invalid_format_data)
        with self.assertRaises(ValidationError) as context:
            invalid_format_file.save()
        self.assertIn("is not supported", context.exception.message)

    def test_string_representation(self):
        """
        Tests the string representation of the FileStorage model.
        
        Verifies that:
        1. The __str__ method returns the expected format
        """
        file_storage = FileStorage(**self.valid_file_data)
        expected_str = "test_audio.mp3 (.mp3)"
        self.assertEqual(str(file_storage), expected_str)