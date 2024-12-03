"""
Analytics Service Metrics Initialization Module

This module initializes the metrics submodule by exposing key functions for engagement 
and performance metrics analysis.

Requirements Addressed:
- Metrics Collection and Analysis (7.2 Component Details/Analytics Service):
  Exposes core functions for collecting and analyzing metrics, including engagement
  and performance metrics, to provide insights into content performance.
"""

# Import engagement metrics functions
from .engagement import (
    calculate_engagement_rate,
    analyze_engagement_trends
)

# Import performance metrics functions
from .performance import (
    calculate_growth_rate,
    generate_performance_insights
)

# Define exported functions
__all__ = [
    'calculate_engagement_rate',
    'analyze_engagement_trends',
    'calculate_growth_rate',
    'generate_performance_insights'
]