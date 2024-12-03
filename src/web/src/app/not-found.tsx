// react v18.2.0
'use client';
import React from 'react';

// Internal imports with relative paths
import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import Layout from './layout';
import AppProviders from './providers';
import { formatError } from '../lib/utils';
import '../styles/globals.css';

/**
 * Requirement: Error Handling (8.1 User Interface Design/Critical User Flows)
 * Provides a user-friendly page to handle invalid or non-existent routes.
 */
const NotFoundPage: React.FC = () => {
  // Format the error message for display
  const errorMessage = formatError({
    code: '404',
    message: 'The page you are looking for could not be found.'
  });

  // Handle navigation back to home page
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <AppProviders>
      <Layout>
        {/* 
          Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
          Ensures consistent styling and layout for error pages.
        */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          {/* 
            Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
            Ensures the 'Not Found' page is accessible and meets WCAG 2.1 AA compliance.
          */}
          <div
            role="alert"
            aria-live="polite"
            className="w-full max-w-md text-center"
          >
            {/* Display error message in an alert */}
            <Alert
              type="error"
              message={errorMessage}
              title="Page Not Found"
              dismissible={false}
              showToast={false}
              actions={[
                {
                  label: "Return to Homepage",
                  onClick: handleBackToHome,
                  variant: "primary"
                }
              ]}
            />

            {/* Additional navigation options */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                You can try going back to the homepage or contact support if you believe this is an error.
              </p>
              
              <Button
                label="Back to Homepage"
                onClick={handleBackToHome}
                variant="primary"
                size="large"
                className="min-w-[200px]"
                ariaLabel="Navigate back to homepage"
              />
            </div>
          </div>
        </div>
      </Layout>
    </AppProviders>
  );
};

export default NotFoundPage;