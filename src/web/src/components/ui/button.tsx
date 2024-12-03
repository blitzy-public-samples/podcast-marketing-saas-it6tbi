/**
 * Human Tasks:
 * 1. Verify button styles match design system documentation
 * 2. Test button accessibility with screen readers
 * 3. Validate button contrast ratios meet WCAG 2.1 AA standards
 * 4. Test button interactions across different browsers and devices
 * 5. Ensure button states (hover, focus, active) are visually distinct
 */

// classnames v2.3.1
import classnames from 'classnames';

import { colors, spacing, typography } from '../../theme/index';
import { formatError } from '../../lib/utils';
import type { CommonError } from '../../types/common';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Button variants for different use cases
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
// Button sizes for different contexts
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  // Button text content
  label: string;
  // Click handler function
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // Visual variant of the button
  variant?: ButtonVariant;
  // Size variant of the button
  size?: ButtonSize;
  // Optional additional CSS classes
  className?: string;
  // Disabled state
  disabled?: boolean;
  // Loading state
  loading?: boolean;
  // Type attribute
  type?: 'button' | 'submit' | 'reset';
  // ARIA label for accessibility
  ariaLabel?: string;
  // Icon component to display
  icon?: React.ReactNode;
  // Icon position
  iconPosition?: 'left' | 'right';
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Base button styles
const baseButtonStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: typography.fontFamily.body,
  fontWeight: typography.fontWeight.buttonWeight,
  borderRadius: '0.375rem', // 6px
  transition: 'all 150ms ease-in-out',
  cursor: 'pointer',
  outline: 'none',
};

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Variant-specific styles
const variantStyles: Record<ButtonVariant, string> = {
  primary: classnames(
    'bg-primary-600',
    'text-white',
    'hover:bg-primary-700',
    'active:bg-primary-800',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2'
  ),
  secondary: classnames(
    'bg-secondary-100',
    'text-secondary-700',
    'hover:bg-secondary-200',
    'active:bg-secondary-300',
    'focus:ring-2',
    'focus:ring-secondary-500',
    'focus:ring-offset-2'
  ),
  tertiary: classnames(
    'bg-transparent',
    'text-primary-600',
    'hover:bg-primary-50',
    'active:bg-primary-100',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2'
  ),
  danger: classnames(
    'bg-red-600',
    'text-white',
    'hover:bg-red-700',
    'active:bg-red-800',
    'focus:ring-2',
    'focus:ring-red-500',
    'focus:ring-offset-2'
  ),
  ghost: classnames(
    'bg-transparent',
    'text-gray-600',
    'hover:bg-gray-100',
    'active:bg-gray-200',
    'focus:ring-2',
    'focus:ring-gray-500',
    'focus:ring-offset-2'
  ),
};

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
// Size-specific styles
const sizeStyles: Record<ButtonSize, string> = {
  small: classnames(
    'px-3',
    'py-1.5',
    'text-sm',
    'gap-1.5'
  ),
  medium: classnames(
    'px-4',
    'py-2',
    'text-base',
    'gap-2'
  ),
  large: classnames(
    'px-6',
    'py-3',
    'text-lg',
    'gap-3'
  ),
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  className,
  disabled = false,
  loading = false,
  type = 'button',
  ariaLabel,
  icon,
  iconPosition = 'left',
}) => {
  // Handle click events with error handling
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || !onClick) return;

    try {
      onClick(event);
    } catch (error) {
      const formattedError = formatError(error as CommonError);
      console.error(formattedError);
    }
  };

  // Combine all styles
  const buttonClasses = classnames(
    // Base styles
    baseButtonStyles,
    // Variant styles
    variantStyles[variant],
    // Size styles
    sizeStyles[size],
    // State styles
    {
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-wait': loading,
    },
    // Additional custom classes
    className
  );

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || label}
      aria-disabled={disabled}
      aria-busy={loading}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}

      {/* Icon and label layout */}
      {icon && iconPosition === 'left' && !loading && icon}
      <span>{label}</span>
      {icon && iconPosition === 'right' && !loading && icon}
    </button>
  );
};

export default Button;