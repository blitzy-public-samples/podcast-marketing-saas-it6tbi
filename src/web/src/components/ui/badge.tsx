// tailwindcss v3.3.0

/**
 * Human Tasks:
 * 1. Verify color contrast ratios meet WCAG 2.1 AA standards for all badge variants
 * 2. Test badge component rendering across different viewport sizes
 * 3. Validate badge text truncation behavior with long content
 * 4. Ensure badge component scales properly with different font sizes
 */

import React from 'react';
import { themeColors } from '../../theme/colors';
import { typographyStyles } from '../../theme/typography';
import { theme } from '../../theme/index';
import { deepClone } from '../../lib/utils';

// Define badge variant types for type safety
type BadgeVariant = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  /** Text content to display inside the badge */
  text: string;
  /** Visual style variant of the badge */
  variant?: BadgeVariant;
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * A reusable Badge component for displaying labels, tags, or status indicators.
 * 
 * Requirements addressed:
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Implements consistent badge styling across the application
 * - Theme Support (8.1 User Interface Design/Design Specifications/Theme Support):
 *   Supports different theme variants with appropriate color combinations
 * - Accessibility (8.1 User Interface Design/Design Specifications/Accessibility):
 *   Ensures proper contrast ratios and ARIA attributes for accessibility
 */
export function Badge({ text, variant = 'primary', className = '' }: BadgeProps): JSX.Element {
  // Get theme colors for the selected variant
  const getVariantColors = (variant: BadgeVariant) => {
    const colors = {
      background: '',
      text: '',
    };

    switch (variant) {
      case 'primary':
        colors.background = themeColors.primary[100];
        colors.text = themeColors.primary[700];
        break;
      case 'secondary':
        colors.background = themeColors.secondary[100];
        colors.text = themeColors.secondary[700];
        break;
      case 'neutral':
        colors.background = themeColors.neutral[100];
        colors.text = themeColors.neutral[700];
        break;
      case 'success':
        colors.background = theme.colors.utility.success.light;
        colors.text = themeColors.neutral[50];
        break;
      case 'warning':
        colors.background = theme.colors.utility.warning.light;
        colors.text = themeColors.neutral[900];
        break;
      case 'error':
        colors.background = theme.colors.utility.error.light;
        colors.text = themeColors.neutral[50];
        break;
      case 'info':
        colors.background = theme.colors.utility.info.light;
        colors.text = themeColors.neutral[50];
        break;
      default:
        colors.background = themeColors.primary[100];
        colors.text = themeColors.primary[700];
    }

    return colors;
  };

  const variantColors = getVariantColors(variant);

  // Combine base styles with variant-specific styles and custom classes
  const baseStyles = [
    // Typography styles
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'text-sm',
    'leading-none',
    'whitespace-nowrap',
    
    // Spacing and layout
    'px-2.5',
    'py-1',
    'rounded-full',
    
    // Transitions for hover and focus states
    'transition-colors',
    'duration-200',
    
    // Focus styles for accessibility
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-opacity-50',
  ].join(' ');

  // Apply variant-specific background and text colors
  const variantStyles = {
    backgroundColor: variantColors.background,
    color: variantColors.text,
    fontFamily: typographyStyles.fontFamily.primary,
    fontSize: typographyStyles.fontSize.sm,
    fontWeight: typographyStyles.fontWeight.medium,
  };

  return (
    <span
      className={`${baseStyles} ${className}`}
      style={variantStyles}
      role="status"
      aria-label={`${variant} badge: ${text}`}
    >
      {text}
    </span>
  );
}