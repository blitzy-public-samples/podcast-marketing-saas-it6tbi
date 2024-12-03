// React v18.0.0
import React from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { colors, spacing, typography } from '../theme/index';
import { ProgressBar } from '../components/ui/progress';

/**
 * Human Tasks:
 * 1. Verify loading screen meets WCAG 2.1 AA contrast requirements
 * 2. Test loading screen behavior with screen readers
 * 3. Validate loading screen responsiveness across different viewport sizes
 * 4. Ensure loading animations perform well on low-end devices
 */

interface LoadingScreenProps {
  /** Optional message to display below the progress bar */
  message?: string;
}

/**
 * A loading screen component that provides visual feedback during application
 * initialization or data fetching operations.
 * 
 * Requirements addressed:
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Uses theme tokens for consistent styling and visual hierarchy
 * - Accessibility (8.1 User Interface Design/Design Specifications/Accessibility):
 *   Implements ARIA attributes and roles for screen reader support
 * - Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design):
 *   Adapts to different screen sizes using relative units and flexbox
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  // Combine class names for container styling
  const containerClasses = classnames(
    'fixed inset-0 flex flex-col items-center justify-center',
    'bg-background-primary transition-opacity duration-200',
    'min-h-screen w-full'
  );

  // Message container classes for consistent typography
  const messageClasses = classnames(
    'mt-4 text-center',
    'text-text-secondary animate-fade-in',
    'transition-opacity duration-200'
  );

  return (
    <div 
      role="alert"
      aria-busy="true"
      aria-label="Loading content"
      className={containerClasses}
      style={{
        backgroundColor: colors.background.primary,
      }}
    >
      {/* Loading indicator container */}
      <div 
        className="w-full max-w-md px-4"
        style={{
          padding: spacing.component.padding
        }}
      >
        {/* Progress bar for visual feedback */}
        <ProgressBar
          value={75} // Indeterminate progress
          max={100}
          className="w-full"
        />

        {/* Optional loading message */}
        {message && (
          <div 
            className={messageClasses}
            style={{
              ...typography.variants.content,
              color: colors.text.secondary
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;