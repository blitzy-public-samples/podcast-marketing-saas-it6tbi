"""
Analytics Service Test Views

This module contains unit tests for the analytics service API endpoints, ensuring
the correctness of engagement and performance metrics processing.

Requirements Addressed:
- Analytics API Testing (8.3 API Design/8.3.2 Interface Specifications):
  Implements comprehensive tests to validate the functionality of API endpoints
  for engagement and performance metrics.

Human Tasks:
1. Review test data to ensure it covers all edge cases
2. Verify that test assertions align with API documentation
3. Confirm that error scenarios are adequately tested
"""

# External imports - versions specified in requirements
from rest_framework.test import APITestCase  # rest_framework version 3.14.0
from rest_framework import status  # rest_framework version 3.14.0
from django.urls import reverse  # django version 4.2
from datetime import datetime, timezone

# Internal imports
from ..views import EngagementMetricsView, PerformanceMetricsView
from ..serializers import EngagementMetricSerializer, PerformanceMetricSerializer
from ..models import EngagementMetric, PerformanceMetric


class TestEngagementMetricsView(APITestCase):
    """
    Tests the EngagementMetricsView API endpoints for retrieving and processing
    engagement metrics.

    Requirements Addressed:
    - Analytics API Testing: Validates engagement metrics API functionality
    """

    def setUp(self):
        """
        Initializes test data for engagement metrics tests.
        """
        # Create test podcast
        self.podcast_data = {
            'title': 'Test Podcast',
            'description': 'Test Description'
        }
        
        # Create test engagement metrics
        self.engagement_metric = EngagementMetric.objects.create(
            podcast_id=1,  # Assuming podcast with ID 1 exists
            likes=100,
            shares=50,
            comments=25,
            impressions=1000
        )

        # Prepare test data for POST requests
        self.valid_payload = {
            'podcast_id': 1,
            'likes': 150,
            'shares': 75,
            'comments': 30,
            'impressions': 1500
        }

        self.invalid_payload = {
            'podcast_id': 1,
            'likes': -10,  # Invalid negative value
            'shares': 75,
            'comments': 30,
            'impressions': 1500
        }

    def test_get_engagement_metrics(self):
        """
        Tests the GET endpoint for retrieving engagement metrics.
        
        Requirements Addressed:
        - Analytics API Testing: Validates GET endpoint functionality
        """
        url = reverse('engagement-metrics')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
        
        if len(response.data) > 0:
            metric = response.data[0]
            self.assertIn('engagement_rate', metric)
            self.assertIn('likes', metric)
            self.assertIn('shares', metric)
            self.assertIn('comments', metric)
            self.assertIn('impressions', metric)

    def test_get_engagement_metrics_empty(self):
        """
        Tests the GET endpoint when no engagement metrics exist.
        
        Requirements Addressed:
        - Analytics API Testing: Validates empty response handling
        """
        # Clear all metrics
        EngagementMetric.objects.all().delete()
        
        url = reverse('engagement-metrics')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_post_engagement_metrics_valid(self):
        """
        Tests the POST endpoint with valid engagement metrics data.
        
        Requirements Addressed:
        - Analytics API Testing: Validates successful POST request handling
        """
        url = reverse('engagement-metrics')
        response = self.client.post(url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('engagement_rate', response.data[0])
        
        # Verify the metric was saved
        saved_metric = EngagementMetric.objects.filter(
            likes=self.valid_payload['likes']
        ).first()
        self.assertIsNotNone(saved_metric)
        self.assertEqual(saved_metric.shares, self.valid_payload['shares'])

    def test_post_engagement_metrics_invalid(self):
        """
        Tests the POST endpoint with invalid engagement metrics data.
        
        Requirements Addressed:
        - Analytics API Testing: Validates error handling for invalid data
        """
        url = reverse('engagement-metrics')
        response = self.client.post(url, self.invalid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('likes', response.data)

    def test_engagement_rate_calculation(self):
        """
        Tests that engagement rate is correctly calculated in the response.
        
        Requirements Addressed:
        - Analytics API Testing: Validates metric calculation accuracy
        """
        url = reverse('engagement-metrics')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if len(response.data) > 0:
            metric = response.data[0]
            expected_rate = self.engagement_metric.calculate_rate()
            self.assertAlmostEqual(float(metric['engagement_rate']), expected_rate)


class TestPerformanceMetricsView(APITestCase):
    """
    Tests the PerformanceMetricsView API endpoints for retrieving and processing
    performance metrics.

    Requirements Addressed:
    - Analytics API Testing: Validates performance metrics API functionality
    """

    def setUp(self):
        """
        Initializes test data for performance metrics tests.
        """
        # Create test campaign
        self.campaign_data = {
            'name': 'Test Campaign',
            'description': 'Test Description'
        }
        
        # Create test performance metrics
        self.performance_metric = PerformanceMetric.objects.create(
            campaign_id=1,  # Assuming campaign with ID 1 exists
            engagement_rate=5.5,
            growth_rate=2.3
        )

        # Prepare test data for POST requests
        self.valid_payload = {
            'campaign_id': 1,
            'engagement_rate': 6.7,
            'growth_rate': 3.2,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }

        self.invalid_payload = {
            'campaign_id': 1,
            'engagement_rate': -5.0,  # Invalid negative rate
            'growth_rate': 3.2
        }

    def test_get_performance_metrics(self):
        """
        Tests the GET endpoint for retrieving performance metrics.
        
        Requirements Addressed:
        - Analytics API Testing: Validates GET endpoint functionality
        """
        url = reverse('performance-metrics')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
        
        if len(response.data) > 0:
            metric = response.data[0]
            self.assertIn('insights', metric)
            self.assertIn('engagement_rate', metric)
            self.assertIn('growth_rate', metric)

    def test_get_performance_metrics_empty(self):
        """
        Tests the GET endpoint when no performance metrics exist.
        
        Requirements Addressed:
        - Analytics API Testing: Validates empty response handling
        """
        # Clear all metrics
        PerformanceMetric.objects.all().delete()
        
        url = reverse('performance-metrics')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_post_performance_metrics_valid(self):
        """
        Tests the POST endpoint with valid performance metrics data.
        
        Requirements Addressed:
        - Analytics API Testing: Validates successful POST request handling
        """
        url = reverse('performance-metrics')
        response = self.client.post(url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('insights', response.data)
        
        # Verify the metric was saved
        saved_metric = PerformanceMetric.objects.filter(
            engagement_rate=self.valid_payload['engagement_rate']
        ).first()
        self.assertIsNotNone(saved_metric)
        self.assertEqual(
            saved_metric.growth_rate,
            self.valid_payload['growth_rate']
        )

    def test_post_performance_metrics_invalid(self):
        """
        Tests the POST endpoint with invalid performance metrics data.
        
        Requirements Addressed:
        - Analytics API Testing: Validates error handling for invalid data
        """
        url = reverse('performance-metrics')
        response = self.client.post(url, self.invalid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('engagement_rate', response.data)

    def test_performance_insights_generation(self):
        """
        Tests that performance insights are correctly generated in the response.
        
        Requirements Addressed:
        - Analytics API Testing: Validates insight generation functionality
        """
        url = reverse('performance-metrics')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if len(response.data) > 0:
            metric = response.data[0]
            insights = metric['insights']
            self.assertIsNotNone(insights)
            self.assertEqual(
                insights,
                self.performance_metric.generate_insights()
            )