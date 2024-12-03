"""
URL routing configuration for the podcast service.

Requirements Addressed:
- Podcast Management (1.3 Scope/In-Scope Elements/Core Features and Functionalities):
  Supports podcast management by providing URL routing for podcast and episode-related API endpoints.
- API Routing (8.3 API Design/8.3.2 Interface Specifications):
  Ensures modular and maintainable routing for podcast-related API endpoints.

Human Tasks:
1. Review URL patterns to ensure they align with API documentation
2. Verify URL namespace configuration in main URLs file
3. Configure appropriate permissions for API endpoints
4. Set up rate limiting rules for API routes
"""

# django.urls v4.2
from django.urls import path, include

# rest_framework.routers v3.14
from rest_framework.routers import DefaultRouter

# Internal imports with relative paths
from .views import PodcastView, EpisodeView
from .apps import PodcastServiceConfig

# Create a router instance for registering viewsets
router = DefaultRouter()

# Register podcast and episode endpoints with the router
# This will create the following URL patterns:
# - /podcasts/ (GET: list, POST: create)
# - /podcasts/{id}/ (GET: retrieve, PUT: update, DELETE: delete)
# - /episodes/ (GET: list, POST: create)
# - /episodes/{id}/ (GET: retrieve, PUT: update, DELETE: delete)
router.register(r'podcasts', PodcastView, basename='podcast')
router.register(r'episodes', EpisodeView, basename='episode')

# URL patterns for the podcast service
# The app_name should match the Django app name defined in PodcastServiceConfig
app_name = PodcastServiceConfig.name

# Include the router URLs in the urlpatterns
# This makes the API endpoints available under the podcast service namespace
urlpatterns = [
    # Include all routes registered with the router
    path('', include(router.urls)),
]