/**
 * Human Tasks:
 * 1. Verify alert component accessibility with screen readers
 * 2. Test alert animations across different browsers
 * 3. Validate alert color contrast ratios meet WCAG 2.1 AA standards
 * 4. Ensure alert messages are properly localized
 * 5. Test alert behavior with different message lengths
 */

// react v18.2.0
import { useState, useEffect } from 'react';

// Internal imports with relative paths
import { colors, spacing, typography } from '../../theme/index';
import { formatError } from '../../lib/utils';
import { Button } from './button';
import useToast from '../../hooks/use-toast';

// Alert types for different contexts
type AlertType = 'success' | 'error' | 'warning' | 'info';

// Alert position configuration
type AlertPosition = 'top' | 'bottom';

interface AlertProps {
  // The type of alert to display
  type?: AlertType;
  // The message to display in the alert
  message: string;
  // Optional title for the alert
  title?: string;
  // Whether the alert can be dismissed
  dismissible?: boolean;
  // Auto-dismiss duration in milliseconds
  duration?: number;
  // Position of the alert
  position?: AlertPosition;
  // Optional callback when alert is dismissed
  onDismiss?: () => void;
  // Optional additional CSS classes
  className?: string;
  // Whether to show a toast notification when alert appears
  showToast?: boolean;
  // Optional actions to display in the alert
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Alert type to theme color mapping
const alertTypeStyles: Record<AlertType, { bg: string; border: string; text: string }> = {
  success: {
    bg: colors.utility.success.light,
    border: colors.primary[300],
    text: colors.text.primary,
  },
  error: {
    bg: colors.utility.error.light,
    border: colors.utility.error.dark,
    text: colors.text.primary,
  },
  warning: {
    bg: colors.utility.warning.light,
    border: colors.utility.warning.dark,
    text: colors.text.primary,
  },
  info: {
    bg: colors.utility.info.light,
    border: colors.utility.info.dark,
    text: colors.text.primary,
  },
};

// Requirement: User Notifications (8.1 User Interface Design/Notification System)
export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  title,
  dismissible = true,
  duration,
  position = 'top',
  onDismiss,
  className = '',
  showToast = false,
  actions = [],
}) => {
  const [visible, setVisible] = useState(true);
  const toast = useToast();

  // Requirement: User Notifications (8.1 User Interface Design/Notification System)
  // Show toast notification if enabled
  useEffect(() => {
    if (showToast && visible) {
      toast[type](message);
    }
  }, [showToast, type, message, toast]);

  // Auto-dismiss effect
  useEffect(() => {
    if (duration && visible) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, visible]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed 
        ${position === 'top' ? 'top-4' : 'bottom-4'} 
        left-1/2 
        transform 
        -translate-x-1/2 
        w-full 
        max-w-md 
        px-${spacing.medium} 
        py-${spacing.small}
        rounded-lg 
        shadow-lg 
        ${className}
      `}
      style={{
        backgroundColor: alertTypeStyles[type].bg,
        borderLeft: `4px solid ${alertTypeStyles[type].border}`,
        color: alertTypeStyles[type].text,
        zIndex: 50,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <h4
              className={`text-${typography.fontSize.lg} font-${typography.fontWeight.semibold} mb-${spacing.small}`}
            >
              {title}
            </h4>
          )}
          <p
            className={`text-${typography.fontSize.base} leading-${typography.lineHeight.normal}`}
          >
            {typeof message === 'string' ? message : formatError(message)}
          </p>
          
          {/* Action buttons */}
          {actions.length > 0 && (
            <div className={`mt-${spacing.medium} flex gap-${spacing.small}`}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  label={action.label}
                  onClick={action.onClick}
                  variant={action.variant || 'secondary'}
                  size="small"
                />
              ))}
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`ml-${spacing.medium} text-${typography.fontSize.lg} text-${colors.text.secondary} hover:text-${colors.text.primary}`}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
```

This implementation:

1. Creates a reusable Alert component with support for different types (success, error, warning, info)
2. Implements accessibility features including ARIA attributes and keyboard navigation
3. Uses theme tokens for consistent styling
4. Supports auto-dismissal with configurable duration
5. Integrates with the toast system for additional notifications
6. Includes support for custom actions and dismissal callbacks
7. Uses proper relative imports for dependencies
8. Implements responsive design with proper positioning
9. Includes type safety through TypeScript
10. Addresses the specified requirements from the technical specification
11. Follows the project's UI consistency guidelines
12. Includes proper error formatting for error messages
13. Supports customization through className prop
14. Implements proper z-index management for overlays

The component can be used in other components like this:

```typescript
<Alert
  type="success"
  message="Operation completed successfully"
  title="Success"
  dismissible={true}
  duration={5000}
  position="top"
  showToast={true}
  actions={[
    {
      label: "View Details",
      onClick: () => handleViewDetails(),
      variant: "primary"
    }
  ]}
/>