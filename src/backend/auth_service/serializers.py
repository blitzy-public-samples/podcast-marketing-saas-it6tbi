"""
Authentication Service Serializers

This module defines serializers for the authentication service, enabling the transformation
of complex data types such as User models into JSON and vice versa.

Requirements Addressed:
- User Management (1.3 Scope/Core Features and Functionalities/User Management):
  Supports role-based access control and user data validation by providing structured
  serialization and deserialization of user data.

Human Tasks:
1. Review password validation rules to ensure they meet security requirements
2. Verify email validation configuration aligns with business requirements
3. Configure any additional user fields that may be required in the serializer
"""

# Third-party imports
from rest_framework import serializers  # version 3.14+

# Internal imports
from ..common.exceptions import ValidationError
from ..common.validators import validate_audio_file
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model, enabling the transformation of User objects
    into JSON and vice versa.
    
    This serializer handles the validation and transformation of user data,
    including secure password handling during user creation and updates.
    """
    
    # Define fields explicitly to control serialization
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email address is required.',
            'invalid': 'Please provide a valid email address.'
        }
    )
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'required': 'Password is required.',
            'blank': 'Password cannot be blank.'
        }
    )

    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        """
        Custom validation for the email field.
        
        Args:
            value (str): The email value to validate
            
        Returns:
            str: The validated email value
            
        Raises:
            ValidationError: If the email is invalid or already exists
        """
        # Email is already validated by EmailField, but we can add custom validation
        if User.objects.filter(email=value).exists():
            raise ValidationError(message="A user with this email already exists.")
        return value

    def create(self, validated_data):
        """
        Creates a new User instance with the validated data.
        
        Args:
            validated_data (dict): Dictionary of validated user data
            
        Returns:
            User: The created User instance
            
        Raises:
            ValidationError: If required data is missing or invalid
        """
        try:
            # Create new user instance
            user = User(
                email=validated_data['email']
            )
            
            # Set password using the secure set_password method
            user.set_password(validated_data['password'])
            user.save()
            
            return user
            
        except Exception as e:
            raise ValidationError(message=f"Error creating user: {str(e)}")

    def update(self, instance, validated_data):
        """
        Updates an existing User instance with validated data.
        
        Args:
            instance (User): The existing User instance to update
            validated_data (dict): Dictionary of validated user data
            
        Returns:
            User: The updated User instance
            
        Raises:
            ValidationError: If the update data is invalid
        """
        try:
            # Update email if provided
            if 'email' in validated_data:
                instance.email = validated_data['email']
            
            # Update password if provided
            if 'password' in validated_data:
                instance.set_password(validated_data['password'])
            
            instance.save()
            return instance
            
        except Exception as e:
            raise ValidationError(message=f"Error updating user: {str(e)}")