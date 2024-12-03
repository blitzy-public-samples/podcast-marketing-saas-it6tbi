"""
Analytics Service Tasks Module

This module defines Celery tasks for asynchronous processing of analytics data,
including engagement and performance metrics.

Requirements Addressed:
- Asynchronous Analytics Processing (7.2 Component Details/Analytics Service):
  Implements background tasks for processing engagement and performance metrics
  asynchronously using Celery.

Human Tasks:
1. Review Celery worker configuration to ensure adequate resources for metric processing
2. Verify that task retry settings align with infrastructure capabilities
3. Confirm task queue priorities match business requirements
"""

# Internal imports
from ..core.celery import celery_app
from .services import process_engagement_metrics, process_performance_metrics

# External imports
import pandas as pd  # pandas==2.0.3
from celery import Task  # celery==5.3.0


class AnalyticsTask(Task):
    """
    Base task class for analytics processing tasks.
    
    This class provides common error handling and retry logic for analytics tasks.
    """
    
    # Maximum number of retries for failed tasks
    max_retries = 3
    
    # Delay between retries (in seconds), using exponential backoff
    default_retry_delay = 60
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        Handler for task failures.
        
        Args:
            exc: The exception raised
            task_id: The ID of the failed task
            args: Positional arguments passed to the task
            kwargs: Keyword arguments passed to the task
            einfo: Exception info
        """
        # Log the failure with detailed information
        self.logger.error(
            "Analytics task %s failed: %s",
            task_id,
            str(exc),
            exc_info=einfo
        )
        super().on_failure(exc, task_id, args, kwargs, einfo)


@celery_app.task(
    base=AnalyticsTask,
    bind=True,
    name='analytics.process_engagement_metrics',
    queue='analytics'
)
def process_engagement_metrics_task(self, engagement_data: list) -> dict:
    """
    Celery task for processing engagement metrics asynchronously.
    
    This task processes engagement metrics data to calculate rates and analyze trends.
    
    Args:
        engagement_data (list): List of engagement metrics data entries
            Each entry should be a dictionary containing:
            - likes (int)
            - shares (int)
            - comments (int)
            - impressions (int)
            - timestamp (datetime)
    
    Returns:
        dict: A dictionary containing:
            - processed_metrics: List of calculated engagement rates
            - trends: Engagement trend analysis results
            - summary: Statistical summary of engagement data
    
    Requirements Addressed:
    - Asynchronous Analytics Processing: Implements asynchronous processing of
      engagement metrics using Celery tasks
    """
    try:
        # Process the engagement metrics using the service function
        result = process_engagement_metrics(engagement_data)
        
        # Log successful processing
        self.logger.info(
            "Successfully processed engagement metrics for %d entries",
            len(engagement_data)
        )
        
        return result
        
    except ValueError as e:
        # Handle validation errors
        self.logger.error("Validation error in engagement metrics: %s", str(e))
        raise self.retry(exc=e)
        
    except Exception as e:
        # Handle unexpected errors
        self.logger.error(
            "Unexpected error processing engagement metrics: %s",
            str(e),
            exc_info=True
        )
        raise self.retry(exc=e)


@celery_app.task(
    base=AnalyticsTask,
    bind=True,
    name='analytics.process_performance_metrics',
    queue='analytics'
)
def process_performance_metrics_task(self, performance_data: pd.DataFrame) -> dict:
    """
    Celery task for processing performance metrics asynchronously.
    
    This task processes performance metrics data to generate insights and analyze trends.
    
    Args:
        performance_data (pd.DataFrame): DataFrame containing performance metrics
            Required columns:
            - metric_value (float)
            - metric_type (str)
            - timestamp (datetime)
    
    Returns:
        dict: A dictionary containing:
            - aggregated_metrics: Aggregated performance metrics
            - insights: Generated performance insights
            - anomalies: Detected anomalies in performance
            - recommendations: Suggested actions based on analysis
    
    Requirements Addressed:
    - Asynchronous Analytics Processing: Implements asynchronous processing of
      performance metrics using Celery tasks
    """
    try:
        # Process the performance metrics using the service function
        result = process_performance_metrics(performance_data)
        
        # Log successful processing
        self.logger.info(
            "Successfully processed performance metrics for %d entries",
            len(performance_data)
        )
        
        return result
        
    except ValueError as e:
        # Handle validation errors
        self.logger.error("Validation error in performance metrics: %s", str(e))
        raise self.retry(exc=e)
        
    except Exception as e:
        # Handle unexpected errors
        self.logger.error(
            "Unexpected error processing performance metrics: %s",
            str(e),
            exc_info=True
        )
        raise self.retry(exc=e)