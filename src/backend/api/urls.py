"""
API URL Configuration

This module defines the URL routing for the API layer of the Django backend,
integrating various service-specific URL configurations into a unified routing structure.

Requirements Addressed:
- API Routing (8.3 API Design/8.3.2 Interface Specifications):
  Ensures modular and maintainable routing for all API endpoints across different services.

Human Tasks:
1. Review URL patterns to ensure they match API documentation
2. Verify that rate limiting is properly configured for all endpoints
3. Confirm authentication middleware is correctly applied
4. Monitor endpoint performance and usage patterns
"""

# Django URL routing - version 4.2
from django.urls import path, include

# Internal imports - schema view for API documentation
from .schema import schema_view

# Internal imports - service-specific URL configurations
from src.backend.podcast_service.urls import router as podcast_router
from src.backend.marketing_service.urls import urlpatterns as marketing_patterns
from src.backend.analytics_service.urls import urlpatterns as analytics_patterns
from src.backend.ai_service.urls import urlpatterns as ai_patterns

# Define URL patterns for the API layer
urlpatterns = [
    # API Documentation endpoint
    # Serves the OpenAPI schema for API documentation
    path(
        'schema/',
        schema_view.get_schema,
        name='api-schema'
    ),
    
    # Podcast Service endpoints
    # Includes all podcast-related API endpoints
    path(
        'podcasts/',
        include((podcast_router.urls, 'podcast'), namespace='podcast-api')
    ),
    
    # Marketing Service endpoints
    # Includes all marketing-related API endpoints
    path(
        'marketing/',
        include((marketing_patterns, 'marketing'), namespace='marketing-api')
    ),
    
    # Analytics Service endpoints
    # Includes all analytics-related API endpoints
    path(
        'analytics/',
        include((analytics_patterns, 'analytics'), namespace='analytics-api')
    ),
    
    # AI Service endpoints
    # Includes all AI-related API endpoints
    path(
        'ai/',
        include((ai_patterns, 'ai'), namespace='ai-api')
    ),
]