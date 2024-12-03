/**
 * Human Tasks:
 * 1. Verify theme integration with design system documentation
 * 2. Test layout responsiveness across different device sizes
 * 3. Validate accessibility features with screen reader testing
 * 4. Ensure proper keyboard navigation flow through layout components
 */

// react v18.2.0
'use client';
import React from 'react';
// tailwindcss v3.3.0
import 'tailwindcss/tailwind.css';

// Internal imports with relative paths
import { colors, spacing, typography } from '../theme/index';
import AppProviders from './providers';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import Navigation from '../components/layout/navigation';

/**
 * Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
 * Main layout component that provides consistent structure and styling across the application.
 * Integrates global providers, theme configurations, and layout components.
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  const layoutStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.body,
  };

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  const mainContentStyles: React.CSSProperties = {
    flex: '1 1 auto',
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: `${spacing.layout.page} ${spacing.layout.section}`,
    // Add padding to account for fixed header height
    paddingTop: 'calc(64px + 2rem)', // Header height + additional spacing
  };

  return (
    // Requirement: Global Context (1.3 Scope/Core Features and Functionalities/User Management)
    <AppProviders>
      {/* Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy) */}
      <div style={layoutStyles}>
        {/* Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded"
          style={{ fontFamily: typography.fontFamily.body }}
        >
          Skip to main content
        </a>

        {/* Navigation component with Header and Sidebar */}
        <Navigation />

        {/* Main content area */}
        <main
          id="main-content"
          style={mainContentStyles}
          // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>

        {/* Footer component */}
        <Footer />
      </div>
    </AppProviders>
  );
};

export default Layout;