"""
Django Base Settings Module

This module contains the base settings for the Django backend application, serving as the
foundation for environment-specific settings (development, production, testing).

Requirements Addressed:
- Backend Configuration Management (7.3.1 Architecture Patterns):
  Provides a centralized configuration for the backend, ensuring consistency and
  maintainability across environments.

Human Tasks:
1. Review and update SECRET_KEY in production environment
2. Configure appropriate ALLOWED_HOSTS for each environment
3. Review database configuration for production deployment
4. Set up static files hosting configuration for production
5. Configure environment-specific logging levels
"""

# Standard library imports
import os  # standard-library
import logging  # standard-library

# Internal imports
from backend.common.logging import configure_logging
from backend.common.constants import (
    SUPPORTED_AUDIO_FORMATS,
    CACHE_TTL_SECONDS,
)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Define allowed hosts from environment variable
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# File upload settings
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]

# Configure supported file formats
ALLOWED_AUDIO_FORMATS = SUPPORTED_AUDIO_FORMATS

# Cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': CACHE_TTL_SECONDS,
    }
}

def configure_settings():
    """
    Configures the base settings for the Django application.
    
    This function initializes core settings and sets up logging configuration.
    It should be called during application startup.
    """
    # Configure logging using the centralized logging configuration
    configure_logging()
    
    # Log the current configuration state
    logger = logging.getLogger(__name__)
    logger.info(f"Django settings configured with DEBUG={DEBUG}")
    logger.info(f"Allowed hosts: {ALLOWED_HOSTS}")
    logger.info(f"Supported audio formats: {ALLOWED_AUDIO_FORMATS}")
    logger.info(f"Cache TTL: {CACHE_TTL_SECONDS} seconds")