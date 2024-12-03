/**
 * Custom React hook for managing form state and validation logic.
 * 
 * Requirements addressed:
 * - Form Management (8.1 User Interface Design/Interface Elements):
 *   Provides reusable form state management and validation capabilities.
 * - Code Reusability (1.3 Scope/Core Features and Functionalities/User Management):
 *   Implements common form operations as a reusable hook to reduce code duplication.
 */

// react v18.0.0
import { useState, useEffect } from 'react';

// Internal imports with relative paths
import { validateApiResponse } from '../lib/validation';
import { formatError } from '../lib/utils';
import type { CommonError } from '../types/common';

/**
 * Interface for validation schema object
 */
interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    validate?: (value: any) => boolean | string;
    errorMessage?: string;
  };
}

/**
 * Interface for form errors object
 */
interface FormErrors {
  [key: string]: string;
}

/**
 * Interface for form state object
 */
interface FormState {
  [key: string]: any;
}

/**
 * Interface for form submission options
 */
interface SubmitOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: CommonError) => void;
  resetOnSuccess?: boolean;
}

/**
 * Custom hook for form state management and validation
 * 
 * @param initialValues - Initial form state values
 * @param validationSchema - Schema for form validation rules
 * @returns Object containing form state, errors, and handler functions
 */
const useForm = (
  initialValues: FormState,
  validationSchema?: ValidationSchema
) => {
  // Initialize form state with provided initial values
  const [values, setValues] = useState<FormState>(initialValues);
  
  // Initialize form errors state
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Track if form has been touched
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  
  // Track form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates a single form field
   * 
   * @param name - Field name
   * @param value - Field value
   * @returns Error message if validation fails, empty string otherwise
   */
  const validateField = (name: string, value: any): string => {
    if (!validationSchema || !validationSchema[name]) {
      return '';
    }

    const rules = validationSchema[name];

    // Required field validation
    if (rules.required && (!value || value.length === 0)) {
      return rules.errorMessage || 'This field is required';
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.errorMessage || 'Invalid format';
    }

    // Minimum length validation
    if (rules.minLength && value.length < rules.minLength) {
      return rules.errorMessage || `Minimum length is ${rules.minLength}`;
    }

    // Maximum length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.errorMessage || `Maximum length is ${rules.maxLength}`;
    }

    // Custom validation function
    if (rules.validate) {
      const result = rules.validate(value);
      if (typeof result === 'string') {
        return result;
      }
      if (!result) {
        return rules.errorMessage || 'Invalid value';
      }
    }

    return '';
  };

  /**
   * Validates all form fields
   * 
   * @returns Object containing validation errors
   */
  const validateForm = (): FormErrors => {
    if (!validationSchema) {
      return {};
    }

    const formErrors: FormErrors = {};
    
    Object.keys(validationSchema).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        formErrors[fieldName] = error;
      }
    });

    return formErrors;
  };

  /**
   * Handles input change events
   * 
   * @param event - Change event from form input
   */
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true
    }));

    // Validate field on change if schema exists
    if (validationSchema) {
      const error = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error
      }));
    }
  };

  /**
   * Handles form blur events
   * 
   * @param event - Blur event from form input
   */
  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name } = event.target;
    
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true
    }));

    // Validate field on blur if schema exists
    if (validationSchema) {
      const error = validateField(name, values[name]);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error
      }));
    }
  };

  /**
   * Handles form submission
   * 
   * @param callback - Async function to handle form submission
   * @param options - Submission options for success/error handling
   */
  const handleSubmit = (
    callback: (values: FormState) => Promise<any>,
    options: SubmitOptions = {}
  ) => async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    // Validate all fields before submission
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await callback(values);
      
      // Validate API response
      if (!validateApiResponse(response)) {
        throw new Error('Invalid API response');
      }

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      if (options.resetOnSuccess) {
        setValues(initialValues);
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      const formattedError = formatError(error as CommonError);
      
      if (options.onError) {
        options.onError(error as CommonError);
      }
      
      setErrors((prevErrors) => ({
        ...prevErrors,
        submit: formattedError
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = (): void => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  /**
   * Set form values programmatically
   * 
   * @param newValues - New form values to set
   */
  const setFormValues = (newValues: FormState): void => {
    setValues(newValues);
  };

  // Validate form when validation schema changes
  useEffect(() => {
    if (validationSchema) {
      const formErrors = validateForm();
      setErrors(formErrors);
    }
  }, [validationSchema]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues
  };
};

export default useForm;