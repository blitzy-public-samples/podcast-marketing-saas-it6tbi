// React v18.0.0
// Requirement: Form Management (8.1 User Interface Design/Interface Elements)
// Provides a reusable input component for capturing user data with validation support

import React, { useState, useEffect } from 'react';
import theme from '../../theme/index';
import { validateCommonError } from '../../lib/validation';

// Input component props interface
interface InputProps {
  // Input field name for form identification
  name: string;
  // Current input value
  value?: string;
  // Placeholder text when input is empty
  placeholder?: string;
  // Error message to display when validation fails
  error?: string;
  // Input type (text, password, email, etc.)
  type?: string;
  // Whether the input is required
  required?: boolean;
  // Whether the input is disabled
  disabled?: boolean;
  // Maximum length of input value
  maxLength?: number;
  // Minimum length of input value
  minLength?: number;
  // Pattern for input validation
  pattern?: string;
  // Callback function when input value changes
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Callback function when input loses focus
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  // Additional CSS classes
  className?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Default input styles using theme tokens
const defaultInputStyles = {
  base: `
    w-full
    px-${theme.spacing.component.padding}
    py-2
    border
    rounded-md
    font-${theme.typography.variants.interactive.fontFamily}
    text-${theme.typography.variants.interactive.fontSize}
    leading-${theme.typography.variants.interactive.lineHeight}
    transition-colors
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
  `,
  default: `
    border-${theme.colors.border.light}
    bg-${theme.colors.background.primary}
    text-${theme.colors.text.primary}
    placeholder-${theme.colors.text.secondary}
    focus:border-${theme.colors.primary[500]}
    focus:ring-${theme.colors.primary[400]}
  `,
  error: `
    border-${theme.colors.utility.error.light}
    bg-${theme.colors.background.primary}
    text-${theme.colors.text.primary}
    focus:border-${theme.colors.utility.error.light}
    focus:ring-${theme.colors.utility.error.light}
  `,
  disabled: `
    bg-${theme.colors.background.secondary}
    cursor-not-allowed
    opacity-75
  `
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
// Input component with accessibility and validation support
const Input: React.FC<InputProps> = ({
  name,
  value = '',
  placeholder = '',
  error,
  type = 'text',
  required = false,
  disabled = false,
  maxLength,
  minLength,
  pattern,
  onChange,
  onBlur,
  className = ''
}) => {
  // Local state for input value and validation
  const [inputValue, setInputValue] = useState<string>(value);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Update error state when error prop changes
  useEffect(() => {
    setHasError(!!error);
  }, [error]);

  // Handle input value changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange?.(event);
  };

  // Handle input blur events
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    onBlur?.(event);
  };

  // Validate error object if provided
  const isValidError = error ? validateCommonError({ code: 'VALIDATION_ERROR', message: error }) : false;

  // Combine input styles based on state
  const inputStyles = [
    defaultInputStyles.base,
    hasError ? defaultInputStyles.error : defaultInputStyles.default,
    disabled && defaultInputStyles.disabled,
    className
  ].join(' ');

  // Requirement: Form Management (8.1 User Interface Design/Interface Elements)
  // Render input with accessibility attributes and error handling
  return (
    <div className="relative w-full">
      <input
        id={name}
        name={name}
        type={type}
        value={inputValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        onChange={handleChange}
        onBlur={handleBlur}
        className={inputStyles}
        aria-invalid={hasError}
        aria-required={required}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      
      {/* Error message display */}
      {isValidError && isTouched && (
        <div
          id={`${name}-error`}
          className={`
            mt-1
            text-sm
            text-${theme.colors.utility.error.light}
            font-${theme.typography.variants.interactive.fontFamily}
          `}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;