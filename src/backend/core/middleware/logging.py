"""
HTTP Request/Response Logging Middleware

This middleware implements structured logging for HTTP requests and responses in the Django backend.

Requirements Addressed:
- Error Handling and Logging (7.4.2 Security Architecture):
  Ensures that HTTP requests and responses are logged in a structured and consistent manner
  for debugging and monitoring.

Human Tasks:
1. Ensure the logs directory exists and has appropriate write permissions
2. Review log rotation settings with infrastructure team
3. Configure log level based on environment requirements
4. Verify log file path aligns with deployment environment
"""

# Standard library imports
import logging  # standard-library
import os  # standard-library
from typing import Optional

# Internal imports
from ...common.logging import configure_logging
from ..settings.base import BASE_DIR

# Global constants
LOG_FILE = os.path.join(BASE_DIR, 'logs', 'middleware.log')

class LoggingMiddleware:
    """
    Middleware for logging HTTP requests and responses in a structured format.
    Provides detailed logging of request/response cycles for debugging and monitoring.
    """

    def __init__(self, get_response=None):
        """
        Initializes the LoggingMiddleware with custom logger configuration.
        
        Args:
            get_response: The middleware chain callable
        """
        self.get_response = get_response
        
        # Configure logging if not already configured
        configure_logging()
        
        # Set up middleware-specific logger
        self.logger = logging.getLogger('middleware.http')
        self.logger.setLevel(logging.INFO)
        
        # Create middleware-specific file handler
        handler = logging.FileHandler(LOG_FILE)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        
        self.logger.info("LoggingMiddleware initialized")

    def __call__(self, request):
        """
        Processes the request and response cycle.
        
        Args:
            request: The HttpRequest object
            
        Returns:
            HttpResponse: The response from the view
        """
        response = self.get_response(request)
        return response

    def process_request(self, request) -> None:
        """
        Logs incoming HTTP request details.
        
        Args:
            request: The HttpRequest object being processed
        """
        # Extract relevant request details
        request_data = {
            'method': request.method,
            'path': request.path,
            'query_params': request.GET.dict(),
            'remote_addr': request.META.get('REMOTE_ADDR'),
            'user_agent': request.META.get('HTTP_USER_AGENT'),
            'content_type': request.META.get('CONTENT_TYPE'),
            'content_length': request.META.get('CONTENT_LENGTH'),
            'user': str(request.user) if hasattr(request, 'user') else 'AnonymousUser'
        }

        # Log request details
        self.logger.info(
            "Incoming request | Method: %(method)s | Path: %(path)s | "
            "User: %(user)s | IP: %(remote_addr)s",
            request_data
        )
        
        # Log detailed request information at debug level
        self.logger.debug(
            "Request details | Query params: %(query_params)s | "
            "User-Agent: %(user_agent)s | Content-Type: %(content_type)s | "
            "Content-Length: %(content_length)s",
            request_data
        )

    def process_response(self, request, response) -> 'HttpResponse':
        """
        Logs outgoing HTTP response details.
        
        Args:
            request: The HttpRequest object
            response: The HttpResponse object
            
        Returns:
            HttpResponse: The response object after logging
        """
        # Extract relevant response details
        response_data = {
            'status_code': response.status_code,
            'path': request.path,
            'method': request.method,
            'content_type': response.get('Content-Type'),
            'content_length': response.get('Content-Length'),
            'user': str(request.user) if hasattr(request, 'user') else 'AnonymousUser'
        }

        # Determine log level based on status code
        if 200 <= response.status_code < 400:
            log_level = logging.INFO
        else:
            log_level = logging.ERROR

        # Log response details
        self.logger.log(
            log_level,
            "Outgoing response | Status: %(status_code)s | Method: %(method)s | "
            "Path: %(path)s | User: %(user)s",
            response_data
        )
        
        # Log detailed response information at debug level
        self.logger.debug(
            "Response details | Content-Type: %(content_type)s | "
            "Content-Length: %(content_length)s",
            response_data
        )

        return response