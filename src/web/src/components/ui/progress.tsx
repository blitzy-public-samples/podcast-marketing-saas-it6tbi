// React v18.0.0
import React from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { colors, spacing } from '../../theme/index';
import { deepClone } from '../../lib/utils';
import { CommonError } from '../../types/common';

/**
 * Human Tasks:
 * 1. Verify ARIA labels and roles with accessibility team
 * 2. Test color contrast ratios in different theme modes
 * 3. Validate progress bar behavior with screen readers
 * 4. Test animation performance across different browsers
 */

interface ProgressBarProps {
  /** Current progress value */
  value: number;
  /** Maximum progress value */
  max: number;
  /** Optional CSS class name for custom styling */
  className?: string;
}

/**
 * A reusable progress bar component that visualizes progress in various workflows.
 * 
 * Requirements addressed:
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Uses theme tokens for consistent styling and visual hierarchy
 * - Accessibility (8.1 User Interface Design/Design Specifications/Accessibility):
 *   Implements ARIA attributes and roles for screen reader support
 * - Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design):
 *   Adapts to different screen sizes using relative units
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  className 
}) => {
  // Validate input values
  if (value < 0 || max <= 0 || value > max) {
    const error: CommonError = {
      code: 'INVALID_PROGRESS',
      message: 'Progress value must be between 0 and max'
    };
    throw new Error(`${error.code}: ${error.message}`);
  }

  // Calculate progress percentage
  const percentage = Math.round((value / max) * 100);

  // Deep clone theme colors to prevent mutations
  const progressColors = deepClone({
    background: colors.neutral[200],
    fill: colors.primary[500],
    border: colors.neutral[300]
  });

  // Combine default and custom classes
  const containerClasses = classnames(
    'relative w-full overflow-hidden rounded-full',
    'transition-all duration-200 ease-in-out',
    className
  );

  const fillClasses = classnames(
    'h-full rounded-full transition-all duration-200 ease-in-out',
    'bg-primary-500'
  );

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${percentage}% complete`}
      className={containerClasses}
      style={{
        height: spacing.component.padding,
        backgroundColor: progressColors.background,
        border: `1px solid ${progressColors.border}`
      }}
    >
      <div
        className={fillClasses}
        style={{
          width: `${percentage}%`,
          backgroundColor: progressColors.fill
        }}
      />
    </div>
  );
};