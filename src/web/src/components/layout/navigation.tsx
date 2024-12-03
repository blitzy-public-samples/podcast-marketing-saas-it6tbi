/**
 * Human Tasks:
 * 1. Verify navigation accessibility with screen reader testing
 * 2. Test responsive behavior across different device sizes
 * 3. Validate keyboard navigation functionality
 * 4. Ensure proper color contrast ratios for navigation elements
 * 5. Test navigation with different user roles and permissions
 */

// React v18.0.0
import React, { useState, useEffect } from 'react';

// Internal imports
import Header from './header';
import Sidebar from './sidebar';
import { colors, typography } from '../../theme/index';
import useAuth from '../../hooks/use-auth';
import { formatError } from '../../lib/utils';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const navigationStyles = {
  display: 'flex',
  flexDirection: 'column' as const,
  minHeight: '100vh',
  backgroundColor: colors.background.primary,
  fontFamily: typography.fontFamily.body,
};

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const mainContentStyles = {
  display: 'flex',
  flexGrow: 1,
  marginTop: '64px', // Height of the header
};

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Handle responsive layout changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024); // lg breakpoint
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Error handling for navigation-related operations
  const handleNavigationError = (error: unknown) => {
    const formattedError = formatError(error);
    setError(formattedError);
    console.error('Navigation error:', formattedError);
  };

  try {
    return (
      // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
      <div 
        style={navigationStyles}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header component for top navigation */}
        <Header />

        {/* Main content area with sidebar */}
        <div style={mainContentStyles}>
          {/* Sidebar component - conditionally rendered based on authentication */}
          {/* Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management) */}
          {isAuthenticated && (
            <Sidebar />
          )}

          {/* Error display */}
          {error && (
            <div 
              className="fixed bottom-4 right-4 p-4 bg-red-100 text-red-700 rounded-md shadow-lg"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    handleNavigationError(error);
    return null;
  }
};

export default Navigation;