"""
Unit tests for podcast service functions.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Ensures the correctness of podcast management services by testing audio processing,
  metadata extraction, and database operations.
- AI Integration (1.2 System Overview/High-Level Description/AI Integration):
  Validates the integration of AI services like Whisper for transcription and GPT
  for content generation.

Human Tasks:
1. Configure test database with appropriate settings for running tests
2. Set up test audio files in the test fixtures directory
3. Review mocked AI service responses to ensure they match production behavior
4. Verify test coverage meets project requirements
"""

# pytest v7.4.0
import pytest
from unittest.mock import Mock, patch, MagicMock

# Internal imports with relative paths
from ..services import process_podcast_episode
from ..models import Podcast, Episode
from ...common.utils import process_audio_file
from ...common.exceptions import ValidationError

@pytest.mark.unit
def test_process_podcast_episode_valid():
    """
    Tests the process_podcast_episode function with valid inputs to ensure it
    processes the episode correctly.

    Requirements Addressed:
    - Podcast Management: Validates core episode processing functionality
    - AI Integration: Verifies AI service integration for transcription and content
    """
    # Mock the Podcast model and instance
    mock_podcast = Mock(spec=Podcast)
    mock_podcast.title = "Test Podcast"
    mock_podcast.description = "Test Description"
    
    # Mock the Episode model
    mock_episode = Mock(spec=Episode)
    mock_episode.title = "Test Episode"
    mock_episode.audio_file = "test_audio.mp3"
    mock_episode.id = "test_episode_id"

    # Mock the database query
    with patch('src.backend.podcast_service.models.Podcast.objects.get') as mock_get:
        mock_get.return_value = mock_podcast

        # Mock the audio processing function
        with patch('src.backend.common.utils.process_audio_file') as mock_process_audio:
            mock_process_audio.return_value = True

            # Mock the AI services
            with patch('src.backend.ai_service.processors.whisper.transcribe_audio') as mock_transcribe:
                mock_transcribe.return_value = "Test transcription content"

                with patch('src.backend.ai_service.processors.gpt.generate_content') as mock_generate:
                    mock_generate.return_value = "AI-generated description"

                    # Mock the Episode model creation and serialization
                    with patch('src.backend.podcast_service.models.Episode') as mock_episode_model:
                        mock_episode_model.return_value = mock_episode
                        
                        with patch('src.backend.podcast_service.serializers.EpisodeSerializer') as mock_serializer:
                            mock_serializer_instance = Mock()
                            mock_serializer_instance.data = {
                                'id': 'test_episode_id',
                                'title': 'Test Episode',
                                'audio_file': 'test_audio.mp3'
                            }
                            mock_serializer.return_value = mock_serializer_instance

                            # Test the function
                            result = process_podcast_episode(
                                file_path="test_audio.mp3",
                                file_size_mb=10,
                                podcast_id="test_podcast_id"
                            )

                            # Verify the result
                            assert result is not None
                            assert isinstance(result, dict)
                            assert result['id'] == 'test_episode_id'
                            assert 'ai_generated_description' in result
                            assert 'transcription' in result

                            # Verify all mocks were called correctly
                            mock_get.assert_called_once_with(id="test_podcast_id")
                            mock_process_audio.assert_called_once()
                            mock_transcribe.assert_called_once_with("test_audio.mp3")
                            mock_generate.assert_called_once()
                            mock_episode_model.assert_called_once()
                            mock_serializer.assert_called_once_with(mock_episode)

@pytest.mark.unit
def test_process_podcast_episode_invalid_audio():
    """
    Tests the process_podcast_episode function with an invalid audio file to ensure
    it raises a ValidationError.

    Requirements Addressed:
    - Podcast Management: Validates error handling for invalid audio files
    """
    # Mock the Podcast model and instance
    mock_podcast = Mock(spec=Podcast)
    mock_podcast.title = "Test Podcast"
    
    # Mock the database query
    with patch('src.backend.podcast_service.models.Podcast.objects.get') as mock_get:
        mock_get.return_value = mock_podcast

        # Mock the audio processing function to raise ValidationError
        with patch('src.backend.common.utils.process_audio_file') as mock_process_audio:
            mock_process_audio.side_effect = ValidationError("Invalid audio file format")

            # Test the function
            with pytest.raises(ValidationError) as exc_info:
                process_podcast_episode(
                    file_path="invalid_audio.txt",
                    file_size_mb=10,
                    podcast_id="test_podcast_id"
                )

            # Verify the error message
            assert "Invalid audio file format" in str(exc_info.value)

            # Verify mocks were called correctly
            mock_get.assert_called_once_with(id="test_podcast_id")
            mock_process_audio.assert_called_once()