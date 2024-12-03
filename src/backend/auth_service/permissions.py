"""
Authentication Service Permissions

This module defines custom permission classes for role-based access control,
ensuring that only authorized users can access specific resources.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Implements role-based access control to ensure secure and appropriate access to resources.

Human Tasks:
1. Review permission class configurations in Django settings.py
2. Verify integration with authentication middleware
3. Test permission classes with different user roles
"""

# Django REST Framework imports - version 3.14+
from rest_framework.permissions import BasePermission

# Internal imports
from src.backend.auth_service.models import User
from src.backend.common.exceptions import ValidationError


class IsAdminUser(BasePermission):
    """
    Permission class that grants access only to admin users.
    
    This class checks if the requesting user has admin privileges by verifying
    their role attribute. Only users with the 'admin' role are granted access.
    """
    
    def has_permission(self, request, view) -> bool:
        """
        Checks if the requesting user has admin privileges.
        
        Args:
            request: The HTTP request object containing the user
            view: The view being accessed
            
        Returns:
            bool: True if the user is an admin, False otherwise
            
        Raises:
            ValidationError: If user authentication is invalid
        """
        # Ensure user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
            
        try:
            # Check if the user's role is 'admin'
            return request.user.role == 'admin'
        except AttributeError:
            raise ValidationError(message="User role information is missing or invalid")


class IsAuthenticatedUser(BasePermission):
    """
    Permission class that grants access only to authenticated users.
    
    This class verifies that the requesting user is properly authenticated
    before granting access to protected resources.
    """
    
    def has_permission(self, request, view) -> bool:
        """
        Checks if the requesting user is authenticated.
        
        Args:
            request: The HTTP request object containing the user
            view: The view being accessed
            
        Returns:
            bool: True if the user is authenticated, False otherwise
            
        Raises:
            ValidationError: If user authentication is invalid
        """
        try:
            # Check if user exists and is authenticated
            return bool(request.user and request.user.is_authenticated)
        except AttributeError:
            raise ValidationError(message="User authentication information is missing or invalid")