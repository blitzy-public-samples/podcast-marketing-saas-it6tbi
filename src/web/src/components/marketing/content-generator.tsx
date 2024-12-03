/**
 * Human Tasks:
 * 1. Verify AI content generation rate limits with backend team
 * 2. Test accessibility of content editor with screen readers
 * 3. Validate platform-specific content length restrictions
 * 4. Ensure proper error tracking setup for content generation failures
 */

// react v18.0.0
import React, { useState, useEffect } from 'react';

// Import components and hooks
import PlatformSelector from './platform-selector';
import { Button } from '../ui/button';
import { ProgressBar } from '../ui/progress';
import { useFetchMarketingCampaigns, useCreateMarketingCampaign } from '../../hooks/use-marketing';
import type { MarketingCampaign } from '../../types/marketing';

interface ContentGeneratorProps {
  episodeId?: string;
  initialContent?: string;
  onComplete?: (campaign: MarketingCampaign) => void;
}

/**
 * Content generation interface for marketing posts.
 * 
 * Requirements addressed:
 * - Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
 *   Provides an interface for generating and managing marketing content for multi-platform post scheduling.
 * - User Interface Design (8.1 User Interface Design/Interface Elements):
 *   Implements a user-friendly and accessible interface for content creation and management.
 */
const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  episodeId,
  initialContent = '',
  onComplete
}) => {
  // State management
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [content, setContent] = useState<string>(initialContent);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks for data fetching and campaign creation
  const { campaigns, loading: campaignsLoading } = useFetchMarketingCampaigns();
  const { createCampaign, loading: createLoading, error: createError } = useCreateMarketingCampaign();

  // Reset error when platforms or content changes
  useEffect(() => {
    setError(null);
  }, [selectedPlatforms, content]);

  // Handle platform selection changes
  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
  };

  // Handle content changes
  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  // Generate content for selected platforms
  const handleGenerate = async () => {
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    try {
      setIsGenerating(true);
      setProgress(0);

      // Simulate progress updates (replace with actual AI generation progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Create a new marketing campaign
      const campaign = await createCampaign({
        title: `Campaign ${new Date().toISOString()}`,
        content,
        platforms: selectedPlatforms,
        scheduleDate: new Date(),
        status: 'draft'
      });

      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);

      // Notify parent component
      onComplete?.(campaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle content save
  const handleSave = async () => {
    if (!content) {
      setError('Please enter some content');
      return;
    }

    try {
      const campaign = await createCampaign({
        title: `Campaign ${new Date().toISOString()}`,
        content,
        platforms: selectedPlatforms,
        scheduleDate: new Date(),
        status: 'draft'
      });

      onComplete?.(campaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
      {/* Platform Selection */}
      <div className="space-y-2">
        <label 
          htmlFor="platform-selector"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
        >
          Select Platforms
        </label>
        <PlatformSelector
          selectedPlatforms={selectedPlatforms}
          onChange={handlePlatformChange}
          disabled={isGenerating}
          error={error}
        />
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <label
          htmlFor="content-editor"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
        >
          Marketing Content
        </label>
        <textarea
          id="content-editor"
          value={content}
          onChange={handleContentChange}
          disabled={isGenerating}
          className="w-full h-40 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          placeholder="Enter your marketing content here..."
        />
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="space-y-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Generating content...
          </span>
          <ProgressBar
            value={progress}
            max={100}
            className="w-full"
          />
        </div>
      )}

      {/* Error Display */}
      {(error || createError) && (
        <div className="text-sm text-error-600 dark:text-error-400">
          {error || createError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          label="Generate"
          onClick={handleGenerate}
          disabled={isGenerating || selectedPlatforms.length === 0}
          loading={isGenerating}
          variant="secondary"
        />
        <Button
          label="Save"
          onClick={handleSave}
          disabled={isGenerating || !content}
          loading={createLoading}
          variant="primary"
        />
      </div>

      {/* Recent Campaigns */}
      {campaigns.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            Recent Campaigns
          </h3>
          <div className="space-y-2">
            {campaigns.slice(0, 3).map(campaign => (
              <div
                key={campaign.id}
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md"
              >
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                  {campaign.title}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Platforms: {campaign.platforms.join(', ')}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Status: {campaign.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;