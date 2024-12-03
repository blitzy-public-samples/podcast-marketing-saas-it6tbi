"""
Celery Configuration Module

This module configures the Celery application for the Django backend, enabling
asynchronous task processing and distributed task execution.

Requirements Addressed:
- Asynchronous Task Processing (7.3.1 Architecture Patterns):
  Provides the Celery configuration for handling asynchronous tasks in the Django backend.

Human Tasks:
1. Configure Celery broker URL in environment variables
2. Configure Celery result backend in environment variables
3. Review Celery worker concurrency settings for production
4. Set up monitoring tools (e.g., Flower) for Celery tasks
5. Configure Celery beat schedule if periodic tasks are needed
"""

# Standard library imports
import os  # standard-library

# Third-party imports
from celery import Celery  # celery==5.3.0

# Internal imports
from core.settings.base import BASE_DIR, DEBUG, INSTALLED_APPS

def make_celery(app_name: str) -> Celery:
    """
    Initializes and configures the Celery application for the Django backend.
    
    Args:
        app_name (str): The name of the application to be used for the Celery instance.
        
    Returns:
        Celery: The configured Celery application instance.
    """
    # Create Celery instance with the provided app name
    celery_app = Celery(app_name)
    
    # Load Django settings module from environment variables
    # If not set, default to development settings
    settings_module = os.getenv('DJANGO_SETTINGS_MODULE', 'core.settings.development')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
    
    # Configure Celery using Django settings
    # namespace='CELERY' means all celery-related settings should be prefixed with CELERY_
    celery_app.config_from_object('django.conf:settings', namespace='CELERY')
    
    # Set additional Celery configuration based on environment
    celery_app.conf.update(
        broker_url=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
        result_backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0'),
        task_serializer='json',
        accept_content=['json'],
        result_serializer='json',
        timezone='UTC',
        enable_utc=True,
        task_track_started=True,
        task_time_limit=3600,  # 1 hour task time limit
        worker_prefetch_multiplier=1,  # Prevent worker from prefetching multiple tasks
        worker_max_tasks_per_child=1000,  # Restart worker after 1000 tasks
        worker_disable_rate_limits=True,
    )
    
    # Additional debug configurations
    if DEBUG:
        celery_app.conf.update(
            task_always_eager=True,  # Execute tasks synchronously in debug mode
            task_eager_propagates=True,  # Propagate exceptions in debug mode
        )
    
    # Auto-discover tasks from all installed Django apps
    # This will look for a 'tasks.py' file in each installed app
    celery_app.autodiscover_tasks(lambda: INSTALLED_APPS)
    
    return celery_app

# Initialize the Celery application
celery_app = make_celery('backend')

# This line is required for the Celery CLI to find the app instance
app = celery_app