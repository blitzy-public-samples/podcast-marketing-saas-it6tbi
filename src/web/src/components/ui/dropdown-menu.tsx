/**
 * Human Tasks:
 * 1. Verify dropdown menu keyboard navigation behavior with accessibility team
 * 2. Test dropdown menu positioning with different viewport sizes
 * 3. Validate dropdown menu styling with design system guidelines
 * 4. Ensure proper ARIA attributes implementation with screen readers
 */

// react v18.2.0
import { useState, useEffect } from 'react';

// Internal imports
import { colors, spacing } from '../../theme/index';
import { formatError } from '../../lib/utils';
import useToast from '../../hooks/use-toast';
import type { CommonError } from '../../types/common';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Component Library)
interface DropdownOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  onSelect: (value: string) => void;
  label?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: CommonError | string;
  className?: string;
  position?: 'left' | 'right';
  width?: string;
}

// Requirement: Reusability (1.3 Scope/Core Features and Functionalities/User Management)
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  onSelect,
  label,
  defaultValue,
  disabled = false,
  error,
  className = '',
  position = 'left',
  width = '200px',
}) => {
  // State for managing dropdown visibility and selected option
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | undefined>(
    options.find(opt => opt.value === defaultValue)
  );
  
  // Toast notifications for error handling
  const toast = useToast();

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-menu')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    try {
      setSelectedOption(option);
      onSelect(option.value);
      setIsOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to select option';
      toast.error(typeof error === 'string' ? error : formatError(error as CommonError));
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case 'Space':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
    <div 
      className={`dropdown-menu ${className}`}
      style={{ 
        position: 'relative',
        width,
      }}
    >
      {/* Label */}
      {label && (
        <label
          className="dropdown-label"
          style={{
            display: 'block',
            marginBottom: spacing.small,
            color: colors.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          {label}
        </label>
      )}

      {/* Dropdown trigger button */}
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? 'dropdown-label' : undefined}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          padding: spacing.small,
          border: `1px solid ${error ? colors.utility.error.light : colors.border.medium}`,
          borderRadius: '4px',
          backgroundColor: disabled ? colors.background.secondary : colors.background.primary,
          color: disabled ? colors.text.secondary : colors.text.primary,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{selectedOption?.label || 'Select an option'}</span>
        <span style={{ marginLeft: spacing.small }}>▼</span>
      </button>

      {/* Dropdown options list */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label={label || 'Options'}
          style={{
            position: 'absolute',
            top: '100%',
            [position]: 0,
            width: '100%',
            maxHeight: '250px',
            overflowY: 'auto',
            margin: `${spacing.small} 0`,
            padding: `${spacing.small} 0`,
            backgroundColor: colors.background.primary,
            border: `1px solid ${colors.border.medium}`,
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          {options.map((option) => (
            <li
              key={option.id}
              role="option"
              aria-selected={option.value === selectedOption?.value}
              onClick={() => handleSelect(option)}
              style={{
                padding: spacing.small,
                cursor: option.disabled ? 'not-allowed' : 'pointer',
                backgroundColor: option.value === selectedOption?.value 
                  ? colors.background.accent 
                  : 'transparent',
                color: option.disabled 
                  ? colors.text.secondary 
                  : colors.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.small,
              }}
            >
              {option.icon && <span>{option.icon}</span>}
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {error && (
        <div
          role="alert"
          style={{
            color: colors.utility.error.light,
            fontSize: '0.875rem',
            marginTop: spacing.small,
          }}
        >
          {typeof error === 'string' ? error : formatError(error)}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
```

This implementation:

1. Creates a reusable dropdown menu component with support for custom styling, keyboard navigation, and error handling
2. Implements accessibility features including ARIA attributes and keyboard navigation
3. Uses theme tokens for consistent styling
4. Includes error handling with toast notifications
5. Supports icons, disabled states, and custom positioning
6. Handles outside clicks to close the dropdown
7. Provides proper TypeScript types and interfaces
8. Uses proper relative imports for dependencies
9. Includes human tasks for testing and validation
10. Addresses the UI Consistency, Accessibility, and Reusability requirements from the technical specification

The component can be used like this:
```typescript
const MyComponent = () => {
  const options = [
    { id: '1', label: 'Option 1', value: 'opt1' },
    { id: '2', label: 'Option 2', value: 'opt2', disabled: true },
    { id: '3', label: 'Option 3', value: 'opt3', icon: '🔧' },
  ];

  const handleSelect = (value: string) => {
    console.log('Selected:', value);
  };

  return (
    <DropdownMenu
      options={options}
      onSelect={handleSelect}
      label="Select an option"
      error={error}
      position="left"
      width="250px"
    />
  );
};