/**
 * Human Tasks:
 * 1. Verify social media platform preview layouts with design team
 * 2. Test preview rendering across different viewport sizes
 * 3. Validate accessibility of preview interactions
 * 4. Ensure proper error tracking for preview-related issues
 */

// react v18.0.0
import React, { useState, useEffect } from 'react';

// Internal imports
import ContentGenerator from './content-generator';
import PlatformSelector from './platform-selector';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import type { MarketingCampaign } from '../../types/marketing';

interface PostPreviewProps {
  /** The marketing campaign to preview */
  campaign: MarketingCampaign;
  /** Callback function triggered when editing is requested */
  onEdit?: () => void;
  /** Callback function triggered when the preview is confirmed */
  onConfirm?: () => void;
}

/**
 * A preview component for marketing posts that allows users to validate content
 * and platform selections before publishing.
 * 
 * Requirements addressed:
 * - Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
 *   Provides a preview interface for validating marketing content and platform selections
 *   before publishing.
 * - User Interface Design (8.1 User Interface Design/Interface Elements):
 *   Ensures a user-friendly and accessible interface for previewing marketing posts.
 */
const PostPreview: React.FC<PostPreviewProps> = ({
  campaign,
  onEdit,
  onConfirm
}) => {
  // State for tracking preview status
  const [isPreviewValid, setIsPreviewValid] = useState<boolean>(false);

  // Validate preview content and platforms when campaign changes
  useEffect(() => {
    const validatePreview = () => {
      const hasContent = campaign.content.trim().length > 0;
      const hasPlatforms = campaign.platforms.length > 0;
      setIsPreviewValid(hasContent && hasPlatforms);
    };

    validatePreview();
  }, [campaign]);

  // Format the schedule date for display
  const formatScheduleDate = (date: Date): string => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Get the status badge color based on campaign status
  const getStatusBadgeColor = (status: MarketingCampaign['status']): string => {
    const statusColors = {
      draft: 'bg-neutral-100 text-neutral-800',
      scheduled: 'bg-primary-100 text-primary-800',
      published: 'bg-success-100 text-success-800'
    };
    return statusColors[status] || statusColors.draft;
  };

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card
        title="Marketing Post Preview"
        description="Review your marketing content and platform selections before publishing."
        className="w-full"
      >
        {/* Campaign Status */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
              campaign.status
            )}`}
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>

        {/* Content Preview */}
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Content
            </h4>
            <div className="mt-1 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
              <p className="whitespace-pre-wrap">{campaign.content}</p>
            </div>
          </div>

          {/* Platform Selection Display */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Selected Platforms
            </h4>
            <div className="flex flex-wrap gap-2">
              {campaign.platforms.map(platform => (
                <span
                  key={platform}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Schedule Information */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Scheduled For
            </h4>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {formatScheduleDate(campaign.scheduleDate)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <Button
            label="Edit"
            onClick={onEdit}
            variant="secondary"
            size="medium"
          />
          <Button
            label="Confirm"
            onClick={onConfirm}
            variant="primary"
            size="medium"
            disabled={!isPreviewValid}
          />
        </div>
      </Card>

      {/* Platform-Specific Previews */}
      {campaign.platforms.map(platform => (
        <Card
          key={platform}
          title={`${platform} Preview`}
          description="Preview how your content will appear on this platform."
          className="w-full"
        >
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
            {/* Platform-specific content formatting */}
            <div className="space-y-2">
              {platform.toLowerCase() === 'twitter' && (
                <p className="text-sm">
                  {campaign.content.slice(0, 280)}
                  {campaign.content.length > 280 && '...'}
                </p>
              )}
              {platform.toLowerCase() === 'linkedin' && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{campaign.content}</p>
                </div>
              )}
              {platform.toLowerCase() === 'facebook' && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{campaign.content}</p>
                </div>
              )}
              {platform.toLowerCase() === 'instagram' && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">
                    {campaign.content}
                    {'\n\n'}
                    {/* Common Instagram hashtags */}
                    #podcast #marketing #contentcreator
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PostPreview;