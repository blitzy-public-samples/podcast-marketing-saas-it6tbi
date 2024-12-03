"""
Authentication Service URL Configuration

This module defines the URL routing for the authentication service, mapping endpoints
to their corresponding views for user authentication, registration, and management.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Provides endpoints for user authentication, registration, and role-based access control.

Human Tasks:
1. Review URL patterns to ensure they align with API documentation
2. Configure rate limiting for authentication endpoints
3. Set up monitoring for endpoint usage and response times
4. Verify CORS settings for the authentication endpoints
"""

# Third-party imports
from django.urls import path  # version 4.2+

# Internal imports
from .views import (
    register_user,
    login_user,
    UserManagementView
)

# URL patterns for the authentication service
urlpatterns = [
    # User registration endpoint
    # POST /auth/register/
    path(
        'register/',
        register_user,
        name='user-registration'
    ),
    
    # User login endpoint
    # POST /auth/login/
    path(
        'login/',
        login_user,
        name='user-login'
    ),
    
    # User management endpoints
    # GET /auth/user/ - Retrieve user details
    # PUT /auth/user/ - Update user details
    path(
        'user/',
        UserManagementView.as_view(),
        name='user-management'
    ),
]