/**
 * Human Tasks:
 * 1. Verify ARIA labels and roles meet accessibility standards
 * 2. Test keyboard navigation functionality
 * 3. Validate dropdown positioning across different viewport sizes
 * 4. Ensure color contrast ratios meet WCAG 2.1 AA standards
 * 5. Test focus management with screen readers
 */

// react v18.0.0
import React, { useState, useRef, useCallback, useEffect } from 'react';
// classnames v2.3.1
import classNames from 'classnames';

import { colors, spacing, typography } from '../../theme/index';
import { deepClone } from '../../lib/utils';
import { APP_NAME } from '../../lib/constants';
import '../../styles/components.css';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

// Requirement: Reusable Components (8.1 User Interface Design/Interface Elements)
// Implements a reusable Select component with consistent styling and behavior
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  required = false,
  name,
  id,
  className,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  // Apply consistent styling using theme tokens
  const selectClasses = classNames(
    'form-select',
    'relative w-full',
    {
      'opacity-50 cursor-not-allowed': disabled,
      'border-error-light dark:border-error-dark': error,
    },
    className
  );

  const selectedOption = options.find(opt => opt.value === value);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Implement keyboard navigation and ARIA attributes
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            onChange(option.value);
            setIsOpen(false);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : prev
          );
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [disabled, isOpen, focusedIndex, options, onChange]);

  // Handle option selection
  const handleOptionSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={selectRef}
      className={selectClasses}
      data-testid={`${APP_NAME}-select`}
    >
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id || name}-options`}
        aria-label={ariaLabel || placeholder}
        aria-required={required}
        aria-invalid={!!error}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={classNames(
          'flex items-center justify-between',
          'px-3 py-2 w-full',
          'bg-white dark:bg-neutral-800',
          'border rounded-md',
          'focus:outline-none focus:ring-2',
          {
            'cursor-pointer': !disabled,
            'border-neutral-300 dark:border-neutral-600': !error,
            'border-error-light dark:border-error-dark': error,
            'ring-primary-500': !error && isOpen,
            'ring-error-light dark:ring-error-dark': error && isOpen,
          }
        )}
      >
        <span
          className={classNames(
            'block truncate',
            {
              'text-neutral-500 dark:text-neutral-400': !selectedOption,
              'text-neutral-900 dark:text-neutral-100': selectedOption,
            }
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="pointer-events-none">
          <svg
            className={classNames(
              'h-5 w-5 transition-transform',
              {
                'rotate-180': isOpen,
                'text-neutral-400 dark:text-neutral-500': !error,
                'text-error-light dark:text-error-dark': error,
              }
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {isOpen && (
        <ul
          ref={optionsRef}
          id={`${id || name}-options`}
          role="listbox"
          aria-label={`${ariaLabel || placeholder} options`}
          className={classNames(
            'absolute z-10 w-full mt-1',
            'max-h-60 overflow-auto',
            'bg-white dark:bg-neutral-800',
            'border border-neutral-300 dark:border-neutral-600',
            'rounded-md shadow-lg',
            'focus:outline-none'
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              onClick={() => handleOptionSelect(option)}
              className={classNames(
                'px-3 py-2',
                {
                  'bg-primary-50 dark:bg-primary-900': focusedIndex === index,
                  'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700': !option.disabled,
                  'cursor-not-allowed opacity-50': option.disabled,
                  'text-neutral-900 dark:text-neutral-100': !option.disabled,
                  'text-neutral-400 dark:text-neutral-500': option.disabled,
                }
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p
          className="mt-1 text-sm text-error-light dark:text-error-dark"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};