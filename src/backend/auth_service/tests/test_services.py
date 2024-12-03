"""
Authentication Service Unit Tests

This module contains unit tests for the core authentication service functionality,
ensuring that user creation, authentication, and role management work as expected.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Validates the correctness of user creation, authentication, and role-based access
  control workflows.

Human Tasks:
1. Review test coverage to ensure all critical paths are tested
2. Verify that test data matches expected production scenarios
3. Configure test database settings if needed
4. Set up CI/CD pipeline integration for automated testing
"""

# Third-party imports
from django.test import TestCase  # version 4.2+
from unittest.mock import patch, Mock  # version 3.11+

# Internal imports
from ..services import create_user, authenticate_user, update_user_role
from ..models import User
from ..serializers import UserSerializer
from ...common.exceptions import ValidationError

class AuthServiceTests(TestCase):
    """Test suite for authentication service functionality."""

    def setUp(self):
        """Set up test data before each test case."""
        self.valid_user_data = {
            'email': 'test@example.com',
            'password': 'SecurePass123!'
        }
        self.test_user = User.objects.create_user(
            email=self.valid_user_data['email'],
            password=self.valid_user_data['password']
        )

    def test_create_user(self):
        """
        Tests the create_user function to ensure it creates a user with valid data.
        
        Requirements Addressed:
        - User Management (1.3): Validates user creation workflow
        """
        # Test successful user creation
        with patch.object(UserSerializer, 'create') as mock_create:
            mock_create.return_value = self.test_user
            
            user = create_user(self.valid_user_data)
            
            self.assertIsInstance(user, User)
            self.assertEqual(user.email, self.valid_user_data['email'])
            self.assertTrue(user.check_password(self.valid_user_data['password']))
            
        # Test invalid email format
        invalid_data = self.valid_user_data.copy()
        invalid_data['email'] = 'invalid_email'
        
        with self.assertRaises(ValidationError):
            create_user(invalid_data)
            
        # Test missing password
        invalid_data = self.valid_user_data.copy()
        invalid_data.pop('password')
        
        with self.assertRaises(ValidationError):
            create_user(invalid_data)

    def test_authenticate_user(self):
        """
        Tests the authenticate_user function to ensure it authenticates users correctly.
        
        Requirements Addressed:
        - User Management (1.3): Validates user authentication workflow
        """
        # Test successful authentication
        with patch('django.contrib.auth.authenticate') as mock_auth:
            mock_auth.return_value = self.test_user
            
            user = authenticate_user(
                self.valid_user_data['email'],
                self.valid_user_data['password']
            )
            
            self.assertIsInstance(user, User)
            self.assertEqual(user.email, self.valid_user_data['email'])
            
        # Test invalid credentials
        with patch('django.contrib.auth.authenticate') as mock_auth:
            mock_auth.return_value = None
            
            with self.assertRaises(ValidationError) as context:
                authenticate_user(
                    self.valid_user_data['email'],
                    'wrong_password'
                )
            self.assertIn('Invalid email or password', str(context.exception))
            
        # Test inactive user
        self.test_user.is_active = False
        self.test_user.save()
        
        with patch('django.contrib.auth.authenticate') as mock_auth:
            mock_auth.return_value = self.test_user
            
            with self.assertRaises(ValidationError) as context:
                authenticate_user(
                    self.valid_user_data['email'],
                    self.valid_user_data['password']
                )
            self.assertIn('User account is inactive', str(context.exception))

    def test_update_user_role(self):
        """
        Tests the update_user_role function to ensure it updates roles correctly.
        
        Requirements Addressed:
        - User Management (1.3): Validates role-based access control
        """
        # Test successful role update
        initial_role = 'viewer'
        new_role = 'editor'
        
        self.test_user.role = initial_role
        self.test_user.save()
        
        result = update_user_role(self.test_user, new_role)
        
        self.assertTrue(result)
        self.test_user.refresh_from_db()
        self.assertEqual(self.test_user.role, new_role)
        
        # Test invalid role
        with self.assertRaises(ValidationError) as context:
            update_user_role(self.test_user, 'invalid_role')
        self.assertIn('Invalid role', str(context.exception))
        
        # Test same role update (no change needed)
        result = update_user_role(self.test_user, new_role)
        self.assertTrue(result)
        
        # Test None role
        with self.assertRaises(ValidationError):
            update_user_role(self.test_user, None)

    def tearDown(self):
        """Clean up test data after each test case."""
        User.objects.all().delete()