/**
 * Human Tasks:
 * 1. Verify form validation rules with product team
 * 2. Test form accessibility with screen readers
 * 3. Ensure form styling matches design system
 * 4. Validate file upload size limits with backend team
 */

// react v18.0.0
import React, { useState, useEffect } from 'react';

// Internal imports
import { Episode } from '../../types/episode';
import { postData } from '../../lib/api';
import Form from '../ui/form';
import Input from '../ui/input';
import { Button } from '../ui/button';

// Form field validation schema
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
  audioUrl: {
    required: true,
    pattern: /^https?:\/\/.+/,
    errorMessage: 'Please provide a valid audio URL'
  },
  duration: {
    required: true,
    validate: (value: number) => value > 0,
    errorMessage: 'Duration must be greater than 0'
  }
};

interface EpisodeFormProps {
  // Initial episode data for editing, optional for creation
  initialValues?: Partial<Episode>;
  // Callback function after successful submission
  onSubmit?: (episode: Episode) => void;
  // Loading state
  isLoading?: boolean;
  // Additional CSS classes
  className?: string;
}

/**
 * EpisodeForm component for creating and editing podcast episodes.
 * 
 * Requirements addressed:
 * - Form Management (8.1 User Interface Design/Interface Elements)
 * - API Design (8.3 API Design/8.3.2 Interface Specifications)
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
 * - Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
 */
const EpisodeForm: React.FC<EpisodeFormProps> = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
  className = ''
}) => {
  // Default form values
  const defaultValues: Partial<Episode> = {
    title: '',
    description: '',
    audioUrl: '',
    duration: 0,
    publishDate: new Date(),
    ...initialValues
  };

  // Form fields configuration
  const formFields = [
    {
      name: 'title',
      label: 'Episode Title',
      type: 'text',
      placeholder: 'Enter episode title',
      required: true,
      maxLength: 100
    },
    {
      name: 'description',
      label: 'Episode Description',
      type: 'textarea',
      placeholder: 'Enter episode description',
      required: true,
      maxLength: 5000
    },
    {
      name: 'audioUrl',
      label: 'Audio URL',
      type: 'url',
      placeholder: 'https://',
      required: true
    },
    {
      name: 'duration',
      label: 'Duration (seconds)',
      type: 'number',
      placeholder: '0',
      required: true,
      min: 1
    },
    {
      name: 'publishDate',
      label: 'Publish Date',
      type: 'datetime-local',
      required: true
    }
  ];

  // Handle form submission
  const handleSubmit = async (values: Partial<Episode>) => {
    try {
      // Determine if this is a create or update operation
      const endpoint = initialValues?.id 
        ? `/api/v1/episodes/${initialValues.id}`
        : '/api/v1/episodes';

      // Submit form data to API
      const response = await postData<Episode>(endpoint, values);

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(response.data);
      }

      return response;
    } catch (error) {
      // Re-throw error to be handled by Form component
      throw error;
    }
  };

  return (
    <Form
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      fields={formFields}
      submitText={initialValues?.id ? 'Update Episode' : 'Create Episode'}
      isLoading={isLoading}
      className={`max-w-2xl mx-auto ${className}`}
      onSuccess={(data) => {
        // Additional success handling if needed
        console.log('Episode saved successfully:', data);
      }}
      onError={(error) => {
        // Additional error handling if needed
        console.error('Error saving episode:', error);
      }}
    />
  );
};

export default EpisodeForm;