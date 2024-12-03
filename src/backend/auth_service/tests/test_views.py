"""
Authentication Service View Tests

This module contains unit tests for the authentication service views, ensuring that
endpoints for user registration, login, and management function correctly.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Validates the functionality of user-related endpoints, including registration,
  login, and role-based access control.

Human Tasks:
1. Configure test database settings in Django settings.py
2. Set up test data fixtures if needed
3. Review test coverage requirements
4. Configure CI/CD pipeline test stages
"""

# Third-party imports
from rest_framework.test import APITestCase  # version 3.14+
from rest_framework import status  # version 3.14+
from django.urls import reverse  # version 4.2+

# Internal imports
from ..views import register_user, login_user, UserManagementView
from ..serializers import UserSerializer
from ..services import create_user, authenticate_user
from ..permissions import IsAuthenticatedUser, IsAdminUser


class AuthenticationViewTests(APITestCase):
    """Test suite for authentication-related views."""

    def setUp(self):
        """Set up test data before each test method."""
        self.valid_user_data = {
            'email': 'test@example.com',
            'password': 'TestPassword123!'
        }
        
        # Create a test user for login tests
        self.test_user = create_user(self.valid_user_data)
        
        # URLs for testing
        self.register_url = reverse('register_user')
        self.login_url = reverse('login_user')
        self.user_management_url = reverse('user_management')

    def test_register_user(self):
        """
        Tests the user registration endpoint to ensure it creates a new user
        with valid data.
        
        Requirements Addressed:
        - User Management (1.3): Validates user registration functionality
        """
        # Test with valid data
        response = self.client.post(
            self.register_url,
            {
                'email': 'newuser@example.com',
                'password': 'NewUserPass123!'
            },
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'newuser@example.com')
        
        # Test with invalid email
        response = self.client.post(
            self.register_url,
            {
                'email': 'invalid-email',
                'password': 'TestPass123!'
            },
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test with missing password
        response = self.client.post(
            self.register_url,
            {'email': 'test@example.com'},
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user(self):
        """
        Tests the user login endpoint to ensure it authenticates users with
        valid credentials.
        
        Requirements Addressed:
        - User Management (1.3): Validates user authentication functionality
        """
        # Test with valid credentials
        response = self.client.post(
            self.login_url,
            self.valid_user_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        
        # Test with invalid password
        response = self.client.post(
            self.login_url,
            {
                'email': self.valid_user_data['email'],
                'password': 'WrongPassword123!'
            },
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test with non-existent user
        response = self.client.post(
            self.login_url,
            {
                'email': 'nonexistent@example.com',
                'password': 'TestPass123!'
            },
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_management_view_get(self):
        """
        Tests the GET method of the UserManagementView to ensure it retrieves
        the authenticated user's details.
        
        Requirements Addressed:
        - User Management (1.3): Validates user profile retrieval functionality
        """
        # Authenticate the test user
        self.client.force_authenticate(user=self.test_user)
        
        # Test retrieving user details
        response = self.client.get(self.user_management_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], self.test_user.email)
        
        # Test without authentication
        self.client.force_authenticate(user=None)
        response = self.client.get(self.user_management_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_management_view_put(self):
        """
        Tests the PUT method of the UserManagementView to ensure it updates
        the authenticated user's details.
        
        Requirements Addressed:
        - User Management (1.3): Validates user profile update functionality
        """
        # Authenticate the test user
        self.client.force_authenticate(user=self.test_user)
        
        # Test updating user details
        update_data = {
            'email': 'updated@example.com',
            'password': 'UpdatedPass123!'
        }
        
        response = self.client.put(
            self.user_management_url,
            update_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], update_data['email'])
        
        # Test with invalid email format
        response = self.client.put(
            self.user_management_url,
            {'email': 'invalid-email'},
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test without authentication
        self.client.force_authenticate(user=None)
        response = self.client.put(
            self.user_management_url,
            update_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)