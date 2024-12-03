/**
 * Human Tasks:
 * 1. Verify toast z-index works correctly with other UI components
 * 2. Test toast animations in different browsers for consistency
 * 3. Validate toast contrast ratios meet WCAG 2.1 AA standards
 * 4. Ensure toast messages are readable by screen readers
 * 5. Test toast behavior with different message lengths
 */

import { useState, useEffect } from 'react'; // v18.2.0
import { colors, spacing, typography } from '../../theme/index';
import { formatError } from '../../lib/utils';
import type { CommonError } from '../../types/common';

// Requirement: User Notifications (8.1 User Interface Design/Notification System)
// Toast types for different notification purposes
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast position configuration
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

// Toast configuration interface
interface ToastConfig {
  id: string;
  content: string | CommonError;
  type: ToastType;
  duration?: number;
  position?: ToastPosition;
}

// Toast props interface
interface ToastProps {
  config: ToastConfig;
  onClose: (id: string) => void;
}

// Default duration for toasts in milliseconds
const DEFAULT_DURATION = 5000;

// Default position for toasts
const DEFAULT_POSITION: ToastPosition = 'top-right';

// Toast type to theme color mapping
const toastTypeColors: Record<ToastType, string> = {
  success: colors.utility.success.light,
  error: colors.utility.error.light,
  warning: colors.utility.warning.light,
  info: colors.utility.info.light,
};

// Toast type to icon mapping
const toastTypeIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

// Requirement: User Notifications (8.1 User Interface Design/Notification System)
// Toast component for displaying notifications
export const Toast: React.FC<ToastProps> = ({ config, onClose }) => {
  const {
    id,
    content,
    type,
    duration = DEFAULT_DURATION,
    position = DEFAULT_POSITION,
  } = config;

  // Auto-dismiss effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Format content if it's an error object
  const formattedContent = typeof content === 'string' 
    ? content 
    : formatError(content);

  // Position-based styles
  const positionStyles: Record<ToastPosition, React.CSSProperties> = {
    'top-right': { top: spacing.medium, right: spacing.medium },
    'top-left': { top: spacing.medium, left: spacing.medium },
    'bottom-right': { bottom: spacing.medium, right: spacing.medium },
    'bottom-left': { bottom: spacing.medium, left: spacing.medium },
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        ...positionStyles[position],
        display: 'flex',
        alignItems: 'center',
        minWidth: '300px',
        maxWidth: '400px',
        padding: spacing.medium,
        backgroundColor: colors.background.primary,
        border: `1px solid ${toastTypeColors[type]}`,
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        animation: 'slideIn 0.3s ease-out',
        ...typography.variants.interactive,
      }}
    >
      {/* Toast icon */}
      <span
        style={{
          marginRight: spacing.small,
          color: toastTypeColors[type],
          fontSize: typography.fontSize.lg,
        }}
        aria-hidden="true"
      >
        {toastTypeIcons[type]}
      </span>

      {/* Toast content */}
      <div
        style={{
          flex: 1,
          color: colors.text.primary,
          marginRight: spacing.small,
        }}
      >
        {formattedContent}
      </div>

      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'none',
          border: 'none',
          padding: spacing.small,
          cursor: 'pointer',
          color: colors.text.secondary,
          fontSize: typography.fontSize.sm,
        }}
        aria-label="Close notification"
      >
        ×
      </button>

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

// Requirement: User Notifications (8.1 User Interface Design/Notification System)
// Hook for managing toast state
export const useToastState = () => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  // Add new toast
  const addToast = (
    content: string | CommonError,
    type: ToastType = 'info',
    duration: number = DEFAULT_DURATION,
    position: ToastPosition = DEFAULT_POSITION
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, content, type, duration, position }]);
  };

  // Remove toast by id
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
};

export default Toast;