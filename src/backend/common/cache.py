"""
Backend Caching Module

This module provides caching utilities for efficient data retrieval and storage
with configurable time-to-live (TTL) settings.

Requirements Addressed:
- Caching Mechanism (7.3.2 Communication Patterns):
  Implements caching utilities to improve performance and reduce redundant
  computations across backend services.

Human Tasks:
1. Verify Redis server connection details in deployment environment
2. Ensure Redis server has sufficient memory allocation
3. Review cache eviction policies in Redis configuration
4. Confirm network security rules allow Redis connectivity
"""

# Third-party imports
import redis  # version 4.5.1
import json
import logging
from typing import Any, Optional, Union

# Internal imports
from .constants import CACHE_TTL_SECONDS
from .exceptions import ValidationError
from .logging import configure_logging

# Configure logging for the cache module
logger = logging.getLogger(__name__)
configure_logging()

# Global constants
CACHE_PREFIX = 'app_cache:'

# Redis client configuration
# Note: In a production environment, these should be loaded from environment variables
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0

def _get_redis_client() -> redis.Redis:
    """
    Creates and returns a Redis client instance.
    
    Returns:
        redis.Redis: Configured Redis client instance
    
    Raises:
        ValidationError: If Redis connection cannot be established
    """
    try:
        client = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            decode_responses=True
        )
        # Test the connection
        client.ping()
        return client
    except redis.ConnectionError as e:
        error_msg = f"Failed to connect to Redis server: {str(e)}"
        logger.error(error_msg)
        raise ValidationError(error_msg)

def set_cache(key: str, value: Any, ttl: Optional[int] = CACHE_TTL_SECONDS) -> bool:
    """
    Stores a key-value pair in the cache with an optional TTL.
    
    Args:
        key (str): The key under which to store the value
        value (Any): The value to store (will be JSON serialized)
        ttl (Optional[int]): Time-to-live in seconds, defaults to CACHE_TTL_SECONDS
    
    Returns:
        bool: True if the key-value pair is successfully cached
    
    Raises:
        ValidationError: If the key is invalid or value cannot be serialized
    """
    if not key or not isinstance(key, str):
        error_msg = "Cache key must be a non-empty string"
        logger.error(error_msg)
        raise ValidationError(error_msg)

    try:
        # Prepend the cache prefix to the key
        prefixed_key = f"{CACHE_PREFIX}{key}"
        
        # Serialize the value to JSON
        serialized_value = json.dumps(value)
        
        # Get Redis client and set the value
        redis_client = _get_redis_client()
        redis_client.setex(
            name=prefixed_key,
            time=ttl,
            value=serialized_value
        )
        
        logger.info(f"Successfully cached value for key: {key} with TTL: {ttl}s")
        return True
        
    except (TypeError, ValueError) as e:
        error_msg = f"Failed to serialize cache value: {str(e)}"
        logger.error(error_msg)
        raise ValidationError(error_msg)
    except Exception as e:
        error_msg = f"Unexpected error while setting cache: {str(e)}"
        logger.error(error_msg)
        raise ValidationError(error_msg)

def get_cache(key: str) -> Optional[Any]:
    """
    Retrieves a value from the cache by its key.
    
    Args:
        key (str): The key to retrieve the value for
    
    Returns:
        Optional[Any]: The cached value if it exists, otherwise None
    
    Raises:
        ValidationError: If the key is invalid or value cannot be deserialized
    """
    if not key or not isinstance(key, str):
        error_msg = "Cache key must be a non-empty string"
        logger.error(error_msg)
        raise ValidationError(error_msg)

    try:
        # Prepend the cache prefix to the key
        prefixed_key = f"{CACHE_PREFIX}{key}"
        
        # Get Redis client and retrieve the value
        redis_client = _get_redis_client()
        cached_value = redis_client.get(prefixed_key)
        
        if cached_value is None:
            logger.debug(f"Cache miss for key: {key}")
            return None
            
        # Deserialize the JSON value
        deserialized_value = json.loads(cached_value)
        logger.info(f"Successfully retrieved cached value for key: {key}")
        return deserialized_value
        
    except json.JSONDecodeError as e:
        error_msg = f"Failed to deserialize cached value: {str(e)}"
        logger.error(error_msg)
        raise ValidationError(error_msg)
    except Exception as e:
        error_msg = f"Unexpected error while retrieving from cache: {str(e)}"
        logger.error(error_msg)
        raise ValidationError(error_msg)

def delete_cache(key: str) -> bool:
    """
    Deletes a key-value pair from the cache.
    
    Args:
        key (str): The key to delete from the cache
    
    Returns:
        bool: True if the key is successfully deleted
    
    Raises:
        ValidationError: If the key is invalid or deletion fails
    """
    if not key or not isinstance(key, str):
        error_msg = "Cache key must be a non-empty string"
        logger.error(error_msg)
        raise ValidationError(error_msg)

    try:
        # Prepend the cache prefix to the key
        prefixed_key = f"{CACHE_PREFIX}{key}"
        
        # Get Redis client and delete the key
        redis_client = _get_redis_client()
        deleted = redis_client.delete(prefixed_key)
        
        if deleted:
            logger.info(f"Successfully deleted cache key: {key}")
            return True
        else:
            logger.debug(f"Key not found in cache: {key}")
            return False
            
    except Exception as e:
        error_msg = f"Unexpected error while deleting from cache: {str(e)}"
        logger.error(error_msg)
        raise ValidationError(error_msg)