"""
Unit Tests for AI Service Functions

This module contains unit tests for the service functions in the AI service module,
ensuring correct functionality of transcription, content generation, and audio-to-content
processing services.

Requirements Addressed:
- Unit Testing for AI Services (7.3 Technical Decisions/7.3.1 Architecture Patterns):
  Ensures that the AI service functions are tested for correctness and reliability.

Human Tasks:
1. Review test coverage and add additional test cases if needed
2. Verify that mock data matches production data patterns
3. Ensure test environment has pytest configured correctly
4. Review error handling test cases for completeness
"""

# pytest v7.4.0
import pytest
# unittest.mock (builtin)
from unittest.mock import patch, Mock

from ...common.exceptions import ValidationError
from ..services import (
    process_transcription_service,
    process_content_generation_service,
    process_audio_to_content_service
)

@pytest.mark.parametrize("audio_file_path,expected_transcription", [
    ("s3://bucket/valid_audio.mp3", "Sample transcription text"),
    ("s3://bucket/test_file.wav", "Another transcription example"),
])
def test_process_transcription_service_success(audio_file_path, expected_transcription):
    """Tests successful transcription processing with valid inputs."""
    with patch('src.backend.ai_service.services.TranscriptionTask') as mock_task:
        # Configure mock
        mock_instance = Mock()
        mock_instance.id = "test-uuid"
        mock_instance.status = "COMPLETED"
        mock_instance.perform_transcription.return_value = expected_transcription
        mock_task.objects.create.return_value = mock_instance

        # Execute test
        result = process_transcription_service(audio_file_path)

        # Verify results
        assert result["transcription"] == expected_transcription
        assert result["status"] == "COMPLETED"
        assert result["audio_file_path"] == audio_file_path
        assert "task_id" in result

        # Verify mock calls
        mock_task.objects.create.assert_called_once_with(
            audio_file_path=audio_file_path,
            status='PENDING'
        )
        mock_instance.perform_transcription.assert_called_once()

@pytest.mark.parametrize("invalid_path", [
    "",
    None,
    "invalid_path.txt",
    "s3://bucket/invalid.xyz"
])
def test_process_transcription_service_invalid_input(invalid_path):
    """Tests transcription processing with invalid inputs."""
    with patch('src.backend.ai_service.services.TranscriptionTaskSerializer') as mock_serializer:
        # Configure mock to raise validation error
        mock_serializer.return_value.validate_audio_file_path.side_effect = ValidationError("Invalid audio file path")

        # Execute test and verify exception
        with pytest.raises(ValidationError):
            process_transcription_service(invalid_path)

@pytest.mark.parametrize("prompt,max_tokens,temperature,expected_content", [
    ("Generate content about AI", 100, 0.7, "AI-generated content example"),
    ("Write about technology", 200, 0.5, "Technology content example"),
])
def test_process_content_generation_service_success(prompt, max_tokens, temperature, expected_content):
    """Tests successful content generation with valid inputs."""
    with patch('src.backend.ai_service.services.ContentGenerationTask') as mock_task:
        # Configure mock
        mock_instance = Mock()
        mock_instance.id = "test-uuid"
        mock_instance.status = "COMPLETED"
        mock_instance.generate_content_task.return_value = expected_content
        mock_task.objects.create.return_value = mock_instance

        # Execute test
        result = process_content_generation_service(prompt, max_tokens, temperature)

        # Verify results
        assert result["generated_content"] == expected_content
        assert result["status"] == "COMPLETED"
        assert result["prompt"] == prompt
        assert "task_id" in result

        # Verify mock calls
        mock_task.objects.create.assert_called_once_with(
            prompt=prompt,
            status='PENDING'
        )
        mock_instance.generate_content_task.assert_called_once()

@pytest.mark.parametrize("invalid_prompt", [
    "",
    None,
    " "*10
])
def test_process_content_generation_service_invalid_input(invalid_prompt):
    """Tests content generation with invalid inputs."""
    with patch('src.backend.ai_service.services.ContentGenerationTaskSerializer') as mock_serializer:
        # Configure mock to raise validation error
        mock_serializer.return_value.validate_prompt.side_effect = ValidationError("Invalid prompt")

        # Execute test and verify exception
        with pytest.raises(ValidationError):
            process_content_generation_service(invalid_prompt, 100, 0.7)

@pytest.mark.parametrize("audio_file_path,max_tokens,temperature,expected_result", [
    (
        "s3://bucket/test.mp3",
        100,
        0.7,
        {
            "transcription": "Sample transcription",
            "generated_content": "Generated content"
        }
    ),
    (
        "s3://bucket/audio.wav",
        200,
        0.5,
        {
            "transcription": "Another transcription",
            "generated_content": "More content"
        }
    ),
])
def test_process_audio_to_content_service_success(audio_file_path, max_tokens, temperature, expected_result):
    """Tests successful audio-to-content processing with valid inputs."""
    with patch('src.backend.ai_service.services.process_transcription_service') as mock_transcription, \
         patch('src.backend.ai_service.services.process_content_generation_service') as mock_generation:
        
        # Configure mocks
        mock_transcription.return_value = {
            "task_id": "trans-uuid",
            "transcription": expected_result["transcription"],
            "status": "COMPLETED"
        }
        mock_generation.return_value = {
            "task_id": "gen-uuid",
            "generated_content": expected_result["generated_content"],
            "status": "COMPLETED"
        }

        # Execute test
        result = process_audio_to_content_service(audio_file_path, max_tokens, temperature)

        # Verify results
        assert result["transcription"] == expected_result["transcription"]
        assert result["generated_content"] == expected_result["generated_content"]
        assert result["status"] == "COMPLETED"
        assert result["audio_file_path"] == audio_file_path
        assert "transcription_task_id" in result
        assert "content_task_id" in result

        # Verify mock calls
        mock_transcription.assert_called_once_with(audio_file_path)
        mock_generation.assert_called_once_with(
            prompt=expected_result["transcription"],
            max_tokens=max_tokens,
            temperature=temperature
        )

@pytest.mark.parametrize("error_stage", ["transcription", "generation"])
def test_process_audio_to_content_service_error_handling(error_stage):
    """Tests error handling in audio-to-content processing."""
    with patch('src.backend.ai_service.services.process_transcription_service') as mock_transcription, \
         patch('src.backend.ai_service.services.process_content_generation_service') as mock_generation:
        
        # Configure mocks based on error stage
        if error_stage == "transcription":
            mock_transcription.side_effect = ValidationError("Transcription failed")
        else:
            mock_transcription.return_value = {
                "task_id": "trans-uuid",
                "transcription": "Sample text",
                "status": "COMPLETED"
            }
            mock_generation.side_effect = ValidationError("Generation failed")

        # Execute test and verify exception
        with pytest.raises(ValidationError):
            process_audio_to_content_service("s3://bucket/test.mp3", 100, 0.7)