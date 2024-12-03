// React v18.0.0
// tailwindcss v3.3.0

import React from 'react';
import { Dialog } from './dialog';
import { Button } from './button';
import Input from './input';

// Human Tasks:
// 1. Verify alert dialog animations with screen readers
// 2. Test keyboard navigation (Tab, Escape, Enter)
// 3. Validate alert dialog responsiveness on mobile devices
// 4. Ensure alert dialog meets WCAG 2.1 AA contrast requirements

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
interface AlertDialogProps {
  // Whether the alert dialog is visible
  isOpen: boolean;
  // Alert dialog title
  title: string;
  // Alert dialog message content
  message: React.ReactNode;
  // Primary action button text
  confirmLabel?: string;
  // Secondary action button text
  cancelLabel?: string;
  // Primary action handler
  onConfirm?: () => void;
  // Secondary action handler
  onCancel?: () => void;
  // Whether to show input field
  showInput?: boolean;
  // Input field placeholder
  inputPlaceholder?: string;
  // Input field value
  inputValue?: string;
  // Input field change handler
  onInputChange?: (value: string) => void;
  // Whether alert is in loading state
  loading?: boolean;
  // Additional CSS classes
  className?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const defaultProps: Partial<AlertDialogProps> = {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  showInput: false,
  loading: false,
  className: '',
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = defaultProps.confirmLabel,
  cancelLabel = defaultProps.cancelLabel,
  onConfirm,
  onCancel,
  showInput = defaultProps.showInput,
  inputPlaceholder,
  inputValue,
  onInputChange,
  loading = defaultProps.loading,
  className = defaultProps.className,
}) => {
  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange?.(event.target.value);
  };

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  const alertContent = (
    <div className="space-y-4">
      {/* Alert message */}
      <div className="text-gray-700 dark:text-gray-300">
        {message}
      </div>

      {/* Optional input field */}
      {showInput && (
        <div className="mt-4">
          <Input
            name="alert-input"
            value={inputValue}
            placeholder={inputPlaceholder}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full"
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        {cancelLabel && (
          <Button
            label={cancelLabel}
            onClick={onCancel}
            variant="secondary"
            disabled={loading}
            className="min-w-[100px]"
          />
        )}
        {confirmLabel && (
          <Button
            label={confirmLabel}
            onClick={onConfirm}
            variant="primary"
            loading={loading}
            disabled={loading}
            className="min-w-[100px]"
          />
        )}
      </div>
    </div>
  );

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <Dialog
      isOpen={isOpen}
      title={title}
      content={alertContent}
      onClose={onCancel}
      className={`max-w-md mx-auto ${className}`}
      closeOnOutsideClick={!loading}
      showCloseButton={!loading}
    />
  );
};

export default AlertDialog;