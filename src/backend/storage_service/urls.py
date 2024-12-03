"""
Storage Service URL Configuration

This module defines the URL routing for the storage_service Django app, mapping HTTP endpoints
to their corresponding views for handling file upload, retrieval, and deletion operations.

Requirements Addressed:
- API Design (8.3 API Design/8.3.2 Interface Specifications):
  Implements endpoints for file upload, retrieval, and deletion.

Human Tasks:
1. Verify URL patterns match API documentation and client expectations
2. Review URL naming conventions for consistency
3. Ensure rate limiting and security middleware are properly configured
"""

# django.urls v4.2
from django.urls import path

from .views import FileStorageView

# Define URL patterns for the storage service app
urlpatterns = [
    path(
        'files/',
        FileStorageView.as_view(),
        name='file-storage'
    ),
]