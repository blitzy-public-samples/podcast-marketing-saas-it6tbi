"""
Django Settings Module Initializer

This module initializes and manages environment-specific settings for the Django backend
application by dynamically loading the appropriate settings based on the environment.

Requirements Addressed:
- Backend Configuration Management (7.3.1 Architecture Patterns):
  Provides a centralized configuration for the backend, ensuring consistency and
  maintainability across environments.

Human Tasks:
1. Set up appropriate ENVIRONMENT variable in deployment configurations
2. Verify environment-specific settings files exist for all target environments
3. Review environment variable configurations in deployment pipelines
"""

# Standard library imports
import os  # standard-library
import importlib
import sys
from typing import Optional

# Internal imports
from .base import (
    BASE_DIR,
    SECRET_KEY,
    DEBUG,
    ALLOWED_HOSTS,
    DATABASES,
    INSTALLED_APPS,
    MIDDLEWARE,
)
from backend.common.logging import configure_logging

# Define the environment variable with a default value of 'development'
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

def load_settings() -> None:
    """
    Dynamically loads the appropriate settings module based on the ENVIRONMENT variable.
    
    This function performs the following steps:
    1. Validates the environment setting
    2. Imports the environment-specific settings module
    3. Updates the global settings with environment-specific configurations
    4. Configures logging for the application
    
    The function modifies the global settings object to include environment-specific
    configurations, ensuring the correct settings are used for each environment.
    """
    # Define valid environments
    valid_environments = {'development', 'production', 'test'}
    
    if ENVIRONMENT not in valid_environments:
        raise ValueError(
            f"Invalid ENVIRONMENT setting: {ENVIRONMENT}. "
            f"Must be one of: {', '.join(valid_environments)}"
        )
    
    try:
        # Import the environment-specific settings module
        settings_module = f"backend.core.settings.{ENVIRONMENT}"
        env_settings = importlib.import_module(settings_module)
        
        # Get the current module
        current_module = sys.modules[__name__]
        
        # Update the current module's dictionary with environment-specific settings
        for setting in dir(env_settings):
            if setting.isupper():  # Only copy uppercase settings
                setattr(current_module, setting, getattr(env_settings, setting))
        
        # Configure logging after all settings are loaded
        configure_logging()
        
    except ImportError as e:
        raise ImportError(
            f"Failed to import settings for environment '{ENVIRONMENT}'. "
            f"Ensure that {settings_module}.py exists and is properly configured. "
            f"Error: {str(e)}"
        )
    except Exception as e:
        raise RuntimeError(
            f"Failed to load settings for environment '{ENVIRONMENT}'. "
            f"Error: {str(e)}"
        )

# Load environment-specific settings when the module is imported
load_settings()