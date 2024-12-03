"""
Security Middleware Implementation

This middleware enforces security measures such as HTTPS redirection and secure headers
in the Django backend application.

Requirements Addressed:
- Security Architecture (7.4.2 Security Architecture):
  Ensures that HTTP requests comply with security policies, such as HTTPS enforcement
  and secure headers.

Human Tasks:
1. Review and customize Content-Security-Policy headers based on application needs
2. Configure HSTS settings according to production requirements
3. Verify SSL certificate configuration on production servers
4. Ensure proper reverse proxy configuration for HTTPS handling
"""

# Standard library imports
import logging  # standard-library
from typing import Optional

# Django imports
from django.http import HttpRequest, HttpResponse
from django.http.response import HttpResponsePermanentRedirect

# Internal imports
from ...common.exceptions import ValidationError
from ...common.logging import configure_logging
from .logging import LoggingMiddleware

# Global security headers configuration
SECURE_HEADERS = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self';",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
}

class SecurityMiddleware:
    """
    Middleware for enforcing security measures such as HTTPS redirection and secure headers.
    Implements security best practices for HTTP request/response handling.
    """

    def __init__(self):
        """
        Initializes the SecurityMiddleware with logging configuration and secure headers.
        """
        # Configure logging
        configure_logging()
        self.logger = logging.getLogger('middleware.security')
        self.logger.setLevel(logging.INFO)
        
        # Initialize secure headers
        self.secure_headers = SECURE_HEADERS
        self.logger.info("SecurityMiddleware initialized with secure headers configuration")

    def process_request(self, request: HttpRequest) -> Optional[HttpResponse]:
        """
        Processes incoming requests to enforce HTTPS.
        
        Args:
            request: The incoming HttpRequest object
            
        Returns:
            HttpResponse: Redirect response if HTTPS is required, None otherwise
            
        Raises:
            ValidationError: If there's an error processing the security requirements
        """
        try:
            # Check if request is secure (HTTPS)
            if not request.is_secure():
                # Get the current URL components
                host = request.get_host()
                path = request.get_full_path()
                
                # Construct HTTPS URL
                secure_url = f'https://{host}{path}'
                
                self.logger.info(
                    "Redirecting insecure request to HTTPS: %s -> %s",
                    request.build_absolute_uri(),
                    secure_url
                )
                
                # Return permanent redirect to HTTPS
                return HttpResponsePermanentRedirect(secure_url)
                
        except Exception as e:
            error_msg = f"Error processing security requirements: {str(e)}"
            self.logger.error(error_msg)
            raise ValidationError(error_msg)
            
        return None

    def process_response(self, request: HttpRequest, response: HttpResponse) -> HttpResponse:
        """
        Adds security headers to the HTTP response.
        
        Args:
            request: The HttpRequest object
            response: The HttpResponse object to be modified
            
        Returns:
            HttpResponse: The modified response with security headers
            
        Raises:
            ValidationError: If there's an error adding security headers
        """
        try:
            # Add security headers to response
            for header, value in self.secure_headers.items():
                response[header] = value
                
            self.logger.debug(
                "Added security headers to response for path: %s",
                request.path
            )
            
            return response
            
        except Exception as e:
            error_msg = f"Error adding security headers: {str(e)}"
            self.logger.error(error_msg)
            raise ValidationError(error_msg)