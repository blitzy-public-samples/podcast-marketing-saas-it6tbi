/**
 * Human Tasks:
 * 1. Verify password requirements with security team
 * 2. Confirm email validation regex with backend team
 * 3. Test form accessibility with screen readers
 * 4. Validate error message content with UX team
 */

'use client';

// react v18.0.0
import { useState, useEffect } from 'react';

// Internal imports with relative paths
import useForm from '../../../hooks/use-form';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { validateApiResponse } from '../../../lib/validation';
import { login } from '../../../lib/auth';

// Requirement: Form Management (8.1 User Interface Design/Interface Elements)
// Validation schema for registration form
const validationSchema = {
  email: {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    errorMessage: 'Please enter a valid email address',
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    errorMessage: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character',
  },
  confirmPassword: {
    required: true,
    validate: (value: string, formValues: any) => value === formValues.password || 'Passwords must match',
  },
};

// Initial form state
const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

// Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
const RegisterPage = () => {
  // Form state management using custom hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialValues, validationSchema);

  // Registration success state
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  // Generic error message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear error message when form values change
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [values]);

  // Handle form submission
  const onSubmit = async (formData: typeof initialValues) => {
    try {
      // Make API call to register endpoint
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // Validate API response
      if (!validateApiResponse(data)) {
        throw new Error('Invalid API response');
      }

      // Handle successful registration
      if (response.ok) {
        setRegistrationSuccess(true);
        // Auto-login after successful registration
        await login({
          email: formData.email,
          password: formData.password,
        });
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
      console.error('Registration error:', error);
    }
  };

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </a>
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Error message display */}
          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Success message display */}
          {registrationSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Registration successful! Redirecting to dashboard...
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            {/* Email Input */}
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email address"
              error={touched.email ? errors.email : ''}
              required
            />

            {/* Password Input */}
            <Input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              error={touched.password ? errors.password : ''}
              required
            />

            {/* Confirm Password Input */}
            <Input
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm password"
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            label={isSubmitting ? 'Creating account...' : 'Create account'}
            className="w-full"
          />
        </form>

        {/* Terms and Privacy Policy */}
        <p className="mt-4 text-center text-sm text-gray-600">
          By creating an account, you agree to our{' '}
          <a href="/terms" className="font-medium text-primary-600 hover:text-primary-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;