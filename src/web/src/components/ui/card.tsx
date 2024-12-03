/**
 * Human Tasks:
 * 1. Verify card component accessibility with screen readers
 * 2. Test card component responsiveness across different viewports
 * 3. Validate card styles match design system documentation
 * 4. Ensure card interactions (hover, focus) meet WCAG 2.1 AA standards
 */

// classnames v2.3.1
import classnames from 'classnames';

import { colors, spacing, typography } from '../../theme/index';
import { Button } from './button';
import { formatError } from '../../lib/utils';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Card variants for different use cases
type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive';

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
// Card sizes for different contexts
type CardSize = 'small' | 'medium' | 'large';

interface CardProps {
  // Card title
  title: string;
  // Card description
  description: string;
  // Optional card content
  children?: React.ReactNode;
  // Click handler function
  onClick?: () => void;
  // Visual variant of the card
  variant?: CardVariant;
  // Size variant of the card
  size?: CardSize;
  // Optional additional CSS classes
  className?: string;
  // Optional footer content
  footer?: React.ReactNode;
  // Optional image URL
  imageUrl?: string;
  // Optional image alt text
  imageAlt?: string;
  // Optional card actions
  actions?: React.ReactNode;
  // Optional hover effect
  hoverable?: boolean;
  // Optional disabled state
  disabled?: boolean;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Base card styles using theme tokens
const baseCardStyles = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.background.primary,
  borderRadius: '0.75rem', // 12px
  overflow: 'hidden',
  transition: 'all 150ms ease-in-out',
};

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Variant-specific styles
const variantStyles: Record<CardVariant, string> = {
  default: classnames(
    'border',
    'border-neutral-200',
    'bg-white',
    'shadow-sm'
  ),
  elevated: classnames(
    'border',
    'border-neutral-200',
    'bg-white',
    'shadow-md',
    'hover:shadow-lg'
  ),
  outlined: classnames(
    'border-2',
    'border-neutral-300',
    'bg-transparent'
  ),
  interactive: classnames(
    'border',
    'border-neutral-200',
    'bg-white',
    'shadow-sm',
    'hover:shadow-md',
    'cursor-pointer',
    'transform',
    'hover:-translate-y-1'
  ),
};

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
// Size-specific styles
const sizeStyles: Record<CardSize, string> = {
  small: classnames(
    'p-4',
    'gap-2'
  ),
  medium: classnames(
    'p-6',
    'gap-3'
  ),
  large: classnames(
    'p-8',
    'gap-4'
  ),
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  onClick,
  variant = 'default',
  size = 'medium',
  className,
  footer,
  imageUrl,
  imageAlt,
  actions,
  hoverable = false,
  disabled = false,
}) => {
  // Handle click events with error handling
  const handleClick = () => {
    if (disabled || !onClick) return;

    try {
      onClick();
    } catch (error) {
      console.error(formatError(error));
    }
  };

  // Combine all styles
  const cardClasses = classnames(
    // Base styles
    baseCardStyles,
    // Variant styles
    variantStyles[variant],
    // Size styles
    sizeStyles[size],
    // Hover effect
    {
      'hover:shadow-lg hover:-translate-y-1 transition-transform': hoverable && !disabled,
      'opacity-50 cursor-not-allowed': disabled,
    },
    // Additional custom classes
    className
  );

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Card image */}
      {imageUrl && (
        <div className="relative w-full aspect-video">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}

      {/* Card content */}
      <div className="flex flex-col flex-1">
        {/* Card header */}
        <div className="space-y-2">
          <h3 className={classnames(
            typography.fontSize.lg,
            typography.fontWeight.semibold,
            'text-neutral-900',
            'leading-tight'
          )}>
            {title}
          </h3>
          <p className={classnames(
            typography.fontSize.base,
            'text-neutral-600',
            'leading-normal'
          )}>
            {description}
          </p>
        </div>

        {/* Card body */}
        {children && (
          <div className={classnames('mt-4', 'space-y-4')}>
            {children}
          </div>
        )}

        {/* Card actions */}
        {actions && (
          <div className={classnames(
            'mt-6',
            'flex',
            'items-center',
            'justify-end',
            'space-x-4'
          )}>
            {actions}
          </div>
        )}

        {/* Card footer */}
        {footer && (
          <div className={classnames(
            'mt-6',
            'pt-4',
            'border-t',
            'border-neutral-200'
          )}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;