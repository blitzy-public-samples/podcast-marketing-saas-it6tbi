// React v18.0.0
// classnames v2.3.1

import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { colors, spacing, typography } from '../../theme/index';
import { formatError } from '../../lib/utils';
import Dialog from './dialog';

/**
 * Human Tasks:
 * 1. Verify sheet animations work smoothly across browsers
 * 2. Test sheet focus management with screen readers
 * 3. Validate sheet responsiveness on mobile devices
 * 4. Ensure sheet backdrop click behavior is consistent
 * 5. Test keyboard navigation (Tab, Escape) functionality
 */

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
interface SheetProps {
  // Whether the sheet is visible
  isOpen: boolean;
  // Sheet title text
  title: string;
  // Sheet content (can be text or JSX)
  content: React.ReactNode;
  // Close sheet handler
  onClose: () => void;
  // Optional CSS classes
  className?: string;
  // Sheet position
  position?: 'left' | 'right' | 'top' | 'bottom';
  // Sheet size
  size?: 'small' | 'medium' | 'large';
  // Whether sheet can be closed by clicking outside
  closeOnOutsideClick?: boolean;
  // Whether sheet shows close button
  showCloseButton?: boolean;
  // Custom styles for the sheet
  style?: React.CSSProperties;
  // Whether sheet is in loading state
  loading?: boolean;
  // Error message to display
  error?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const sheetSizes = {
  small: {
    left: 'w-64',
    right: 'w-64',
    top: 'h-1/4',
    bottom: 'h-1/4',
  },
  medium: {
    left: 'w-80',
    right: 'w-80',
    top: 'h-1/2',
    bottom: 'h-1/2',
  },
  large: {
    left: 'w-96',
    right: 'w-96',
    top: 'h-3/4',
    bottom: 'h-3/4',
  },
};

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const baseSheetStyles = {
  overlay: classnames(
    'fixed',
    'inset-0',
    'bg-black',
    'bg-opacity-50',
    'z-50',
    'flex'
  ),
  sheet: classnames(
    'bg-white',
    'shadow-xl',
    'fixed',
    'z-50',
    'overflow-hidden',
    'transition-transform',
    'duration-300',
    'ease-in-out'
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
    'py-4',
    'h-full',
    'overflow-y-auto'
  ),
  closeButton: classnames(
    'text-gray-400',
    'hover:text-gray-500',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-primary-500'
  ),
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  title,
  content,
  onClose,
  className,
  position = 'right',
  size = 'medium',
  closeOnOutsideClick = true,
  showCloseButton = true,
  style,
  loading = false,
  error,
}) => {
  // State for managing sheet visibility and animation
  const [isVisible, setIsVisible] = useState<boolean>(isOpen);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Update visibility when isOpen prop changes
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      // Allow animation to complete
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      setIsAnimating(true);
      // Wait for animation before hiding
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300);
    }
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

  // Calculate sheet position styles
  const getPositionStyles = () => {
    const positions = {
      left: {
        left: 0,
        top: 0,
        bottom: 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      },
      right: {
        right: 0,
        top: 0,
        bottom: 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      },
      top: {
        top: 0,
        left: 0,
        right: 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
      },
      bottom: {
        bottom: 0,
        left: 0,
        right: 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
      },
    };

    return positions[position];
  };

  // Combine sheet styles
  const sheetClasses = classnames(
    baseSheetStyles.sheet,
    sheetSizes[size][position],
    className
  );

  // Don't render if sheet is not visible
  if (!isVisible) return null;

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div
      className={baseSheetStyles.overlay}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={sheetClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        aria-describedby="sheet-content"
        style={{
          ...style,
          ...getPositionStyles(),
        }}
      >
        {/* Sheet Header */}
        <div className={baseSheetStyles.header}>
          <h2 id="sheet-title" className={baseSheetStyles.title}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              className={baseSheetStyles.closeButton}
              onClick={onClose}
              aria-label="Close sheet"
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

        {/* Sheet Content */}
        <div id="sheet-content" className={baseSheetStyles.content}>
          {content}
          {error && (
            <div
              className="mt-2 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {formatError({ code: 'SHEET_ERROR', message: error })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sheet;