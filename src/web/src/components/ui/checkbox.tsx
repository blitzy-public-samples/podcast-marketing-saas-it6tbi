/**
 * Human Tasks:
 * 1. Verify checkbox accessibility with screen readers
 * 2. Test checkbox states in different browsers and devices
 * 3. Validate checkbox contrast ratios meet WCAG 2.1 AA standards
 * 4. Ensure checkbox animations work smoothly across browsers
 */

// react v18.0.0
import React, { useState, useEffect } from 'react';

// Internal imports with relative paths
import { colors, spacing } from '../../theme/index';
import { deepClone } from '../../lib/utils';
import Form from './form';

// Requirement: Form Management (8.1 User Interface Design/Interface Elements)
interface CheckboxProps {
  // Unique identifier for the checkbox
  id?: string;
  // Checkbox label text
  label?: string;
  // Checked state
  checked?: boolean;
  // Change handler function
  onChange?: (checked: boolean) => void;
  // Whether the checkbox is required
  required?: boolean;
  // Whether the checkbox is disabled
  disabled?: boolean;
  // Error message to display
  error?: string;
  // Additional CSS classes
  className?: string;
  // Name attribute for form submission
  name?: string;
  // ARIA label for accessibility
  ariaLabel?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const checkboxStyles = {
  container: `
    inline-flex
    items-center
    gap-${spacing.component.gap}
    cursor-pointer
    select-none
    ${spacing.component.padding}
  `,
  input: `
    relative
    w-4
    h-4
    border
    rounded
    transition-all
    duration-200
    ease-in-out
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
  `,
  label: `
    text-${colors.text.primary}
    font-medium
    leading-5
    cursor-pointer
  `,
  disabled: `
    opacity-50
    cursor-not-allowed
  `,
  error: `
    border-${colors.utility.error.light}
    focus:border-${colors.utility.error.light}
    focus:ring-${colors.utility.error.light}
  `,
  checked: `
    bg-${colors.primary[600]}
    border-${colors.primary[600]}
  `,
  unchecked: `
    bg-${colors.background.primary}
    border-${colors.border.medium}
  `,
  errorMessage: `
    mt-1
    text-sm
    text-${colors.utility.error.light}
  `,
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked = false,
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
  name,
  ariaLabel,
}) => {
  // Local state for checkbox
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  // Update local state when prop changes
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  // Handle checkbox change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Create a deep clone of the current state to avoid mutation
    const newChecked = deepClone(!isChecked);
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  // Generate unique ID if not provided
  const checkboxId = id || `checkbox-${name || Math.random().toString(36).substr(2, 9)}`;

  // Combine checkbox styles based on state
  const inputClasses = `
    ${checkboxStyles.input}
    ${isChecked ? checkboxStyles.checked : checkboxStyles.unchecked}
    ${disabled ? checkboxStyles.disabled : ''}
    ${error ? checkboxStyles.error : ''}
  `;

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={checkboxId}
        className={`
          ${checkboxStyles.container}
          ${disabled ? checkboxStyles.disabled : ''}
        `}
      >
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-label={ariaLabel || label}
          aria-invalid={!!error}
          aria-required={required}
          aria-disabled={disabled}
        />
        
        {/* Checkmark icon for checked state */}
        {isChecked && (
          <svg
            className="absolute w-4 h-4 text-white pointer-events-none"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3333 4L6 11.3333L2.66667 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {label && (
          <span className={checkboxStyles.label}>
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </span>
        )}
      </label>

      {/* Error message */}
      {error && (
        <div
          className={checkboxStyles.errorMessage}
          role="alert"
          id={`${checkboxId}-error`}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Checkbox;