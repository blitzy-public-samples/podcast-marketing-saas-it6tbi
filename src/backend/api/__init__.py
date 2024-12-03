"""
API Module Initialization

This module initializes the API layer for the Django backend, integrating schema generation,
documentation, and routing functionalities to provide a cohesive API structure.

Requirements Addressed:
- API Initialization (8.3 API Design/8.3.2 Interface Specifications):
  Provides a centralized initialization mechanism for the API module, ensuring modularity
  and maintainability.

Human Tasks:
1. Verify that all API endpoints are properly documented
2. Review rate limiting configuration for production environment
3. Ensure authentication middleware is correctly configured
4. Monitor API performance and usage patterns
"""

# Internal imports with relative paths
from .urls import urlpatterns
from .schema import SchemaView
from .docs import DocsView
from ..core.settings.base import BASE_DIR

# Export required components for API functionality
__all__ = [
    'SchemaView',
    'DocsView',
    'urlpatterns'
]

# Initialize API components
schema_view = SchemaView(get_response=None)
docs_view = DocsView(get_response=None)

# Version information
API_VERSION = 'v1'
API_TITLE = 'Podcast Marketing Automation API'
API_DESCRIPTION = """
API for podcast automation and processing, providing endpoints for:
- Podcast management and episode processing
- Marketing automation and social media integration
- Analytics and performance tracking
- AI-driven content generation
"""