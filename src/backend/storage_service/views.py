"""
Storage Service Views Module

This module defines the views for the storage service, handling HTTP requests for file 
upload, retrieval, and deletion.

Requirements Addressed:
- API Design (8.3 API Design/8.3.2 Interface Specifications):
  Implements endpoints for file upload, retrieval, and deletion.
- Storage Solutions (7.2 Component Details/Data Storage Components):
  Provides cloud-based distributed storage for audio files and transcripts.

Human Tasks:
1. Configure AWS credentials and region in environment variables
2. Verify S3 bucket permissions and CORS settings
3. Set up CloudFront distribution and configure key pairs
4. Review API rate limits and request size configurations
"""

# rest_framework v3.14
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import os
from typing import Optional

from .models import FileStorage
from .serializers import FileStorageSerializer
from .services import upload_file, delete_file, get_signed_url
from src.backend.common.exceptions import ValidationError

class FileStorageView(APIView):
    """
    Handles HTTP requests for file upload, retrieval, and deletion.
    
    This view provides endpoints for:
    - Uploading files to AWS S3
    - Retrieving file metadata and signed URLs
    - Deleting files from storage
    """

    def post(self, request):
        """
        Handles file upload requests.

        Args:
            request: HTTP request containing the file and metadata

        Returns:
            Response: JSON response with upload status and file metadata

        Requirements Addressed:
        - API Design (8.3.2): Implements secure file upload endpoint
        """
        try:
            # Validate request data
            file_obj = request.FILES.get('file')
            if not file_obj:
                return Response(
                    {'error': 'No file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create temporary file path
            temp_path = f"/tmp/{file_obj.name}"
            with open(temp_path, 'wb+') as temp_file:
                for chunk in file_obj.chunks():
                    temp_file.write(chunk)

            # Prepare serializer data
            serializer_data = {
                'file_name': file_obj.name,
                'file_size': file_obj.size,
                'file_format': os.path.splitext(file_obj.name)[1]
            }

            # Validate file metadata
            serializer = FileStorageSerializer(data=serializer_data)
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Upload file to S3
            bucket_name = os.environ.get('AWS_STORAGE_BUCKET_NAME')
            object_name = f"uploads/{file_obj.name}"
            s3_url = upload_file(temp_path, bucket_name, object_name)

            # Clean up temporary file
            os.remove(temp_path)

            # Return success response with file metadata
            return Response(
                {
                    'message': 'File uploaded successfully',
                    'file_url': s3_url,
                    'metadata': serializer.validated_data
                },
                status=status.HTTP_201_CREATED
            )

        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Upload failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        """
        Handles requests to retrieve file metadata or signed URL.

        Args:
            request: HTTP request containing file identifier

        Returns:
            Response: JSON response with file metadata and signed URL

        Requirements Addressed:
        - API Design (8.3.2): Implements secure file retrieval endpoint
        """
        try:
            file_id = request.query_params.get('file_id')
            if not file_id:
                return Response(
                    {'error': 'File ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Retrieve file metadata
            file_storage = FileStorage.objects.filter(id=file_id).first()
            if not file_storage:
                return Response(
                    {'error': 'File not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Generate signed URL
            distribution_domain = os.environ.get('CLOUDFRONT_DOMAIN')
            object_path = file_storage.s3_url.split('amazonaws.com/')[-1]
            expiration_time = 3600  # 1 hour

            signed_url = get_signed_url(
                distribution_domain,
                object_path,
                expiration_time
            )

            # Serialize and return response
            serializer = FileStorageSerializer(file_storage)
            return Response(
                {
                    'metadata': serializer.data,
                    'signed_url': signed_url,
                    'expiration': expiration_time
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': f'Retrieval failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request):
        """
        Handles file deletion requests.

        Args:
            request: HTTP request containing file identifier

        Returns:
            Response: JSON response indicating deletion status

        Requirements Addressed:
        - API Design (8.3.2): Implements secure file deletion endpoint
        """
        try:
            file_id = request.query_params.get('file_id')
            if not file_id:
                return Response(
                    {'error': 'File ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Retrieve file metadata
            file_storage = FileStorage.objects.filter(id=file_id).first()
            if not file_storage:
                return Response(
                    {'error': 'File not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Extract bucket and object names from S3 URL
            s3_url_parts = file_storage.s3_url.split('amazonaws.com/')
            bucket_name = s3_url_parts[0].split('//')[1].split('.')[0]
            object_name = s3_url_parts[1]

            # Delete file from S3 and database
            if delete_file(bucket_name, object_name):
                return Response(
                    {'message': 'File deleted successfully'},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Failed to delete file'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            return Response(
                {'error': f'Deletion failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )