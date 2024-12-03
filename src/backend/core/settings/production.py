"""
Django Production Settings Module

This module contains production-specific settings for the Django backend application,
optimizing for security, performance, and scalability in a production environment.

Requirements Addressed:
- Production Environment Configuration (7.3.1 Architecture Patterns):
  Provides production-specific settings to ensure the application is secure,
  performant, and scalable.

Human Tasks:
1. Set up environment variables for all sensitive configuration values:
   - SECRET_KEY: Django's cryptographic signing key
   - ALLOWED_HOSTS: Comma-separated list of allowed host domains
   - DB_NAME: PostgreSQL database name
   - DB_USER: PostgreSQL database user
   - DB_PASSWORD: PostgreSQL database password
   - DB_HOST: PostgreSQL database host
   - DB_PORT: PostgreSQL database port
2. Configure SSL certificate for HTTPS
3. Set up static files serving with a CDN or web server
4. Configure PostgreSQL database with appropriate credentials
5. Verify HSTS settings with security team
"""

# Standard library imports
import os  # standard-library
import logging  # standard-library

# Internal imports
from ..settings.base import BASE_DIR
from backend.common.logging import configure_logging
from backend.common.constants import CACHE_TTL_SECONDS

# Security settings
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Define allowed hosts from environment variable
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Database configuration
# https://docs.djangoproject.com/en/stable/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/stable/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Security settings for production
# Enforce HTTPS
SECURE_SSL_REDIRECT = True

# Secure cookie settings
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# HTTP Strict Transport Security settings
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

def configure_production_settings():
    """
    Configures production-specific settings for the Django application.
    
    This function initializes all production-specific settings and ensures
    proper security configurations are in place.
    """
    # Set up production logging configuration
    configure_logging()
    
    # Get logger for this module
    logger = logging.getLogger(__name__)
    
    # Log production configuration details
    logger.info("Configuring production settings")
    logger.info(f"ALLOWED_HOSTS: {ALLOWED_HOSTS}")
    logger.info(f"STATIC_ROOT: {STATIC_ROOT}")
    logger.info("SSL redirect is enabled")
    logger.info("Secure cookies are enabled")
    logger.info(f"HSTS is enabled with {SECURE_HSTS_SECONDS} seconds duration")
    
    # Verify critical settings
    if not SECRET_KEY:
        raise ValueError("Production SECRET_KEY must be set in environment variables")
    
    if not ALLOWED_HOSTS or ALLOWED_HOSTS == ['']:
        raise ValueError("Production ALLOWED_HOSTS must be configured")
    
    # Log successful configuration
    logger.info("Production settings configured successfully")

# Initialize production settings
configure_production_settings()