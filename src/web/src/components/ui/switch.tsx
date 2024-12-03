/**
 * Human Tasks:
 * 1. Verify ARIA labels and roles with accessibility team
 * 2. Test keyboard navigation across different browsers
 * 3. Validate color contrast ratios in both light and dark modes
 * 4. Ensure touch targets meet minimum size requirements on mobile devices
 */

// React v18.0.0
import React, { useCallback, useRef, useEffect } from 'react';
// classnames v2.3.1
import classNames from 'classnames';

// Internal imports
import { colors, spacing } from '../../theme/index';
import '../../styles/components.css';
import { deepClone } from '../../lib/utils';
import type { CommonError } from '../../types/common';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
interface SwitchProps {
  /** Current state of the switch */
  isChecked: boolean;
  /** Callback function when switch state changes */
  onChange: (checked: boolean) => void;
  /** Optional ID for the switch element */
  id?: string;
  /** Optional label for the switch */
  label?: string;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional additional CSS classes */
  className?: string;
}

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const Switch: React.FC<SwitchProps> = ({
  isChecked,
  onChange,
  id,
  label,
  disabled = false,
  size = 'md',
  className
}) => {
  // Refs for managing focus and keyboard interactions
  const switchRef = useRef<HTMLButtonElement>(null);

  // Requirement: Theme Support (8.1 User Interface Design/Design Specifications/Theme Support)
  const switchStyles = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  // Handle switch toggle with error handling
  const handleToggle = useCallback(() => {
    if (disabled) return;

    try {
      // Deep clone the current state to avoid direct mutations
      const newState = deepClone(!isChecked);
      onChange(newState);
    } catch (error) {
      // Handle potential errors during state update
      const err = error as CommonError;
      console.error(`Switch toggle error: ${err.message}`);
    }
  }, [isChecked, onChange, disabled]);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Handle keyboard interactions
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleToggle();
    }
  }, [disabled, handleToggle]);

  // Set up focus management
  useEffect(() => {
    const switchElement = switchRef.current;
    if (!switchElement) return;

    // Add focus visible class for keyboard navigation
    const handleFocus = () => switchElement.classList.add('focus-visible');
    const handleBlur = () => switchElement.classList.remove('focus-visible');

    switchElement.addEventListener('focus', handleFocus);
    switchElement.addEventListener('blur', handleBlur);

    return () => {
      switchElement.removeEventListener('focus', handleFocus);
      switchElement.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  return (
    <div className={classNames('flex items-center', className)}>
      <button
        ref={switchRef}
        id={id}
        role="switch"
        aria-checked={isChecked}
        aria-label={label}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={classNames(
          // Base styles
          'relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
          // Size variants
          switchStyles[size].switch,
          // Theme colors
          {
            'bg-primary-600 dark:bg-primary-500': isChecked && !disabled,
            'bg-neutral-200 dark:bg-neutral-700': !isChecked && !disabled,
            'bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed': disabled
          },
          // Focus styles
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-primary-400',
          // Spacing
          'mx-2'
        )}
      >
        <span
          className={classNames(
            // Base styles
            'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
            // Size variants
            switchStyles[size].thumb,
            // Position
            {
              [switchStyles[size].translate]: isChecked,
              'translate-x-0': !isChecked,
              'opacity-50': disabled
            }
          )}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          className={classNames(
            'ml-2 text-sm font-medium',
            {
              'text-neutral-900 dark:text-neutral-100': !disabled,
              'text-neutral-500 dark:text-neutral-400 cursor-not-allowed': disabled
            }
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch;