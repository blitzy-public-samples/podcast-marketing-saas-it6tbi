"""
Analytics Service Views

This module defines API views for handling analytics-related requests, including
engagement and performance metrics processing and retrieval.

Requirements Addressed:
- Analytics API Endpoints (8.3 API Design/Interface Specifications):
  Implements views to handle API requests for engagement and performance metrics.

Human Tasks:
1. Review API endpoint rate limits and throttling settings
2. Verify error response formats match API documentation
3. Confirm authentication and authorization settings for endpoints
"""

# External imports - versions specified in requirements
from rest_framework.views import APIView  # rest_framework version 3.14.0
from rest_framework.response import Response  # rest_framework version 3.14.0
from rest_framework import status  # rest_framework version 3.14.0

# Internal imports
from .models import EngagementMetric, PerformanceMetric
from .serializers import (
    EngagementMetricSerializer,
    PerformanceMetricSerializer
)
from .services import (
    process_engagement_metrics,
    process_performance_metrics
)


class EngagementMetricsView(APIView):
    """
    API view for handling engagement metrics requests.

    This view provides endpoints for retrieving and processing engagement metrics
    data, including likes, shares, comments, and impressions.

    Requirements Addressed:
    - Analytics API Endpoints: Implements engagement metrics API endpoints
    """

    def get(self, request):
        """
        Handles GET requests to retrieve engagement metrics.

        Returns:
            Response: A JSON response containing serialized engagement metrics.
                Success: HTTP 200 with metrics data
                Error: HTTP 500 with error details
        """
        try:
            # Query all engagement metrics
            metrics = EngagementMetric.objects.all()
            
            # Serialize the metrics data
            serializer = EngagementMetricSerializer(metrics, many=True)
            
            # Calculate engagement rates for each metric
            processed_metrics = []
            for metric in metrics:
                processed_metric = serializer.data
                processed_metric['engagement_rate'] = metric.calculate_rate()
                processed_metrics.append(processed_metric)
            
            return Response(
                processed_metrics,
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Handles POST requests to process engagement metrics.

        Returns:
            Response: A JSON response containing processed engagement metrics.
                Success: HTTP 201 with processed metrics
                Validation Error: HTTP 400 with error details
                Error: HTTP 500 with error details
        """
        try:
            # Validate incoming data
            serializer = EngagementMetricSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save the validated metrics data
            serializer.save()
            
            # Process the engagement metrics
            processed_data = process_engagement_metrics([request.data])
            
            return Response(
                processed_data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PerformanceMetricsView(APIView):
    """
    API view for handling performance metrics requests.

    This view provides endpoints for retrieving and processing performance metrics
    data, including engagement rates and growth rates.

    Requirements Addressed:
    - Analytics API Endpoints: Implements performance metrics API endpoints
    """

    def get(self, request):
        """
        Handles GET requests to retrieve performance metrics.

        Returns:
            Response: A JSON response containing serialized performance metrics.
                Success: HTTP 200 with metrics data
                Error: HTTP 500 with error details
        """
        try:
            # Query all performance metrics
            metrics = PerformanceMetric.objects.all()
            
            # Serialize the metrics data
            serializer = PerformanceMetricSerializer(metrics, many=True)
            
            # Generate insights for each metric
            processed_metrics = []
            for metric in metrics:
                processed_metric = serializer.data
                processed_metric['insights'] = metric.generate_insights()
                processed_metrics.append(processed_metric)
            
            return Response(
                processed_metrics,
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        """
        Handles POST requests to process performance metrics.

        Returns:
            Response: A JSON response containing processed performance metrics.
                Success: HTTP 201 with processed metrics
                Validation Error: HTTP 400 with error details
                Error: HTTP 500 with error details
        """
        try:
            # Validate incoming data
            serializer = PerformanceMetricSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save the validated metrics data
            serializer.save()
            
            # Convert request data to DataFrame for processing
            import pandas as pd
            metrics_df = pd.DataFrame([request.data])
            
            # Process the performance metrics
            processed_data = process_performance_metrics(metrics_df)
            
            return Response(
                processed_data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )