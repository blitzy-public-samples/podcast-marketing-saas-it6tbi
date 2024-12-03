"""
API Versioning Module

This module handles API versioning for the Django REST API, providing utilities to extract
and validate API versions from incoming requests.

Requirements Addressed:
- API Versioning (7.3.2 Communication Patterns):
  Implements versioning mechanisms to ensure backward compatibility and proper routing
  of API requests.

Human Tasks:
1. Review and update SUPPORTED_API_VERSIONS when introducing new API versions
2. Verify that rate limiting thresholds align with infrastructure capacity
3. Configure logging levels appropriate for the environment
"""

# Standard library imports
import re  # standard-library
import logging  # standard-library
from typing import Optional

# Internal imports
from core.settings.base import BASE_DIR
from core.settings.development import DEBUG
from core.settings.production import ALLOWED_HOSTS

# Configure logger
logger = logging.getLogger(__name__)

# API versioning constants
DEFAULT_API_VERSION = 'v1'
SUPPORTED_API_VERSIONS = ['v1', 'v2']

# Rate limiting constants
MAX_REQUESTS_PER_MINUTE = 60
REQUEST_WINDOW_SECONDS = 60

# Request tracking for rate limiting
request_history = {}

def get_version_from_request(request) -> str:
    """
    Extracts the API version from the incoming HTTP request.

    Args:
        request: The incoming HTTP request object

    Returns:
        str: The extracted API version or the default version if none is specified

    Example Accept header format: 'application/json; version=v1'
    """
    try:
        accept_header = request.headers.get('Accept', '')
        
        # Use regex to extract version from Accept header
        version_match = re.search(r'version=(v\d+)', accept_header)
        
        if version_match:
            version = version_match.group(1)
            if validate_version(version):
                logger.debug(f"API version {version} extracted from request")
                return version
            else:
                logger.warning(f"Invalid API version requested: {version}")
        
        logger.debug(f"No valid version found in request, using default: {DEFAULT_API_VERSION}")
        return DEFAULT_API_VERSION
    
    except Exception as e:
        logger.error(f"Error extracting API version: {str(e)}")
        return DEFAULT_API_VERSION

def validate_version(version: str) -> bool:
    """
    Validates the provided API version against supported versions.

    Args:
        version: The version string to validate

    Returns:
        bool: True if the version is valid, otherwise False
    """
    try:
        is_valid = version in SUPPORTED_API_VERSIONS
        if not is_valid:
            logger.warning(f"Unsupported API version requested: {version}")
        return is_valid
    
    except Exception as e:
        logger.error(f"Error validating API version: {str(e)}")
        return False

def allow_request(request) -> bool:
    """
    Determines whether a request is allowed based on throttling rules.

    Args:
        request: The incoming HTTP request object

    Returns:
        bool: True if the request is allowed, otherwise False
    """
    import time
    from datetime import datetime

    try:
        # Get client IP, considering potential proxy headers
        client_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
        
        current_time = time.time()
        
        # Initialize or clean up request history for the client
        if client_ip not in request_history:
            request_history[client_ip] = []
        
        # Remove requests outside the current window
        request_history[client_ip] = [
            timestamp for timestamp in request_history[client_ip]
            if current_time - timestamp <= REQUEST_WINDOW_SECONDS
        ]
        
        # Check if request count exceeds threshold
        if len(request_history[client_ip]) >= MAX_REQUESTS_PER_MINUTE:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return False
        
        # Add current request timestamp
        request_history[client_ip].append(current_time)
        
        # Log request details if in debug mode
        if DEBUG:
            logger.debug(
                f"Request allowed for IP: {client_ip}, "
                f"Count: {len(request_history[client_ip])}/{MAX_REQUESTS_PER_MINUTE}"
            )
        
        return True
    
    except Exception as e:
        logger.error(f"Error in request throttling: {str(e)}")
        # Allow request in case of error to prevent blocking legitimate traffic
        return True