// classnames v2.3.1
import classnames from 'classnames';
import React from 'react';

// Internal imports
import { typography } from '../../theme/index';
import { formatError } from '../../lib/utils';

/**
 * Human Tasks:
 * 1. Verify ARIA label implementation with screen reader testing
 * 2. Validate color contrast ratios for label text against different backgrounds
 * 3. Test label wrapping behavior with long text content
 */

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Default typography styles for labels to maintain consistent visual hierarchy
const defaultLabelStyles = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.bodySmall,
  fontWeight: typography.fontWeight.medium,
  lineHeight: typography.lineHeight.normal,
};

// Interface for Label component props
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** HTML for attribute to associate label with form control */
  htmlFor: string;
  /** Label content */
  children: React.ReactNode;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Label component for form inputs with consistent styling and accessibility.
 * 
 * Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
 * - Ensures proper label-input association through htmlFor attribute
 * - Maintains WCAG 2.1 AA compliance for text contrast
 * - Supports screen readers through semantic HTML
 * 
 * @param {LabelProps} props - Component props
 * @returns {JSX.Element} Styled label element
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, children, className, ...props }, ref) => {
    try {
      // Combine default styles with any custom classes
      const labelClasses = classnames(
        // Base typography styles
        'block', // Display block for proper spacing
        'text-left', // Left alignment for readability
        'select-none', // Prevent text selection for better UX
        
        // Apply theme typography styles
        {
          [`font-${defaultLabelStyles.fontFamily}`]: true,
          [`text-${defaultLabelStyles.fontSize}`]: true,
          [`font-${defaultLabelStyles.fontWeight}`]: true,
          [`leading-${defaultLabelStyles.lineHeight}`]: true,
        },
        
        // Custom className if provided
        className
      );

      return (
        <label
          ref={ref}
          htmlFor={htmlFor}
          className={labelClasses}
          {...props}
        >
          {children}
        </label>
      );
    } catch (error) {
      // Format and log any errors during rendering
      console.error(formatError(error));
      // Return a fallback label to maintain functionality
      return (
        <label htmlFor={htmlFor} className={className} {...props}>
          {children}
        </label>
      );
    }
  }
);

// Set display name for debugging and dev tools
Label.displayName = 'Label';