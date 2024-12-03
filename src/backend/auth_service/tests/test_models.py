"""
Unit tests for the User model in the authentication service.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Ensures the correctness of the User model by testing its methods, constraints,
  and behaviors.

Human Tasks:
1. Ensure test database configuration is properly set up
2. Verify that test environment has the required permissions to create/modify users
3. Configure test coverage reporting tools if needed
"""

# Django imports - version 4.2+
from django.test import TestCase

# Internal imports
from src.backend.auth_service.models import User
from src.backend.common.exceptions import ValidationError

class TestUserModel(TestCase):
    """Test suite for the User model, covering its methods and constraints."""

    def setUp(self):
        """Set up test data before each test method."""
        self.valid_email = "test@example.com"
        self.valid_password = "SecurePass123!"
        self.test_user = User.objects.create_user(
            email=self.valid_email,
            password=self.valid_password
        )

    def test_user_creation(self):
        """Tests the creation of a User instance with valid data."""
        # Create a new user with valid data
        user = User.objects.create_user(
            email="newuser@example.com",
            password="ValidPass456!"
        )

        # Assert that the user was created successfully
        self.assertIsNotNone(user.id)
        self.assertEqual(user.email, "newuser@example.com")
        self.assertTrue(user.password_hash)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.role, 'viewer')

        # Test user creation with invalid data
        with self.assertRaises(ValidationError) as context:
            User.objects.create_user(email="", password="ValidPass456!")
        self.assertEqual(context.exception.message, "Email address is required")

        with self.assertRaises(ValidationError) as context:
            User.objects.create_user(email="invalid@example.com", password="")
        self.assertEqual(context.exception.message, "Password is required")

    def test_set_password(self):
        """Tests the set_password method of the User model."""
        # Store the original password hash
        original_hash = self.test_user.password_hash

        # Set a new password
        new_password = "NewSecurePass456!"
        result = self.test_user.set_password(new_password)

        # Verify the password was changed
        self.assertTrue(result)
        self.assertNotEqual(self.test_user.password_hash, original_hash)

        # Test setting invalid password
        with self.assertRaises(ValidationError) as context:
            self.test_user.set_password("")
        self.assertEqual(context.exception.message, "Password cannot be empty")

    def test_check_password(self):
        """Tests the check_password method of the User model."""
        # Test with correct password
        self.assertTrue(
            self.test_user.check_password(self.valid_password),
            "Password check should return True for correct password"
        )

        # Test with incorrect password
        self.assertFalse(
            self.test_user.check_password("WrongPassword123!"),
            "Password check should return False for incorrect password"
        )

        # Test with empty password
        self.assertFalse(
            self.test_user.check_password(""),
            "Password check should return False for empty password"
        )

    def test_user_string_representation(self):
        """Tests the string representation of the User model."""
        self.assertEqual(str(self.test_user), self.valid_email)

    def test_superuser_creation(self):
        """Tests the creation of a superuser."""
        superuser = User.objects.create_superuser(
            email="admin@example.com",
            password="AdminPass123!"
        )

        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertEqual(superuser.role, 'admin')

    def test_user_model_fields(self):
        """Tests the fields and default values of the User model."""
        user = self.test_user

        # Test field types
        self.assertIsInstance(user.email, str)
        self.assertIsInstance(user.password_hash, str)
        self.assertIsInstance(user.role, str)
        self.assertIsInstance(user.is_active, bool)
        self.assertIsInstance(user.is_staff, bool)
        self.assertIsInstance(user.is_superuser, bool)

        # Test default values
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.role, 'viewer')

        # Test timestamps
        self.assertIsNotNone(user.created_at)
        self.assertIsNotNone(user.updated_at)

    def tearDown(self):
        """Clean up test data after each test method."""
        User.objects.all().delete()