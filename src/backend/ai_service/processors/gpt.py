"""
GPT-based Content Generation Module

This module implements the GPT-based content generation functionality by integrating with
OpenAI's GPT API to generate AI-driven content based on user-provided prompts.

Requirements Addressed:
- AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
  Implements AI-driven content generation using GPT.

Human Tasks:
1. Set up OpenAI API key in environment variables
2. Review and adjust max_tokens and temperature parameters based on content requirements
3. Configure logging settings to ensure proper tracking of API interactions
4. Monitor API usage and costs through OpenAI dashboard
"""

import os
import logging
from typing import Optional

# openai v0.27.0
import openai

from ...common.exceptions import ValidationError
from ...common.utils import process_audio_file

# Configure module logger
logger = logging.getLogger(__name__)

# Initialize OpenAI API key from environment variable
API_KEY = os.getenv('OPENAI_API_KEY')
if API_KEY:
    openai.api_key = API_KEY
else:
    logger.error("OpenAI API key not found in environment variables")
    raise ValueError("OpenAI API key not configured")

def generate_content(prompt: str, max_tokens: int = 2048, temperature: float = 0.7) -> str:
    """
    Generates AI-driven content using OpenAI's GPT API.

    Args:
        prompt (str): The input prompt for content generation
        max_tokens (int, optional): Maximum number of tokens in the response. Defaults to 2048.
        temperature (float, optional): Controls randomness in the output. Defaults to 0.7.
            0.0 means focused and deterministic, 1.0 means more creative.

    Returns:
        str: The generated content from GPT

    Raises:
        ValidationError: If the prompt is invalid or API call fails

    Requirements Addressed:
    - AI Content Generation (1.3 Scope/Core Features and Functionalities/AI Services):
      Implements the core content generation functionality using GPT.
    """
    # Validate prompt
    if not prompt or not isinstance(prompt, str):
        error_msg = "Prompt must be a non-empty string"
        logger.error(error_msg)
        raise ValidationError(error_msg)

    if len(prompt.strip()) == 0:
        error_msg = "Prompt cannot be empty or contain only whitespace"
        logger.error(error_msg)
        raise ValidationError(error_msg)

    # Validate numerical parameters
    if not isinstance(max_tokens, int) or max_tokens <= 0:
        error_msg = "max_tokens must be a positive integer"
        logger.error(error_msg)
        raise ValidationError(error_msg)

    if not isinstance(temperature, float) or not 0.0 <= temperature <= 1.0:
        error_msg = "temperature must be a float between 0.0 and 1.0"
        logger.error(error_msg)
        raise ValidationError(error_msg)

    try:
        logger.info(f"Starting content generation with prompt length: {len(prompt)}")
        logger.debug(f"Generation parameters - max_tokens: {max_tokens}, temperature: {temperature}")

        # Make API call to OpenAI GPT
        response = openai.Completion.create(
            engine="text-davinci-003",  # Using the most capable GPT-3 model
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )

        # Extract and validate the generated content
        if not response.choices or len(response.choices) == 0:
            error_msg = "No content generated from the API"
            logger.error(error_msg)
            raise ValidationError(error_msg)

        generated_content = response.choices[0].text.strip()
        
        if not generated_content:
            error_msg = "Generated content is empty"
            logger.error(error_msg)
            raise ValidationError(error_msg)

        logger.info(f"Successfully generated content of length: {len(generated_content)}")
        logger.debug(f"Content generation completed for prompt: {prompt[:100]}...")

        return generated_content

    except openai.error.OpenAIError as e:
        error_msg = f"OpenAI API error: {str(e)}"
        logger.error(error_msg)
        raise ValidationError(error_msg)
    except Exception as e:
        error_msg = f"Unexpected error during content generation: {str(e)}"
        logger.error(error_msg)
        raise ValidationError(error_msg)