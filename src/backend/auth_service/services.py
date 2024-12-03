"""
Authentication Service Core Business Logic

This module implements the core business logic for user authentication, creation,
and role management. It provides a structured and secure authentication workflow
that integrates with the application's user management system.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Implements role-based access control, user authentication, and user creation workflows.

Human Tasks:
1. Review password validation rules to ensure they meet security requirements
2. Configure email verification settings if required
3. Set up monitoring for failed authentication attempts
4. Review role permissions alignment with business requirements
"""

# Third-party imports
from django.contrib.auth import authenticate  # version 4.2+
from rest_framework import serializers  # version 3.14+

# Internal imports
from .models import User
from .serializers import UserSerializer
from ..common.exceptions import ValidationError
from ..common.utils import process_audio_file

# Constants for role validation
VALID_ROLES = {'admin', 'creator', 'editor', 'viewer'}

def create_user(user_data: dict) -> User:
    """
    Creates a new user with the provided data, including email and password.
    
    Args:
        user_data (dict): Dictionary containing user information including:
            - email: User's email address
            - password: User's password
            - Additional optional fields
            
    Returns:
        User: The created User instance
        
    Raises:
        ValidationError: If the user data is invalid or email already exists
        
    Requirements Addressed:
    - User Management (1.3): Supports user creation with secure password handling
    """
    try:
        # Validate user data using serializer
        serializer = UserSerializer(data=user_data)
        if not serializer.is_valid():
            raise ValidationError(message=str(serializer.errors))
        
        # Create user instance
        user = serializer.create(serializer.validated_data)
        
        # Set password securely
        if not user.set_password(user_data.get('password')):
            raise ValidationError(message="Failed to set user password")
        
        return user
        
    except serializers.ValidationError as e:
        raise ValidationError(message=str(e))
    except Exception as e:
        raise ValidationError(message=f"Error creating user: {str(e)}")

def authenticate_user(email: str, password: str) -> User:
    """
    Authenticates a user using their email and password.
    
    Args:
        email (str): User's email address
        password (str): User's password
        
    Returns:
        User: The authenticated User instance
        
    Raises:
        ValidationError: If authentication fails or credentials are invalid
        
    Requirements Addressed:
    - User Management (1.3): Implements secure user authentication
    """
    try:
        if not email or not password:
            raise ValidationError(message="Email and password are required")
        
        # Authenticate using Django's authentication system
        user = authenticate(username=email, password=password)
        
        if not user:
            raise ValidationError(message="Invalid email or password")
        
        # Verify the user's password
        if not user.check_password(password):
            raise ValidationError(message="Invalid password")
        
        # Ensure user account is active
        if not user.is_active:
            raise ValidationError(message="User account is inactive")
        
        return user
        
    except ValidationError:
        raise
    except Exception as e:
        raise ValidationError(message=f"Authentication error: {str(e)}")

def update_user_role(user_instance: User, new_role: str) -> bool:
    """
    Updates the role of an existing user.
    
    Args:
        user_instance (User): The user instance to update
        new_role (str): The new role to assign to the user
        
    Returns:
        bool: True if the role is successfully updated
        
    Raises:
        ValidationError: If the role is invalid or update fails
        
    Requirements Addressed:
    - User Management (1.3): Supports role-based access control
    """
    try:
        # Validate the new role
        if not new_role or new_role not in VALID_ROLES:
            raise ValidationError(
                message=f"Invalid role. Must be one of: {', '.join(VALID_ROLES)}"
            )
        
        # Check if role is different
        if user_instance.role == new_role:
            return True
        
        # Update user's role
        user_instance.role = new_role
        user_instance.save(update_fields=['role'])
        
        return True
        
    except ValidationError:
        raise
    except Exception as e:
        raise ValidationError(message=f"Error updating user role: {str(e)}")