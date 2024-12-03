"""
Authentication Service Models

This module defines the User model and related models for the authentication service.
These models are used to manage user data, including authentication credentials, roles,
and permissions.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Supports role-based access control, team collaboration, and activity tracking by
  providing a structured representation of user data.

Human Tasks:
1. Review password hashing configuration to ensure it meets security requirements
2. Verify email configuration for user notifications
3. Configure user roles and permissions in the admin interface
4. Set up automated user data backup procedures
"""

# Django imports - version 4.2+
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# Internal imports
from src.backend.common.exceptions import ValidationError

class UserManager(BaseUserManager):
    """
    Custom manager for the User model, providing methods for creating users and superusers.
    Extends Django's BaseUserManager to implement custom user creation logic.
    """
    
    def create_user(self, email: str, password: str) -> 'User':
        """
        Creates and returns a new user with the given email and password.
        
        Args:
            email (str): The user's email address
            password (str): The user's raw password
            
        Returns:
            User: The created User instance
            
        Raises:
            ValidationError: If email or password is invalid
        """
        if not email:
            raise ValidationError(message="Email address is required")
        if not password:
            raise ValidationError(message="Password is required")
            
        # Normalize the email address by lowercasing the domain part
        email = self.normalize_email(email)
        
        # Create new user instance
        user = self.model(
            email=email,
            is_active=True,
            is_staff=False,
            is_superuser=False
        )
        
        # Set the password using Django's password hashing
        user.set_password(password)
        user.save(using=self._db)
        
        return user
    
    def create_superuser(self, email: str, password: str) -> 'User':
        """
        Creates and returns a new superuser with the given email and password.
        
        Args:
            email (str): The superuser's email address
            password (str): The superuser's raw password
            
        Returns:
            User: The created superuser instance
            
        Raises:
            ValidationError: If email or password is invalid
        """
        user = self.create_user(email=email, password=password)
        
        user.is_staff = True
        user.is_superuser = True
        user.role = 'admin'
        user.save(using=self._db)
        
        return user

class User(AbstractBaseUser):
    """
    Custom user model for the authentication service, extending AbstractBaseUser
    and providing additional fields for roles and permissions.
    """
    
    # User role choices
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('creator', 'Content Creator'),
        ('editor', 'Content Editor'),
        ('viewer', 'Content Viewer')
    ]
    
    # Required fields
    email = models.EmailField(
        verbose_name='Email Address',
        max_length=255,
        unique=True,
        db_index=True,
        help_text='User\'s email address for authentication and communication'
    )
    
    password_hash = models.CharField(
        verbose_name='Password Hash',
        max_length=128,
        help_text='Hashed user password'
    )
    
    role = models.CharField(
        verbose_name='User Role',
        max_length=20,
        choices=ROLE_CHOICES,
        default='viewer',
        help_text='User\'s role determining their permissions'
    )
    
    # Status flags
    is_active = models.BooleanField(
        verbose_name='Active Status',
        default=True,
        help_text='Designates whether this user should be treated as active'
    )
    
    is_staff = models.BooleanField(
        verbose_name='Staff Status',
        default=False,
        help_text='Designates whether the user can log into the admin site'
    )
    
    is_superuser = models.BooleanField(
        verbose_name='Superuser Status',
        default=False,
        help_text='Designates that this user has all permissions without explicitly assigning them'
    )
    
    # Metadata fields
    created_at = models.DateTimeField(
        verbose_name='Created At',
        auto_now_add=True,
        help_text='Timestamp when the user was created'
    )
    
    updated_at = models.DateTimeField(
        verbose_name='Updated At',
        auto_now=True,
        help_text='Timestamp when the user was last updated'
    )
    
    # Specify custom manager
    objects = UserManager()
    
    # Specify which field to use as the username for authentication
    USERNAME_FIELD = 'email'
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
        
    def set_password(self, raw_password: str) -> bool:
        """
        Hashes and sets the user's password.
        
        Args:
            raw_password (str): The raw password to hash and set
            
        Returns:
            bool: True if the password is successfully set
            
        Raises:
            ValidationError: If the password is invalid
        """
        if not raw_password:
            raise ValidationError(message="Password cannot be empty")
            
        self.password_hash = self.make_password(raw_password)
        self.save(update_fields=['password_hash'])
        return True
    
    def check_password(self, raw_password: str) -> bool:
        """
        Checks if the given raw_password matches the stored hashed password.
        
        Args:
            raw_password (str): The raw password to check
            
        Returns:
            bool: True if the passwords match, otherwise False
        """
        if not raw_password or not self.password_hash:
            return False
            
        return self.check_password(raw_password)
    
    def __str__(self) -> str:
        """
        String representation of the User model.
        
        Returns:
            str: User's email address
        """
        return self.email