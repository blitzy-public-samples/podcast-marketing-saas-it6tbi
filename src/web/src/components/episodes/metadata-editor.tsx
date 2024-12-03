/**
 * Human Tasks:
 * 1. Verify form validation rules with product team
 * 2. Test date picker functionality across browsers
 * 3. Confirm error message formatting with design team
 * 4. Validate accessibility of form controls with screen readers
 */

// react v18.0.0
import React, { useState, useEffect } from 'react';

// Internal imports with relative paths
import { Episode } from '../../types/episode';
import { validateApiResponse } from '../../lib/validation';
import Input from '../ui/input';
import { Button } from '../ui/button';
import useForm from '../../hooks/use-form';

// Props interface for the MetadataEditor component
interface MetadataEditorProps {
  episode: Episode;
  onSubmit: (updatedEpisode: Partial<Episode>) => Promise<void>;
}

// Validation schema for episode metadata form
const validationSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    errorMessage: 'Title must be between 3 and 100 characters'
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    errorMessage: 'Description must be between 10 and 5000 characters'
  },
  publishDate: {
    required: true,
    validate: (value: string) => {
      const date = new Date(value);
      return !isNaN(date.getTime()) || 'Invalid date format';
    }
  }
};

/**
 * MetadataEditor component for editing podcast episode metadata.
 * 
 * Requirements addressed:
 * - Form Management (8.1 User Interface Design/Interface Elements):
 *   Implements structured form interface for editing episode metadata
 * - Data Validation (8.3 API Design/8.3.2 Interface Specifications):
 *   Ensures metadata conforms to expected formats before submission
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Maintains consistent styling and behavior for form elements
 */
const MetadataEditor: React.FC<MetadataEditorProps> = ({ episode, onSubmit }) => {
  // Initialize form state with episode data
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useForm(
    {
      title: episode.title,
      description: episode.description,
      publishDate: episode.publishDate.toISOString().split('T')[0]
    },
    validationSchema
  );

  // Track form submission status
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when episode prop changes
  useEffect(() => {
    resetForm();
  }, [episode.id]);

  // Handle form submission
  const submitForm = handleSubmit(
    async (formValues) => {
      setSubmitError(null);
      
      const updatedEpisode: Partial<Episode> = {
        title: formValues.title,
        description: formValues.description,
        publishDate: new Date(formValues.publishDate)
      };

      await onSubmit(updatedEpisode);
    },
    {
      onError: (error) => {
        setSubmitError(error.message);
      }
    }
  );

  return (
    <form 
      onSubmit={submitForm}
      className="space-y-6"
      noValidate
    >
      {/* Title input */}
      <div className="space-y-2">
        <Input
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title ? errors.title : undefined}
          placeholder="Episode Title"
          required
          maxLength={100}
          aria-label="Episode title"
        />
      </div>

      {/* Description input */}
      <div className="space-y-2">
        <Input
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description ? errors.description : undefined}
          placeholder="Episode Description"
          required
          maxLength={5000}
          aria-label="Episode description"
        />
      </div>

      {/* Publish date input */}
      <div className="space-y-2">
        <Input
          name="publishDate"
          type="date"
          value={values.publishDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.publishDate ? errors.publishDate : undefined}
          required
          aria-label="Publish date"
        />
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          label="Cancel"
          onClick={resetForm}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="primary"
          label="Save Changes"
          loading={isSubmitting}
          disabled={isSubmitting || Object.keys(errors).length > 0}
        />
      </div>

      {/* Submit error message */}
      {submitError && (
        <div 
          className="mt-4 p-4 bg-red-50 text-red-700 rounded-md"
          role="alert"
        >
          {submitError}
        </div>
      )}
    </form>
  );
};

export default MetadataEditor;