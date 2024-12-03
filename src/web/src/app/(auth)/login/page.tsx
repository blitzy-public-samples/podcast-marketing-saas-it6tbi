'use client';

// react v18.0.0
import { useState, useEffect } from 'react';

// Internal imports with relative paths
import useAuth from '../../../hooks/use-auth';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import Form from '../../../components/ui/form';
import { validateCommonError } from '../../../lib/validation';
import theme from '../../../theme/index';

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Login page component that provides user authentication functionality
 */
const LoginPage = () => {
  // Initialize auth hook for login functionality
  const { login, loading, error } = useAuth();

  // Form initial values
  const initialValues = {
    email: '',
    password: '',
  };

  // Requirement: Frontend Architecture (1.2 System Overview/High-Level Description/Frontend Architecture)
  // Form validation schema
  const validationSchema = {
    email: {
      required: true,
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      errorMessage: 'Please enter a valid email address',
    },
    password: {
      required: true,
      minLength: 8,
      errorMessage: 'Password must be at least 8 characters long',
    },
  };

  // Form fields configuration
  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      minLength: 8,
    },
  ];

  // Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
  // Handle form submission
  const handleSubmit = async (formData: { email: string; password: string }) => {
    try {
      await login(formData);
    } catch (err) {
      // Validate and format error message
      if (validateCommonError(err)) {
        throw new Error(err.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  };

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 
            className={`
              text-3xl 
              font-bold 
              text-${theme.colors.text.primary}
              font-${theme.typography.variants.display.fontFamily}
            `}
          >
            Welcome Back
          </h1>
          <p 
            className={`
              mt-2 
              text-${theme.colors.text.secondary}
              font-${theme.typography.variants.content.fontFamily}
            `}
          >
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <Form
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={fields}
          submitText="Sign In"
          isLoading={loading}
          className="mt-8 space-y-6"
          onError={(err) => {
            // Error handling is managed by the Form component
            console.error('Login error:', err);
          }}
        />

        {/* Additional Links */}
        <div className="flex items-center justify-between mt-4">
          <a
            href="/forgot-password"
            className={`
              text-sm
              text-${theme.colors.primary[600]}
              hover:text-${theme.colors.primary[500]}
              font-${theme.typography.variants.interactive.fontFamily}
            `}
          >
            Forgot your password?
          </a>
          <a
            href="/register"
            className={`
              text-sm
              text-${theme.colors.primary[600]}
              hover:text-${theme.colors.primary[500]}
              font-${theme.typography.variants.interactive.fontFamily}
            `}
          >
            Create an account
          </a>
        </div>

        {/* Help Text */}
        <p 
          className={`
            mt-8 
            text-center 
            text-sm 
            text-${theme.colors.text.secondary}
          `}
        >
          Need help?{' '}
          <a
            href="/support"
            className={`
              font-medium
              text-${theme.colors.primary[600]}
              hover:text-${theme.colors.primary[500]}
            `}
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;