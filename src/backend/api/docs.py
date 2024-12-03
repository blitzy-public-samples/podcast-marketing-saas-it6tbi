"""
API Documentation Module

This module is responsible for generating and serving API documentation for the Django REST API.
It integrates with schema generation and versioning modules to provide accurate and 
version-specific documentation.

Requirements Addressed:
- API Documentation (8.3.2 Interface Specifications):
  Provides a centralized mechanism for generating and serving API documentation,
  ensuring consistency and version-specific accuracy.

Human Tasks:
1. Review documentation completeness for all API endpoints
2. Verify documentation security settings align with security requirements
3. Configure appropriate caching for documentation responses
4. Ensure documentation reflects latest API changes
"""

# Standard library imports
import json  # standard-library
import logging  # standard-library
from typing import Dict, Any, Optional

# Internal imports
from .schema import generate_schema
from .versioning import get_version_from_request
from core.settings.base import BASE_DIR
from core.settings.development import DEBUG
from core.settings.production import SECURE_SSL_REDIRECT

# Configure module logger
logger = logging.getLogger(__name__)

# Default API version constant
DEFAULT_DOCS_VERSION = 'v1'

def generate_docs(request) -> str:
    """
    Generates the API documentation based on the current version and configuration.

    Args:
        request (HttpRequest): The incoming HTTP request

    Returns:
        str: The generated API documentation in JSON format

    Requirements Addressed:
    - API Documentation (8.3.2 Interface Specifications):
      Generates version-specific API documentation with accurate schema information
    """
    try:
        # Extract API version from request
        version = get_version_from_request(request)
        logger.debug(f"Generating documentation for API version: {version}")

        # Generate schema for the current version
        schema_content = generate_schema(request)
        
        # Parse the schema content
        schema = json.loads(schema_content)

        # Enhance schema with additional documentation
        docs = {
            "api_version": version,
            "generated_at": schema.get("info", {}).get("version"),
            "base_url": f"{'https' if SECURE_SSL_REDIRECT else 'http'}://{request.get_host()}/api/{version}",
            "description": (
                "Podcast Marketing Automation API\n\n"
                "This API provides endpoints for managing podcast content, "
                "generating marketing materials, and automating social media distribution."
            ),
            "schema": schema,
            "authentication": {
                "type": "Bearer",
                "description": "JWT token authentication required for all endpoints",
                "example": "Authorization: Bearer <token>"
            },
            "rate_limiting": {
                "authenticated": "100 requests per hour",
                "anonymous": "10 requests per hour"
            }
        }

        # Add development mode information if applicable
        if DEBUG:
            docs["environment"] = "development"
            docs["debug_info"] = {
                "request_headers": dict(request.headers),
                "host": request.get_host(),
                "scheme": request.scheme
            }

        logger.info(f"Successfully generated documentation for version {version}")
        return json.dumps(docs, indent=2)

    except Exception as e:
        logger.error(f"Error generating API documentation: {str(e)}")
        raise


class DocsView:
    """
    A view class for serving the API documentation to clients.

    This class implements middleware pattern to handle documentation requests
    and provides version-specific API documentation.

    Requirements Addressed:
    - API Documentation (8.3.2 Interface Specifications):
      Serves API documentation with appropriate security controls and versioning
    """

    def __init__(self, get_response):
        """
        Initializes the DocsView class with the get_response callable.

        Args:
            get_response (callable): The get_response callable from the middleware chain
        """
        self.get_response = get_response
        self.logger = logging.getLogger(__name__)
        self.logger.info("DocsView initialized")

    def get_docs(self, request):
        """
        Handles GET requests to retrieve the API documentation.

        Args:
            request (HttpRequest): The incoming request object

        Returns:
            HttpResponse: The API documentation in JSON format with appropriate headers
        """
        try:
            # Generate documentation
            docs_content = generate_docs(request)

            # Prepare response with security headers
            response = {
                "status_code": 200,
                "content": docs_content,
                "headers": {
                    "Content-Type": "application/json",
                    "X-Content-Type-Options": "nosniff",
                    "X-Frame-Options": "DENY",
                    "X-XSS-Protection": "1; mode=block",
                    "Cache-Control": "public, max-age=300" if not DEBUG else "no-store"
                }
            }

            if SECURE_SSL_REDIRECT:
                response["headers"]["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

            self.logger.info("Documentation served successfully")
            return response

        except Exception as e:
            self.logger.error(f"Error serving documentation: {str(e)}")
            return {
                "status_code": 500,
                "content": json.dumps({
                    "error": "Internal server error",
                    "message": str(e) if DEBUG else "An error occurred while generating documentation"
                }),
                "headers": {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            }