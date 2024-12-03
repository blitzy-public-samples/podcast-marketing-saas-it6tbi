"""
Analytics Service Serializers

This module defines serializers for converting EngagementMetric and PerformanceMetric models
into JSON format for API responses and vice versa.

Requirements Addressed:
- API Serialization (7.2 Component Details/Analytics Service):
  Implements serializers to convert data models into JSON format for API responses
  and to validate incoming data.
"""

# rest_framework version 3.14.0
from rest_framework import serializers
from .models import EngagementMetric, PerformanceMetric


class EngagementMetricSerializer(serializers.ModelSerializer):
    """
    A serializer for the EngagementMetric model, converting it to and from JSON format.
    
    This serializer handles all fields from the EngagementMetric model including:
    - id (UUID)
    - podcast (ForeignKey)
    - likes (int)
    - shares (int)
    - comments (int)
    - impressions (int)
    - timestamp (datetime)
    
    Requirements Addressed:
    - API Serialization: Implements serialization for engagement metrics data
    """
    
    class Meta:
        model = EngagementMetric
        fields = '__all__'


class PerformanceMetricSerializer(serializers.ModelSerializer):
    """
    A serializer for the PerformanceMetric model, converting it to and from JSON format.
    
    This serializer handles all fields from the PerformanceMetric model including:
    - id (UUID)
    - campaign (ForeignKey)
    - engagement_rate (float)
    - growth_rate (float)
    - timestamp (datetime)
    
    Requirements Addressed:
    - API Serialization: Implements serialization for performance metrics data
    """
    
    class Meta:
        model = PerformanceMetric
        fields = '__all__'