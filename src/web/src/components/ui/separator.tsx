// tailwindcss v3.3.0

/**
 * Human Tasks:
 * 1. Verify separator component integration with design system
 * 2. Test separator accessibility with screen readers
 * 3. Validate separator contrast ratios in different themes
 * 4. Test separator responsiveness across different viewport sizes
 */

import React from 'react';
import { colors, spacing, typography } from '../../theme/index';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Interface for Separator component props
interface SeparatorProps {
  // Orientation of the separator - horizontal (default) or vertical
  orientation?: 'horizontal' | 'vertical';
  // Additional CSS classes for custom styling
  className?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  // Base styles using theme tokens
  const baseStyles = `
    flex
    shrink-0
    bg-${colors.border.light}
    transition-colors
    duration-200
  `;

  // Orientation-specific styles
  const orientationStyles = {
    horizontal: `
      h-px
      w-full
      my-${spacing.component.gap}
    `,
    vertical: `
      h-full
      w-px
      mx-${spacing.component.gap}
    `,
  };

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${orientationStyles[orientation]}
    ${className}
  `.trim();

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={combinedStyles}
      style={{
        // Ensure consistent border color in different color modes
        backgroundColor: colors.border.light,
      }}
    />
  );
};

// Default export for the Separator component
export default Separator;