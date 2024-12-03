// tailwindcss v3.3.0

/**
 * Human Tasks:
 * 1. Verify skeleton animation performance across different browsers and devices
 * 2. Test skeleton component with different screen readers for accessibility
 * 3. Validate skeleton component behavior in dark mode
 * 4. Ensure skeleton animations respect user's reduced motion preferences
 */

import { FC } from 'react';
import { colors, spacing, typography } from '../../theme/index';

// Props interface for the Skeleton component
interface SkeletonProps {
  /**
   * Width of the skeleton element. Can be a number (px), string (%, rem, etc),
   * or 'full' for 100% width
   */
  width?: number | string;
  
  /**
   * Height of the skeleton element. Can be a number (px), string (%, rem, etc)
   */
  height?: number | string;
  
  /**
   * Optional CSS class names to apply additional styles
   */
  className?: string;
  
  /**
   * Optional border radius override
   */
  borderRadius?: string;
  
  /**
   * Optional animation duration in milliseconds
   */
  animationDuration?: number;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Default styles for the skeleton component using theme tokens
const defaultStyles = {
  backgroundColor: colors.neutral[200],
  borderRadius: spacing.small,
  animationDuration: 1500,
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
// Skeleton component with ARIA attributes and animation
export const Skeleton: FC<SkeletonProps> = ({
  width = '100%',
  height = typography.fontSize.base,
  className = '',
  borderRadius = defaultStyles.borderRadius,
  animationDuration = defaultStyles.animationDuration,
}) => {
  // Convert numeric width/height to pixel values
  const getSize = (size: number | string) => 
    typeof size === 'number' ? `${size}px` : size;

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  // Dynamic styles based on props and theme
  const skeletonStyles = {
    width: getSize(width),
    height: getSize(height),
    backgroundColor: defaultStyles.backgroundColor,
    borderRadius,
    animation: `skeleton-pulse ${animationDuration}ms ease-in-out infinite`,
    // Ensure the skeleton is visible but not too prominent
    opacity: '0.7',
  };

  return (
    <>
      {/* Add keyframe animation for the skeleton pulse effect */}
      <style jsx>{`
        @keyframes skeleton-pulse {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 0.7;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skeleton {
            animation: none;
          }
        }
      `}</style>

      <div
        className={`skeleton ${className}`}
        style={skeletonStyles}
        // Accessibility attributes
        role="status"
        aria-label="Loading..."
        aria-busy="true"
        // Data attributes for testing
        data-testid="skeleton-loader"
      />
    </>
  );
};

// Default export for the Skeleton component
export default Skeleton;