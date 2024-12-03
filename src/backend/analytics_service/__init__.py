"""
Analytics Service Initialization Module

This module initializes the analytics service by consolidating and exposing key components
such as models, serializers, services, tasks, views, and URL routing for engagement and
performance metrics.

Requirements Addressed:
- Analytics Service Initialization (7.2 Component Details/Analytics Service):
  Consolidates and exposes analytics service components for seamless integration with
  the rest of the system.

Human Tasks:
1. Review import paths to ensure they match the project structure
2. Verify that all required components are properly exposed
3. Confirm that circular dependencies are avoided
"""

# Import models
from .models import (
    EngagementMetric,
    PerformanceMetric
)

# Import serializers
from .serializers import (
    EngagementMetricSerializer,
    PerformanceMetricSerializer
)

# Import services
from .services import (
    process_engagement_metrics,
    process_performance_metrics
)

# Import tasks
from .tasks import (
    process_engagement_metrics_task,
    process_performance_metrics_task
)

# Import views
from .views import (
    EngagementMetricsView,
    PerformanceMetricsView
)

# Import URL patterns
from .urls import urlpatterns

# Define package exports
__all__ = [
    # Models
    'EngagementMetric',
    'PerformanceMetric',
    
    # Serializers
    'EngagementMetricSerializer',
    'PerformanceMetricSerializer',
    
    # Services
    'process_engagement_metrics',
    'process_performance_metrics',
    
    # Tasks
    'process_engagement_metrics_task',
    'process_performance_metrics_task',
    
    # Views
    'EngagementMetricsView',
    'PerformanceMetricsView',
    
    # URLs
    'urlpatterns'
]

# Version information
__version__ = '1.0.0'
__author__ = 'Analytics Service Team'