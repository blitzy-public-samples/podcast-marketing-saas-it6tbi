"""
Central URL Configuration for Django Backend

This module defines the central URL routing for the Django backend application,
integrating various service-specific URL configurations into a unified routing structure.

Requirements Addressed:
- API Routing (8.3 API Design/8.3.2 Interface Specifications):
  Provides a centralized routing mechanism for all API endpoints, ensuring modularity
  and maintainability.

Human Tasks:
1. Review URL patterns to ensure they match API documentation
2. Verify URL namespace configuration for each service
3. Configure rate limiting for API endpoints
4. Set up monitoring for endpoint usage patterns
"""

# Django URL routing - version 4.2
from django.urls import path, include

# Import service-specific URL configurations
from api.urls import urlpatterns as api_patterns
from auth_service.urls import urlpatterns as auth_patterns
from podcast_service.urls import urlpatterns as podcast_patterns
from marketing_service.urls import urlpatterns as marketing_patterns
from storage_service.urls import urlpatterns as storage_patterns
from analytics_service.urls import urlpatterns as analytics_patterns
from ai_service.urls import urlpatterns as ai_patterns

# Define URL patterns for the Django backend
urlpatterns = [
    # API endpoints
    # Routes all API-related requests to the API module
    path(
        'api/',
        include((api_patterns, 'api'), namespace='api')
    ),
    
    # Authentication Service endpoints
    # Handles user authentication and management
    path(
        'auth/',
        include((auth_patterns, 'auth_service'), namespace='auth')
    ),
    
    # Podcast Service endpoints
    # Manages podcast-related operations
    path(
        'podcasts/',
        include((podcast_patterns, 'podcast_service'), namespace='podcasts')
    ),
    
    # Marketing Service endpoints
    # Handles marketing automation and campaign management
    path(
        'marketing/',
        include((marketing_patterns, 'marketing_service'), namespace='marketing')
    ),
    
    # Storage Service endpoints
    # Manages file storage operations
    path(
        'storage/',
        include((storage_patterns, 'storage_service'), namespace='storage')
    ),
    
    # Analytics Service endpoints
    # Provides analytics and metrics functionality
    path(
        'analytics/',
        include((analytics_patterns, 'analytics_service'), namespace='analytics')
    ),
    
    # AI Service endpoints
    # Handles AI-driven operations like transcription and content generation
    path(
        'ai/',
        include((ai_patterns, 'ai_service'), namespace='ai')
    ),
]