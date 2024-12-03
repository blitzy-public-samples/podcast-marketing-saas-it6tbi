/**
 * Human Tasks:
 * 1. Verify form accessibility with screen readers
 * 2. Test form validation with different input scenarios
 * 3. Validate form submission error handling
 * 4. Ensure form styling matches design system
 * 5. Test form responsiveness across different screen sizes
 */

// react v18.0.0
import React, { useState, useEffect } from 'react';

// Internal imports with relative paths
import { validateApiResponse } from '../../lib/validation';
import Input from './input';
import { Button } from './button';
import useForm from '../../hooks/use-form';

// Requirement: Form Management (8.1 User Interface Design/Interface Elements)
interface FormProps<T extends Record<string, any>> {
  // Initial form values
  initialValues: T;
  // Validation schema for form fields
  validationSchema?: {
    [K in keyof T]?: {
      required?: boolean;
      pattern?: RegExp;
      minLength?: number;
      maxLength?: number;
      validate?: (value: T[K]) => boolean | string;
      errorMessage?: string;
    };
  };
  // Form submission handler
  onSubmit: (values: T) => Promise<any>;
  // Form fields configuration
  fields: Array<{
    name: keyof T;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
  }>;
  // Submit button text
  submitText?: string;
  // Loading state override
  isLoading?: boolean;
  // Additional CSS classes
  className?: string;
  // Success callback
  onSuccess?: (data: any) => void;
  // Error callback
  onError?: (error: any) => void;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const defaultStyles = {
  form: 'space-y-6 w-full max-w-md',
  fieldGroup: 'space-y-2',
  label: 'block text-sm font-medium text-gray-700',
  error: 'mt-1 text-sm text-red-600',
  submitButton: 'w-full',
};

// Requirement: Form Management (8.1 User Interface Design/Interface Elements)
export function Form<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitText = 'Submit',
  isLoading = false,
  className = '',
  onSuccess,
  onError,
}: FormProps<T>): JSX.Element {
  // Local state for server-side errors
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize form state using useForm hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm(initialValues, validationSchema);

  // Reset server error when form values change
  useEffect(() => {
    if (serverError) {
      setServerError(null);
    }
  }, [values]);

  // Requirement: Form Management (8.1 User Interface Design/Interface Elements)
  // Handle form submission
  const submitHandler = handleSubmit(async (formValues) => {
    try {
      const response = await onSubmit(formValues);
      
      // Validate API response
      if (!validateApiResponse(response)) {
        throw new Error('Invalid API response format');
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Reset form on successful submission
      resetForm();
    } catch (error) {
      // Set server error message
      setServerError(error instanceof Error ? error.message : 'An error occurred');
      
      // Call error callback if provided
      if (onError) {
        onError(error);
      }
    }
  }, {
    onSuccess,
    onError,
    resetOnSuccess: true,
  });

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <form
      onSubmit={submitHandler}
      className={`${defaultStyles.form} ${className}`}
      noValidate
      aria-label="Form"
    >
      {/* Server-side error display */}
      {serverError && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          {serverError}
        </div>
      )}

      {/* Form fields */}
      {fields.map((field) => (
        <div key={String(field.name)} className={defaultStyles.fieldGroup}>
          <label
            htmlFor={String(field.name)}
            className={defaultStyles.label}
          >
            {field.label}
            {field.required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
          </label>

          <Input
            id={String(field.name)}
            name={String(field.name)}
            type={field.type || 'text'}
            value={values[field.name] as string}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled || isLoading || isSubmitting}
            maxLength={field.maxLength}
            minLength={field.minLength}
            pattern={field.pattern}
            error={touched[field.name] ? errors[field.name] : undefined}
            aria-invalid={touched[field.name] && !!errors[field.name]}
            aria-describedby={
              touched[field.name] && errors[field.name]
                ? `${String(field.name)}-error`
                : undefined
            }
          />

          {/* Field error message */}
          {touched[field.name] && errors[field.name] && (
            <div
              id={`${String(field.name)}-error`}
              className={defaultStyles.error}
              role="alert"
            >
              {errors[field.name]}
            </div>
          )}
        </div>
      ))}

      {/* Submit button */}
      <Button
        type="submit"
        label={submitText}
        disabled={isLoading || isSubmitting}
        loading={isLoading || isSubmitting}
        variant="primary"
        className={defaultStyles.submitButton}
        aria-disabled={isLoading || isSubmitting}
      />
    </form>
  );
}

export default Form;