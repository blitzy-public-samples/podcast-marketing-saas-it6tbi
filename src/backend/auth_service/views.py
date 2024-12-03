"""
Authentication Service Views

This module defines the views for the authentication service, handling user-related operations
such as login, registration, and role management.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Implements endpoints for user authentication, registration, and role-based access control.

Human Tasks:
1. Configure rate limiting for authentication endpoints
2. Set up monitoring for failed login attempts
3. Review error message templates for security compliance
4. Configure CORS settings for the authentication endpoints
"""

# Third-party imports
from rest_framework.views import APIView  # version 3.14+
from rest_framework.response import Response  # version 3.14+
from rest_framework import status  # version 3.14+
from rest_framework.decorators import api_view

# Internal imports
from .serializers import UserSerializer
from .services import create_user, authenticate_user
from .permissions import IsAuthenticatedUser, IsAdminUser
from ..common.exceptions import ValidationError


@api_view(['POST'])
def register_user(request):
    """
    Handles user registration by validating input data and creating a new user.
    
    Args:
        request: HTTP request containing user registration data
        
    Returns:
        Response: JSON response with user data or error messages
        
    Requirements Addressed:
    - User Management (1.3): Implements secure user registration
    """
    try:
        # Extract user data from request
        user_data = request.data
        
        # Create new user using service
        user = create_user(user_data)
        
        # Serialize user data for response
        serializer = UserSerializer(user)
        
        return Response(
            {
                'message': 'User registered successfully',
                'user': serializer.data
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
            {'error': 'Registration failed. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def login_user(request):
    """
    Handles user login by authenticating credentials and returning a token.
    
    Args:
        request: HTTP request containing login credentials
        
    Returns:
        Response: JSON response with authentication token or error messages
        
    Requirements Addressed:
    - User Management (1.3): Implements secure user authentication
    """
    try:
        # Extract credentials from request
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            raise ValidationError('Email and password are required')
            
        # Authenticate user
        user = authenticate_user(email, password)
        
        # Serialize user data
        serializer = UserSerializer(user)
        
        # Note: Token generation would be implemented here
        # This is a placeholder for the actual token generation logic
        
        return Response(
            {
                'message': 'Login successful',
                'user': serializer.data,
                'token': 'placeholder_token'  # Replace with actual token
            },
            status=status.HTTP_200_OK
        )
        
    except ValidationError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        return Response(
            {'error': 'Login failed. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class UserManagementView(APIView):
    """
    View class for managing user operations such as retrieving and updating user details.
    
    Requirements Addressed:
    - User Management (1.3): Implements user profile management endpoints
    """
    
    permission_classes = [IsAuthenticatedUser]
    
    def get(self, request):
        """
        Retrieves the details of the authenticated user.
        
        Args:
            request: HTTP request from authenticated user
            
        Returns:
            Response: JSON response with user details
        """
        try:
            # Serialize authenticated user's data
            serializer = UserSerializer(request.user)
            
            return Response(
                {
                    'user': serializer.data
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': 'Failed to retrieve user details.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """
        Updates the details of the authenticated user.
        
        Args:
            request: HTTP request containing updated user data
            
        Returns:
            Response: JSON response with updated user details
        """
        try:
            # Update user data using serializer
            serializer = UserSerializer(
                request.user,
                data=request.data,
                partial=True
            )
            
            if not serializer.is_valid():
                return Response(
                    {'error': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Save updated user data
            updated_user = serializer.update(
                request.user,
                serializer.validated_data
            )
            
            # Serialize updated data for response
            response_serializer = UserSerializer(updated_user)
            
            return Response(
                {
                    'message': 'User details updated successfully',
                    'user': response_serializer.data
                },
                status=status.HTTP_200_OK
            )
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'Failed to update user details.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )