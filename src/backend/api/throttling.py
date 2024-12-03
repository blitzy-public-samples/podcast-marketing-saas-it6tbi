"""
Custom throttling implementation for the Django REST API.

This module implements rate limiting mechanisms to control API request rates,
ensuring fair usage and preventing abuse.

Requirements Addressed:
- API Throttling (8.3.4 API Security Controls):
  Implements throttling mechanisms to control the rate of API requests,
  ensuring fair usage and preventing abuse.

Human Tasks:
1. Review and adjust the DEFAULT_THROTTLE_RATES based on production load patterns
2. Configure Redis cache backend for distributed rate limiting in production
3. Set up monitoring alerts for high throttling events
4. Review and update rate limits based on user feedback and system metrics
"""

# Third-party imports
from rest_framework.throttling import BaseThrottle  # rest_framework v3.14+
import logging

# Internal imports
from src.backend.common.exceptions import ValidationError
from src.backend.common.utils import cache_result

# Configure module logger
logger = logging.getLogger(__name__)

# Default throttling rates for different user types
DEFAULT_THROTTLE_RATES = {
    'user': '100/hour',    # Authenticated users
    'anon': '10/hour'      # Anonymous users
}

class CustomThrottle(BaseThrottle):
    """
    Custom throttling class that implements rate limiting based on user type
    and request patterns.
    
    The throttle uses a token bucket algorithm to track and limit request rates,
    with different limits for authenticated and anonymous users.
    """
    
    def __init__(self):
        """
        Initialize the CustomThrottle with default configuration.
        
        Sets up the rate limits and initializes the request history tracking.
        """
        self.rate = None
        self.history = {}
        self.cache_format = 'throttle_{ident}_{rate}'
        logger.debug("Initialized CustomThrottle")

    def get_ident(self, request):
        """
        Get a unique identifier for the request source.
        
        Args:
            request (HttpRequest): The incoming request object
            
        Returns:
            str: A unique identifier (user ID or IP address)
        """
        if request.user.is_authenticated:
            ident = str(request.user.id)
            logger.debug(f"Using user ID as throttle identifier: {ident}")
        else:
            ident = self.get_client_ip(request)
            logger.debug(f"Using IP address as throttle identifier: {ident}")
        
        return ident

    def get_client_ip(self, request):
        """
        Extract the client IP address from the request.
        
        Args:
            request (HttpRequest): The incoming request object
            
        Returns:
            str: The client's IP address
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get_rate(self, request):
        """
        Determine the rate limit for the request.
        
        Args:
            request (HttpRequest): The incoming request object
            
        Returns:
            str: The rate limit string (e.g., '100/hour')
        """
        if request.user.is_authenticated:
            return DEFAULT_THROTTLE_RATES['user']
        return DEFAULT_THROTTLE_RATES['anon']

    def parse_rate(self, rate):
        """
        Parse the rate string into numeric values.
        
        Args:
            rate (str): Rate string in format 'number/period'
            
        Returns:
            tuple: (number of requests, period in seconds)
            
        Raises:
            ValidationError: If the rate string is invalid
        """
        try:
            num, period = rate.split('/')
            num = int(num)
            
            if period == 'second':
                period = 1
            elif period == 'minute':
                period = 60
            elif period == 'hour':
                period = 3600
            elif period == 'day':
                period = 86400
            else:
                raise ValidationError(f"Invalid rate period: {period}")
                
            return num, period
            
        except (ValueError, AttributeError) as e:
            logger.error(f"Failed to parse rate string: {rate}", exc_info=e)
            raise ValidationError(f"Invalid rate format: {rate}")

    def allow_request(self, request, view):
        """
        Determine if the request should be allowed based on the rate limit.
        
        Args:
            request (HttpRequest): The incoming request object
            view (View): The view handling the request
            
        Returns:
            bool: True if the request is allowed, False otherwise
        """
        # Get the rate limit for this request
        self.rate = self.get_rate(request)
        if not self.rate:
            logger.warning("No rate limit defined, allowing request")
            return True
            
        # Get the unique identifier for the requester
        self.ident = self.get_ident(request)
        
        # Parse the rate limit
        num_requests, period = self.parse_rate(self.rate)
        
        # Generate cache key for this throttle
        cache_key = self.cache_format.format(
            ident=self.ident,
            rate=self.rate
        )
        
        # Try to get the current request count from cache
        try:
            history = cache_result(cache_key, [], period)
            
            # Clean old requests from history
            now = self.timer()
            while history and history[-1] <= now - period:
                history.pop()
            
            # Check if we're over the limit
            if len(history) >= num_requests:
                logger.warning(
                    f"Throttle limit exceeded for {self.ident}: "
                    f"{len(history)}/{num_requests} requests"
                )
                return False
            
            # Add current request to history
            history.insert(0, now)
            cache_result(cache_key, history, period)
            
            return True
            
        except Exception as e:
            logger.error(
                f"Error checking throttle for {self.ident}",
                exc_info=e
            )
            # In case of error, allow the request but log the issue
            return True

    def wait(self):
        """
        Returns the number of seconds to wait before the next request is allowed.
        
        Returns:
            int: Number of seconds to wait
        """
        if not self.history:
            return None
            
        num_requests, period = self.parse_rate(self.rate)
        oldest_request = self.history[-1]
        
        # Calculate when the oldest request will expire
        now = self.timer()
        wait_time = oldest_request + period - now
        
        logger.debug(f"Wait time for next request: {wait_time} seconds")
        return wait_time if wait_time > 0 else None

    def timer(self):
        """
        Get the current timestamp.
        
        Returns:
            float: Current timestamp in seconds
        """
        from time import time
        return time()