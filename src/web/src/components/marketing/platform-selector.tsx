/**
 * Human Tasks:
 * 1. Verify that all social media platform options are up-to-date with business requirements
 * 2. Test keyboard navigation and screen reader compatibility
 * 3. Validate color contrast ratios for platform options in both light and dark modes
 * 4. Ensure touch targets meet minimum size requirements on mobile devices
 */

// react v18.0.0
import React, { useCallback } from 'react';
// classnames v2.3.1
import classNames from 'classnames';

import { MarketingCampaign } from '../../types/marketing';
import { Select } from '../ui/select';
import { APP_NAME } from '../../lib/constants';

// Available social media platforms for marketing campaigns
const PLATFORM_OPTIONS = [
  { value: 'facebook', label: 'Facebook', disabled: false },
  { value: 'twitter', label: 'Twitter', disabled: false },
  { value: 'instagram', label: 'Instagram', disabled: false },
  { value: 'linkedin', label: 'LinkedIn', disabled: false },
  { value: 'youtube', label: 'YouTube', disabled: false },
  { value: 'tiktok', label: 'TikTok', disabled: false },
  { value: 'pinterest', label: 'Pinterest', disabled: false },
] as const;

interface PlatformSelectorProps {
  /** Currently selected platforms */
  selectedPlatforms: MarketingCampaign['platforms'];
  /** Callback function when platform selection changes */
  onChange: (platforms: string[]) => void;
  /** Optional CSS class name */
  className?: string;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional error message */
  error?: string;
}

/**
 * A reusable platform selector component for marketing campaigns.
 * 
 * Requirements addressed:
 * - Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
 *   Provides a user interface for selecting social media platforms for automated content distribution.
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Ensures consistent styling and behavior for platform selection across the application.
 * - Accessibility (8.1 User Interface Design/Design Specifications/Accessibility):
 *   Implements WCAG 2.1 AA compliant platform selection with keyboard navigation and screen reader support.
 */
export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onChange,
  className,
  disabled = false,
  error,
}) => {
  // Handle platform selection changes
  const handlePlatformChange = useCallback((value: string) => {
    const platform = value;
    const updatedPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    onChange(updatedPlatforms);
  }, [selectedPlatforms, onChange]);

  // Generate the placeholder text based on selection
  const getPlaceholderText = useCallback(() => {
    if (selectedPlatforms.length === 0) {
      return 'Select platforms';
    }
    if (selectedPlatforms.length === 1) {
      return '1 platform selected';
    }
    return `${selectedPlatforms.length} platforms selected`;
  }, [selectedPlatforms]);

  return (
    <div
      className={classNames(
        'platform-selector',
        'w-full',
        className
      )}
      data-testid={`${APP_NAME}-platform-selector`}
    >
      <Select
        id="platform-selector"
        name="platforms"
        options={PLATFORM_OPTIONS}
        value={selectedPlatforms[selectedPlatforms.length - 1] || ''}
        onChange={handlePlatformChange}
        placeholder={getPlaceholderText()}
        disabled={disabled}
        error={error}
        required
        aria-label="Select social media platforms"
        className={classNames(
          'w-full',
          'transition-colors duration-200',
          {
            'opacity-50 cursor-not-allowed': disabled,
          }
        )}
      />

      {/* Selected platforms display */}
      {selectedPlatforms.length > 0 && (
        <div
          className="mt-2 flex flex-wrap gap-2"
          aria-label="Selected platforms"
        >
          {selectedPlatforms.map(platform => {
            const option = PLATFORM_OPTIONS.find(opt => opt.value === platform);
            return (
              <span
                key={platform}
                className={classNames(
                  'inline-flex items-center px-2.5 py-0.5',
                  'rounded-full text-xs font-medium',
                  'bg-primary-100 text-primary-800',
                  'dark:bg-primary-900 dark:text-primary-100'
                )}
              >
                {option?.label}
                <button
                  type="button"
                  onClick={() => handlePlatformChange(platform)}
                  disabled={disabled}
                  className={classNames(
                    'ml-1.5 inline-flex items-center justify-center',
                    'w-4 h-4 rounded-full',
                    'hover:bg-primary-200 dark:hover:bg-primary-800',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                    {
                      'cursor-not-allowed': disabled,
                    }
                  )}
                  aria-label={`Remove ${option?.label}`}
                >
                  <span className="sr-only">Remove {option?.label}</span>
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};