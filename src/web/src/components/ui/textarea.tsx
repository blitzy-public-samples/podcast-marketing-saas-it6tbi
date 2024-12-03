// React v18.0.0
// Requirement: Form Management (8.1 User Interface Design/Interface Elements)
// Provides a reusable textarea component for capturing multi-line user input

import React, { useState, useEffect } from 'react';
import Input from './input';
import { deepClone } from '../../lib/utils';
import theme from '../../theme/index';

// Textarea component props interface
interface TextareaProps {
  // Field name for form identification
  name: string;
  // Current textarea value
  value?: string;
  // Placeholder text when textarea is empty
  placeholder?: string;
  // Error message to display when validation fails
  error?: string;
  // Whether the textarea is required
  required?: boolean;
  // Whether the textarea is disabled
  disabled?: boolean;
  // Maximum length of textarea value
  maxLength?: number;
  // Minimum length of textarea value
  minLength?: number;
  // Number of visible text rows
  rows?: number;
  // Callback function when textarea value changes
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // Callback function when textarea loses focus
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  // Additional CSS classes
  className?: string;
  // Auto-resize textarea based on content
  autoResize?: boolean;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Default textarea styles using theme tokens
const defaultTextareaStyles = {
  base: `
    w-full
    px-${theme.spacing.component.padding}
    py-2
    border
    rounded-md
    font-${theme.typography.variants.content.fontFamily}
    text-${theme.typography.variants.content.fontSize}
    leading-${theme.typography.variants.content.lineHeight}
    transition-colors
    duration-200
    resize-none
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
// Textarea component with accessibility and validation support
const Textarea: React.FC<TextareaProps> = ({
  name,
  value = '',
  placeholder = '',
  error,
  required = false,
  disabled = false,
  maxLength,
  minLength,
  rows = 3,
  onChange,
  onBlur,
  className = '',
  autoResize = false
}) => {
  // Local state for textarea value and validation
  const [textareaValue, setTextareaValue] = useState<string>(value);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Update local state when prop value changes
  useEffect(() => {
    setTextareaValue(value);
    if (autoResize && textareaRef.current) {
      adjustHeight();
    }
  }, [value, autoResize]);

  // Update error state when error prop changes
  useEffect(() => {
    setHasError(!!error);
  }, [error]);

  // Adjust textarea height based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Handle textarea value changes
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setTextareaValue(newValue);
    
    if (autoResize) {
      adjustHeight();
    }
    
    onChange?.(event);
  };

  // Handle textarea blur events
  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsTouched(true);
    onBlur?.(event);
  };

  // Combine textarea styles based on state
  const textareaStyles = [
    defaultTextareaStyles.base,
    hasError ? defaultTextareaStyles.error : defaultTextareaStyles.default,
    disabled && defaultTextareaStyles.disabled,
    className
  ].join(' ');

  // Requirement: Form Management (8.1 User Interface Design/Interface Elements)
  // Render textarea with accessibility attributes and error handling
  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        id={name}
        name={name}
        value={textareaValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        rows={rows}
        onChange={handleChange}
        onBlur={handleBlur}
        className={textareaStyles}
        aria-invalid={hasError}
        aria-required={required}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      
      {/* Character count display when maxLength is set */}
      {maxLength && (
        <div
          className={`
            mt-1
            text-sm
            text-${theme.colors.text.secondary}
            font-${theme.typography.variants.interactive.fontFamily}
          `}
        >
          {textareaValue.length}/{maxLength}
        </div>
      )}
      
      {/* Error message display */}
      {error && isTouched && (
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

export default Textarea;