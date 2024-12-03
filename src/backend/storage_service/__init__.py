"""
Storage Service Package Initialization

This module initializes the storage_service package and exposes key functionalities
for external use, including models, serializers, services, and views.

Requirements Addressed:
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Provides cloud-based distributed storage for audio files and transcripts.
- API Design (8.3 API Design/8.3.2 Interface Specifications):
  Implements endpoints for file upload, retrieval, and deletion.
"""

# Import models
from .models import FileStorage

# Import serializers
from .serializers import FileStorageSerializer

# Import services
from .services import (
    upload_file,
    delete_file,
    get_signed_url
)

# Import views
from .views import FileStorageView

# Define package exports
__all__ = [
    # Models
    'FileStorage',
    
    # Serializers
    'FileStorageSerializer',
    
    # Services
    'upload_file',
    'delete_file',
    'get_signed_url',
    
    # Views
    'FileStorageView'
]

# Package metadata
__version__ = '1.0.0'
__author__ = 'Podcast Automation Team'
__description__ = 'Storage service for handling file uploads and management in AWS S3'