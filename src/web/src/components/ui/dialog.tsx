// React v18.0.0
// classnames v2.3.1

import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { colors, spacing, typography } from '../../theme/index';
import { formatError } from '../../lib/utils';
import { Button } from './button';
import Input from './input';

/**
 * Human Tasks:
 * 1. Verify dialog animations work smoothly across browsers
 * 2. Test dialog focus management with screen readers
 * 3. Validate dialog responsiveness on mobile devices
 * 4. Ensure dialog backdrop click behavior is consistent
 * 5. Test keyboard navigation (Tab, Escape, Enter) functionality
 */

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
interface DialogProps {
  // Whether the dialog is visible
  isOpen: boolean;
  // Dialog title text
  title: string;
  // Dialog content (can be text or JSX)
  content: React.ReactNode;
  // Primary action button text
  primaryActionLabel?: string;
  // Secondary action button text
  secondaryActionLabel?: string;
  // Primary action handler
  onPrimaryAction?: () => void;
  // Secondary action handler
  onSecondaryAction?: () => void;
  // Close dialog handler
  onClose: () => void;
  // Optional CSS classes
  className?: string;
  // Dialog size variant
  size?: 'small' | 'medium' | 'large';
  // Whether dialog can be closed by clicking outside
  closeOnOutsideClick?: boolean;
  // Whether dialog shows close button
  showCloseButton?: boolean;
  // Custom styles for the dialog
  style?: React.CSSProperties;
  // Whether dialog is in loading state
  loading?: boolean;
  // Error message to display
  error?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const dialogSizes = {
  small: 'max-w-sm',
  medium: 'max-w-md',
  large: 'max-w-lg',
};

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const baseDialogStyles = {
  overlay: classnames(
    'fixed',
    'inset-0',
    'bg-black',
    'bg-opacity-50',
    'z-50',
    'flex',
    'items-center',
    'justify-center',
    'p-4'
  ),
  dialog: classnames(
    'bg-white',
    'rounded-lg',
    'shadow-xl',
    'w-full',
    'relative',
    'z-50',
    'overflow-hidden'
  ),
  header: classnames(
    'px-6',
    'py-4',
    'border-b',
    'border-gray-200',
    'flex',
    'items-center',
    'justify-between'
  ),
  title: classnames(
    'text-lg',
    'font-semibold',
    'text-gray-900'
  ),
  content: classnames(
    'px-6',
    'py-4'
  ),
  footer: classnames(
    'px-6',
    'py-4',
    'border-t',
    'border-gray-200',
    'flex',
    'items-center',
    'justify-end',
    'space-x-3'
  ),
  closeButton: classnames(
    'absolute',
    'top-4',
    'right-4',
    'text-gray-400',
    'hover:text-gray-500',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-primary-500'
  ),
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  content,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
  className,
  size = 'medium',
  closeOnOutsideClick = true,
  showCloseButton = true,
  style,
  loading = false,
  error,
}) => {
  // State for managing dialog visibility
  const [isVisible, setIsVisible] = useState<boolean>(isOpen);

  // Update visibility when isOpen prop changes
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle primary action with error handling
  const handlePrimaryAction = () => {
    if (loading || !onPrimaryAction) return;

    try {
      onPrimaryAction();
    } catch (error) {
      console.error(formatError(error));
    }
  };

  // Combine dialog styles
  const dialogClasses = classnames(
    baseDialogStyles.dialog,
    dialogSizes[size],
    className
  );

  // Don't render if dialog is not visible
  if (!isVisible) return null;

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div
      className={baseDialogStyles.overlay}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={dialogClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-content"
        style={style}
      >
        {/* Dialog Header */}
        <div className={baseDialogStyles.header}>
          <h2 id="dialog-title" className={baseDialogStyles.title}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              className={baseDialogStyles.closeButton}
              onClick={onClose}
              aria-label="Close dialog"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Dialog Content */}
        <div id="dialog-content" className={baseDialogStyles.content}>
          {content}
          {error && (
            <div
              className="mt-2 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
        </div>

        {/* Dialog Footer */}
        {(primaryActionLabel || secondaryActionLabel) && (
          <div className={baseDialogStyles.footer}>
            {secondaryActionLabel && (
              <Button
                label={secondaryActionLabel}
                onClick={onSecondaryAction}
                variant="secondary"
                disabled={loading}
              />
            )}
            {primaryActionLabel && (
              <Button
                label={primaryActionLabel}
                onClick={handlePrimaryAction}
                variant="primary"
                loading={loading}
                disabled={loading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;