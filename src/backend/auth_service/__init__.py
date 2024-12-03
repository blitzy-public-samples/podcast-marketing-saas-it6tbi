"""
Authentication Service Module Initialization

This module initializes the authentication service by exposing key components such as models,
serializers, services, permissions, and views for external use.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Provides a structured and secure authentication workflow, including user creation,
  authentication, and role-based access control.

Human Tasks:
1. Review imported components to ensure they align with security requirements
2. Verify that all required authentication components are properly exposed
3. Check for any potential circular dependencies in imports
"""

# Import models
from .models import User

# Import serializers
from .serializers import UserSerializer

# Import services
from .services import (
    create_user,
    authenticate_user
)

# Import permissions
from .permissions import (
    IsAdminUser,
    IsAuthenticatedUser
)

# Import views
from .views import (
    register_user,
    login_user
)

# Define package version
__version__ = '1.0.0'

# Define exported components
__all__ = [
    # Models
    'User',
    
    # Serializers
    'UserSerializer',
    
    # Services
    'create_user',
    'authenticate_user',
    
    # Permissions
    'IsAdminUser',
    'IsAuthenticatedUser',
    
    # Views
    'register_user',
    'login_user'
]