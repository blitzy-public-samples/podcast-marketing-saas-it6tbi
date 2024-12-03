/**
 * Human Tasks:
 * 1. Verify layout responsiveness across different screen sizes
 * 2. Test keyboard navigation and screen reader compatibility
 * 3. Validate theme integration with global providers
 * 4. Ensure proper ARIA roles and labels are implemented
 */

// react v18.2.0
import React from 'react';

// Internal imports with relative paths
import AppProviders from '../providers';
import Header from '../../components/layout/header';
import Sidebar from '../../components/layout/sidebar';

// Import global and component styles
import '../../styles/globals.css';
import '../../styles/components.css';

/**
 * Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
 * Dashboard layout component that provides consistent structure and styling for the dashboard section.
 */
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProviders>
      {/* Main layout container */}
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header component for top navigation */}
        <Header />

        {/* Main content area with sidebar */}
        <div className="flex h-[calc(100vh-64px)] pt-16">
          {/* Sidebar for navigation */}
          <Sidebar />

          {/* 
            Main content container 
            Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
            Ensures proper spacing and layout adaptation across different screen sizes
          */}
          <main
            className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8"
            // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
            role="main"
            aria-label="Dashboard content"
          >
            {/* 
              Content wrapper with max width constraint
              Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
              Maintains consistent content width and spacing
            */}
            <div className="mx-auto max-w-7xl">
              {/* Render child components */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </AppProviders>
  );
};

export default DashboardLayout;