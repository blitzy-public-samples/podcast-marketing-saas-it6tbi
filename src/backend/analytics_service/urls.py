"""
Analytics Service URL Configuration

This module defines the URL routing for the analytics service, mapping API endpoints
to their corresponding views for engagement and performance metrics.

Requirements Addressed:
- Analytics API Routing (8.3 API Design/8.3.2 Interface Specifications):
  Provides URL routing for analytics service endpoints, enabling modular and 
  maintainable API design.
"""

# External imports - version specified in requirements
from django.urls import path  # django version 4.2

# Internal imports
from .views import (
    EngagementMetricsView,
    PerformanceMetricsView
)

# Define URL patterns for the analytics service
urlpatterns = [
    # Engagement metrics endpoints
    path(
        'engagement/',
        EngagementMetricsView.as_view(),
        name='engagement-metrics'
    ),
    
    # Performance metrics endpoints
    path(
        'performance/',
        PerformanceMetricsView.as_view(),
        name='performance-metrics'
    ),
]