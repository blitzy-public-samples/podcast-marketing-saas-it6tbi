"""
Analytics Service App Configuration

This module defines the Django app configuration for the analytics service,
enabling its integration with the overall system.

Requirements Addressed:
- Application Registration (7.2 Component Details/Analytics Service):
  Registers the analytics service as a Django app to enable its functionality
  within the system.
"""

# django version 4.2
from django.apps import AppConfig

# Import models to ensure they are registered with Django
from .models import EngagementMetric, PerformanceMetric


class AnalyticsServiceConfig(AppConfig):
    """
    The configuration class for the analytics service app, registering it with Django.
    
    Requirements Addressed:
    - Application Registration: Configures and registers the analytics service
      as a Django application
    """
    
    # Use BigAutoField as the primary key type for all models in this app
    default_auto_field = 'django.db.models.BigAutoField'
    
    # The name of the app as it should be referenced in Django settings
    name = 'analytics_service'