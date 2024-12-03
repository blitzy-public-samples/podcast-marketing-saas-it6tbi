"""
Twitter API Integration Module

This module provides functionality for integrating with the Twitter API, enabling
the posting of marketing content to Twitter.

Requirements Addressed:
- Social Media Integration (1.3 Scope/Implementation Boundaries/Supported Platforms):
  Supports integration with Twitter for marketing content distribution.

Human Tasks:
1. Set up Twitter Developer Account and obtain API credentials
2. Configure environment variables for Twitter API key and secret
3. Review Twitter API rate limits and implement appropriate rate limiting
4. Set up error monitoring for Twitter API integration
"""

# Third-party imports
import requests  # version 2.31.0
import logging

# Internal imports
from ..models import SocialMediaPost

# Configure module logger
logger = logging.getLogger(__name__)

# Twitter API configuration
TWITTER_API_BASE_URL = "https://api.twitter.com/2"

def authenticate(api_key: str, api_secret_key: str) -> str:
    """
    Authenticates with the Twitter API using OAuth2 and retrieves an access token.

    Args:
        api_key (str): Twitter API key from developer account
        api_secret_key (str): Twitter API secret key from developer account

    Returns:
        str: The access token for authenticating subsequent API requests

    Raises:
        requests.exceptions.RequestException: If authentication request fails
        ValueError: If the response is invalid or missing the access token
    """
    try:
        # Construct authentication URL and payload
        auth_url = f"{TWITTER_API_BASE_URL}/oauth2/token"
        auth_payload = {
            "grant_type": "client_credentials"
        }
        
        # Prepare authentication headers
        auth_headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }

        # Send authentication request
        logger.info("Authenticating with Twitter API")
        response = requests.post(
            auth_url,
            auth=(api_key, api_secret_key),
            headers=auth_headers,
            data=auth_payload
        )
        
        # Validate response
        response.raise_for_status()
        auth_data = response.json()
        
        if "access_token" not in auth_data:
            raise ValueError("Access token not found in authentication response")
            
        access_token = auth_data["access_token"]
        logger.info("Successfully authenticated with Twitter API")
        
        return access_token
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Twitter API authentication failed: {str(e)}")
        raise
    except ValueError as e:
        logger.error(f"Invalid authentication response: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during Twitter authentication: {str(e)}")
        raise

def post_to_twitter(access_token: str, content: str) -> bool:
    """
    Posts content to Twitter using the Twitter API.

    Args:
        access_token (str): Valid Twitter API access token
        content (str): The text content to post to Twitter

    Returns:
        bool: True if the post was successfully published, otherwise False

    Requirements Addressed:
    - Social Media Integration: Enables posting content to Twitter platform
    """
    try:
        # Validate content length (Twitter's limit is 280 characters)
        if len(content) > 280:
            logger.error(f"Content exceeds Twitter's 280 character limit: {len(content)} characters")
            return False

        # Construct request headers with authentication
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        # Prepare tweet payload
        tweet_payload = {
            "text": content
        }

        # Send post request to Twitter API
        post_url = f"{TWITTER_API_BASE_URL}/tweets"
        logger.info("Sending tweet to Twitter API")
        
        response = requests.post(
            post_url,
            headers=headers,
            json=tweet_payload
        )

        # Check response status
        response.raise_for_status()
        tweet_data = response.json()

        # Verify tweet creation
        if "data" in tweet_data and "id" in tweet_data["data"]:
            logger.info(f"Successfully posted tweet with ID: {tweet_data['data']['id']}")
            return True
        else:
            logger.error("Tweet creation response missing expected data")
            return False

    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to post tweet: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error while posting tweet: {str(e)}")
        return False