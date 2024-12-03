"""
ASGI Configuration Module

This module configures the ASGI application for the Django backend, enabling support for
WebSockets and other asynchronous protocols.

Requirements Addressed:
- Asynchronous Server Gateway Interface (ASGI) Configuration (7.3.1 Architecture Patterns):
  Provides the ASGI configuration for handling asynchronous requests, such as WebSockets,
  in the Django backend.

Human Tasks:
1. Verify ASGI server configuration in production environment
2. Configure appropriate worker count for ASGI server
3. Set up monitoring for WebSocket connections
4. Review logging configuration for ASGI server
"""

import os
from django.core.asgi import get_asgi_application  # django version 4.2

# Import settings from base module
from .settings.base import (
    BASE_DIR,
    DEBUG,
    ALLOWED_HOSTS
)

# Set the Django settings module based on environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.development' if DEBUG else 'core.settings.production')

# Initialize the ASGI application
application = get_asgi_application()