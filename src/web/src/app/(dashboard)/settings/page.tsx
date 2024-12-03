/**
 * Human Tasks:
 * 1. Verify form validation rules with product team
 * 2. Test settings update functionality with different user roles
 * 3. Validate error handling and success notifications
 * 4. Ensure proper loading states and transitions
 */

// react v18.2.0
import React, { useState, useEffect } from 'react';

// Internal imports with relative paths
import DashboardLayout from '../layout';
import Form from '../../../components/ui/form';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import useAuth from '../../../hooks/use-auth';
import { postData } from '../../../lib/api';

// Requirement: Form Management (8.1 User Interface Design/Interface Elements)
interface SettingsFormValues {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Form validation schema
const validationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    errorMessage: 'Name must be between 2 and 50 characters',
  },
  email: {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    errorMessage: 'Invalid email address',
  },
  currentPassword: {
    required: true,
    minLength: 8,
    errorMessage: 'Current password is required',
  },
  newPassword: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    errorMessage: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
  },
  confirmPassword: {
    validate: (value: string, values: SettingsFormValues) => 
      !values.newPassword || value === values.newPassword || 'Passwords must match',
  },
};

// Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
const SettingsPage: React.FC = () => {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with user data
  const initialValues: SettingsFormValues = {
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // Form fields configuration
  const formFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      required: true,
    },
    {
      name: 'currentPassword',
      label: 'Current Password',
      type: 'password',
      placeholder: 'Enter your current password',
      required: true,
    },
    {
      name: 'newPassword',
      label: 'New Password',
      type: 'password',
      placeholder: 'Enter new password (optional)',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password',
      type: 'password',
      placeholder: 'Confirm new password',
    },
  ];

  // Requirement: Form Management (8.1 User Interface Design/Interface Elements)
  const handleSubmit = async (values: SettingsFormValues) => {
    setIsLoading(true);
    try {
      const response = await postData('/api/settings', {
        name: values.name,
        email: values.email,
        currentPassword: values.currentPassword,
        ...(values.newPassword && {
          newPassword: values.newPassword,
        }),
      });

      // Update auth state with new user data
      if (response.data.user) {
        await login({
          email: values.email,
          password: values.newPassword || values.currentPassword,
        });
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Update your account settings and change your password
          </p>
        </div>

        <Form
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={formFields}
          submitText="Save Changes"
          isLoading={isLoading}
          className="space-y-6"
          onSuccess={() => {
            // Show success notification
            toast.success('Settings updated successfully');
          }}
          onError={(error) => {
            // Show error notification
            toast.error(error.message || 'Failed to update settings');
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;