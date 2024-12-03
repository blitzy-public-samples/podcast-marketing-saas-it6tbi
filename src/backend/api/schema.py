"""
API Schema Management Module

This module is responsible for generating and managing the API schema for the Django REST API.
It integrates with versioning, throttling, and documentation modules to ensure accurate and
secure schema generation.

Requirements Addressed:
- API Schema Management (8.3.2 Interface Specifications):
  Provides a centralized mechanism for generating and managing the API schema,
  ensuring consistency and version-specific accuracy.

Human Tasks:
1. Review schema generation performance in production environment
2. Verify schema documentation completeness for all API endpoints
3. Ensure schema security settings align with security requirements
4. Configure appropriate caching for schema responses
"""

# Standard library imports
import json  # standard-library
import logging  # standard-library

# Internal imports
from api.versioning import get_version_from_request
from api.throttling import CustomThrottle
from core.settings.base import BASE_DIR
from core.settings.development import DEBUG
from core.settings.production import SECURE_SSL_REDIRECT

# Configure module logger
logger = logging.getLogger(__name__)

# Schema version constant
DEFAULT_SCHEMA_VERSION = 'v1'

def generate_schema(request):
    """
    Generates the API schema based on the current version and configuration.

    Args:
        request (HttpRequest): The incoming HTTP request

    Returns:
        str: The generated API schema in JSON format

    Requirements Addressed:
    - API Schema Management (8.3.2 Interface Specifications):
      Generates version-specific API schema documentation
    """
    try:
        # Extract API version from request
        version = get_version_from_request(request)
        logger.debug(f"Generating schema for API version: {version}")

        # Base schema structure
        schema = {
            "openapi": "3.0.0",
            "info": {
                "title": "Podcast Automation API",
                "version": version,
                "description": "API for podcast automation and processing"
            },
            "servers": [
                {
                    "url": f"{'https' if SECURE_SSL_REDIRECT else 'http'}://{request.get_host()}/api/{version}",
                    "description": "API server"
                }
            ],
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "paths": {},
            "components": {
                "securitySchemes": {
                    "bearerAuth": {
                        "type": "http",
                        "scheme": "bearer",
                        "bearerFormat": "JWT"
                    }
                }
            }
        }

        # Load version-specific schema paths
        schema_file_path = f"{BASE_DIR}/api/schemas/{version}/schema.json"
        try:
            with open(schema_file_path, 'r') as f:
                version_schema = json.load(f)
                schema["paths"].update(version_schema.get("paths", {}))
                schema["components"].update(version_schema.get("components", {}))
        except FileNotFoundError:
            logger.error(f"Schema file not found for version {version}")
            raise ValueError(f"Schema not available for version {version}")

        # Add debug information if in development mode
        if DEBUG:
            schema["info"]["description"] += "\n\nDevelopment Mode: Additional debugging information available"

        logger.info(f"Successfully generated schema for version {version}")
        return json.dumps(schema, indent=2)

    except Exception as e:
        logger.error(f"Error generating API schema: {str(e)}")
        raise


class SchemaView:
    """
    A view class for serving the API schema to clients.

    This class implements rate limiting and provides the API schema in a
    standardized format.

    Requirements Addressed:
    - API Schema Management (8.3.2 Interface Specifications):
      Serves API schema documentation with appropriate security controls
    """

    def __init__(self, get_response):
        """
        Initializes the SchemaView class.

        Args:
            get_response (callable): The get_response callable from the middleware chain
        """
        self.get_response = get_response
        self.throttle = CustomThrottle()
        logger.info("SchemaView initialized")

    def get_schema(self, request):
        """
        Handles GET requests to retrieve the API schema.

        Args:
            request (HttpRequest): The incoming HTTP request

        Returns:
            HttpResponse: The API schema in JSON format
        """
        try:
            # Check throttling
            if not self.throttle.allow_request(request, None):
                logger.warning(f"Request throttled for {self.throttle.get_ident(request)}")
                return {
                    "status_code": 429,
                    "content": {
                        "error": "Too many requests",
                        "retry_after": self.throttle.wait()
                    }
                }

            # Generate schema
            schema_content = generate_schema(request)

            # Prepare response
            response = {
                "status_code": 200,
                "content": schema_content,
                "content_type": "application/json"
            }

            logger.info("Schema successfully served")
            return response

        except ValueError as e:
            logger.error(f"Schema generation failed: {str(e)}")
            return {
                "status_code": 404,
                "content": {
                    "error": str(e)
                }
            }
        except Exception as e:
            logger.error(f"Unexpected error serving schema: {str(e)}")
            return {
                "status_code": 500,
                "content": {
                    "error": "Internal server error"
                }
            }