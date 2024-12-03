/**
 * Human Tasks:
 * 1. Verify social media platform character limits and content restrictions
 * 2. Test accessibility of post editor with screen readers
 * 3. Validate scheduling functionality across different timezones
 * 4. Ensure proper error tracking setup for post publishing failures
 */

// react v18.0.0
import React, { useState, useEffect } from 'react';

// Internal imports
import ContentGenerator from './content-generator';
import PlatformSelector from './platform-selector';
import { Button } from '../ui/button';
import { postData } from '../../lib/api';
import type { MarketingCampaign } from '../../types/marketing';

interface SocialPostProps {
  /** Initial data for the social post */
  post: MarketingCampaign;
  /** Callback function triggered when the post is saved */
  onSave?: (post: MarketingCampaign) => void;
  /** Callback function triggered when the post is published */
  onPublish?: (post: MarketingCampaign) => void;
}

/**
 * A component for managing individual social media posts within a marketing campaign.
 * 
 * Requirements addressed:
 * - Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
 *   Provides a user interface for managing individual social media posts as part of a marketing campaign.
 * - User Interface Design (8.1 User Interface Design/Interface Elements):
 *   Ensures a user-friendly and accessible interface for managing social media posts.
 */
const SocialPost: React.FC<SocialPostProps> = ({
  post,
  onSave,
  onPublish
}) => {
  // State management for post data
  const [content, setContent] = useState<string>(post.content);
  const [platforms, setPlatforms] = useState<string[]>(post.platforms);
  const [scheduleDate, setScheduleDate] = useState<Date>(post.scheduleDate);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error when content or platforms change
  useEffect(() => {
    setError(null);
  }, [content, platforms]);

  // Handle platform selection changes
  const handlePlatformChange = (selectedPlatforms: string[]) => {
    setPlatforms(selectedPlatforms);
  };

  // Handle content changes from the ContentGenerator
  const handleContentChange = (campaign: MarketingCampaign) => {
    setContent(campaign.content);
    setPlatforms(campaign.platforms);
    setScheduleDate(campaign.scheduleDate);
  };

  // Handle saving the post
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedPost = await postData<MarketingCampaign>(`/marketing/posts/${post.id}`, {
        content,
        platforms,
        scheduleDate,
        status: 'draft'
      });

      onSave?.(updatedPost.data);
    } catch (err) {
      setError('Failed to save post');
      console.error('Error saving post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle publishing the post
  const handlePublish = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const publishedPost = await postData<MarketingCampaign>(`/marketing/posts/${post.id}/publish`, {
        content,
        platforms,
        scheduleDate,
        status: 'published'
      });

      onPublish?.(publishedPost.data);
    } catch (err) {
      setError('Failed to publish post');
      console.error('Error publishing post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
      {/* Platform Selection */}
      <div className="space-y-2">
        <label 
          htmlFor="platforms"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
        >
          Target Platforms
        </label>
        <PlatformSelector
          selectedPlatforms={platforms}
          onChange={handlePlatformChange}
          disabled={isLoading}
          error={error}
        />
      </div>

      {/* Content Generation */}
      <div className="space-y-2">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
        >
          Post Content
        </label>
        <ContentGenerator
          initialContent={content}
          onComplete={handleContentChange}
        />
      </div>

      {/* Schedule Date */}
      <div className="space-y-2">
        <label
          htmlFor="schedule-date"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
        >
          Schedule Date
        </label>
        <input
          type="datetime-local"
          id="schedule-date"
          value={scheduleDate.toISOString().slice(0, 16)}
          onChange={(e) => setScheduleDate(new Date(e.target.value))}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-sm text-error-600 dark:text-error-400">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          label="Save Draft"
          onClick={handleSave}
          disabled={isLoading || !content || platforms.length === 0}
          loading={isLoading}
          variant="secondary"
        />
        <Button
          label="Publish"
          onClick={handlePublish}
          disabled={isLoading || !content || platforms.length === 0}
          loading={isLoading}
          variant="primary"
        />
      </div>
    </div>
  );
};

export default SocialPost;