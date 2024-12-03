/**
 * Human Tasks:
 * 1. Verify email service configuration for password reset functionality
 * 2. Ensure password reset email template is properly configured
 * 3. Validate rate limiting settings for password reset requests
 * 4. Confirm email sending service has proper SPF/DKIM records
 */

// react v18.0.0
import { useState, useEffect } from 'react';

// Internal imports with relative paths
import { login } from '../../lib/auth';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import useForm from '../../hooks/use-form';
import { validateCommonError } from '../../lib/validation';

// Validation schema for the forgot password form
const forgotPasswordValidationSchema = {
  email: {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    errorMessage: 'Please enter a valid email address',
  },
};

// Initial form state
const initialFormState = {
  email: '',
};

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Implements the Forgot Password page component for password reset functionality.
 */
const ForgotPasswordPage = () => {
  // Form state management using custom hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm(initialFormState, forgotPasswordValidationSchema);

  // Success state for showing success message
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset success state when form values change
  useEffect(() => {
    if (isSuccess) {
      setIsSuccess(false);
    }
  }, [values]);

  /**
   * Requirement: Form Management (8.1 User Interface Design/Interface Elements)
   * Handles form submission and password reset request.
   */
  const onSubmit = handleSubmit(async (formValues) => {
    try {
      // Call the password reset API endpoint
      const response = await login({
        email: formValues.email,
        type: 'password-reset',
      });

      // Show success message and reset form
      setIsSuccess(true);
      resetForm();

      return response;
    } catch (error) {
      // Validate and handle errors
      if (validateCommonError(error)) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }, {
    onSuccess: () => {
      // Additional success handling if needed
    },
    onError: (error) => {
      console.error('Password reset request failed:', error);
    },
  });

  /**
   * Requirement: Data Validation (8.3 API Design/8.3.2 Interface Specifications)
   * Renders the forgot password form with validation and error handling.
   */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Password reset instructions have been sent to your email address.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ''}
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
            />
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {errors.submit}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            label="Send Reset Instructions"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          />

          {/* Back to login link */}
          <div className="text-sm text-center">
            <a
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;