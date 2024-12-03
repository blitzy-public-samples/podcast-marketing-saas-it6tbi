/**
 * Human Tasks:
 * 1. Verify password reset API endpoint configuration with backend team
 * 2. Test password reset flow with different error scenarios
 * 3. Validate password strength requirements with security team
 * 4. Ensure proper error tracking setup for password reset failures
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import useForm from '../../hooks/use-form';
import { login } from '../../lib/auth';
import { validateApiResponse } from '../../lib/validation';
import type { AuthResponse } from '../../types/auth';
import AppProviders from '../../providers';

// Validation schema for password reset form
const validationSchema = {
  newPassword: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    errorMessage: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
  },
  confirmPassword: {
    required: true,
    validate: (value: string, formValues: { newPassword: string }) => 
      value === formValues.newPassword || 'Passwords must match',
  },
};

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Implements the Reset Password page component allowing users to reset their passwords.
 */
const ResetPasswordPage: React.FC = () => {
  const router = useRouter();

  // Initialize form state with validation
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema
  );

  /**
   * Requirement: Form Management (8.1 User Interface Design/Interface Elements)
   * Handles the password reset form submission
   */
  const onSubmit = async (formValues: typeof values) => {
    try {
      // Make API call to reset password
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formValues.newPassword,
          token: new URLSearchParams(window.location.search).get('token'),
        }),
      });

      const data = await response.json();

      // Validate API response
      if (!validateApiResponse(data)) {
        throw new Error('Invalid API response');
      }

      // Auto-login user after successful password reset
      const authResponse = data as AuthResponse;
      await login({
        email: authResponse.user.email,
        password: formValues.newPassword,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  /**
   * Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
   * Renders the password reset form with consistent styling
   */
  return (
    <AppProviders>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter your new password
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <Input
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="New Password"
                  error={touched.newPassword ? errors.newPassword : ''}
                  required
                />
              </div>

              <div>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm Password"
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                  required
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                label="Reset Password"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full"
              />
            </div>
          </form>
        </div>
      </div>
    </AppProviders>
  );
};

export default ResetPasswordPage;