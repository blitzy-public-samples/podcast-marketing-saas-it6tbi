/**
 * Human Tasks:
 * 1. Verify social media platform API credentials are properly configured
 * 2. Test accessibility of marketing dashboard with screen readers
 * 3. Validate campaign scheduling across different timezones
 * 4. Ensure proper error tracking setup for content generation failures
 */

// react v18.0.0
'use client';
import { useState, useEffect } from 'react';

// Internal component imports
import ContentGenerator from '../../../components/marketing/content-generator';
import PlatformSelector from '../../../components/marketing/platform-selector';
import PostPreview from '../../../components/marketing/post-preview';
import ScheduleCalendar from '../../../components/marketing/schedule-calendar';
import SocialPost from '../../../components/marketing/social-post';

// Types
import type { MarketingCampaign } from '../../../types/marketing';

/**
 * Marketing dashboard page component that integrates various marketing automation features.
 * 
 * Requirements addressed:
 * - Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
 *   Provides a comprehensive dashboard for managing marketing campaigns, including content
 *   generation, scheduling, and analytics.
 * - User Interface Design (8.1 User Interface Design/Interface Elements):
 *   Ensures a user-friendly and accessible interface for managing marketing campaigns.
 */
const MarketingDashboardPage = () => {
  // State for managing the current campaign
  const [currentCampaign, setCurrentCampaign] = useState<MarketingCampaign | null>(null);
  
  // State for managing selected platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  
  // State for managing preview mode
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Handle platform selection changes
  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
    if (currentCampaign) {
      setCurrentCampaign({
        ...currentCampaign,
        platforms
      });
    }
  };

  // Handle content generation completion
  const handleContentGenerated = (campaign: MarketingCampaign) => {
    setCurrentCampaign(campaign);
    setIsPreviewMode(true);
  };

  // Handle preview edit request
  const handlePreviewEdit = () => {
    setIsPreviewMode(false);
  };

  // Handle preview confirmation
  const handlePreviewConfirm = () => {
    if (currentCampaign) {
      // Reset states after confirmation
      setCurrentCampaign(null);
      setSelectedPlatforms([]);
      setIsPreviewMode(false);
    }
  };

  // Handle social post updates
  const handlePostUpdate = (updatedPost: MarketingCampaign) => {
    setCurrentCampaign(updatedPost);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketing Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Marketing Dashboard
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Generate, schedule, and manage your marketing campaigns across multiple platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Content Generation and Platform Selection */}
          <div className="lg:col-span-8 space-y-6">
            {!isPreviewMode ? (
              <>
                {/* Content Generator Section */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Content Generator
                    </h2>
                    <ContentGenerator
                      onComplete={handleContentGenerated}
                      initialContent={currentCampaign?.content}
                    />
                  </div>
                </div>

                {/* Platform Selector Section */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Target Platforms
                    </h2>
                    <PlatformSelector
                      selectedPlatforms={selectedPlatforms}
                      onChange={handlePlatformChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Post Preview Section */
              currentCampaign && (
                <PostPreview
                  campaign={currentCampaign}
                  onEdit={handlePreviewEdit}
                  onConfirm={handlePreviewConfirm}
                />
              )
            )}
          </div>

          {/* Right Column - Schedule Calendar and Active Posts */}
          <div className="lg:col-span-4 space-y-6">
            {/* Schedule Calendar Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Campaign Schedule
                </h2>
                <ScheduleCalendar />
              </div>
            </div>

            {/* Active Social Posts Section */}
            {currentCampaign && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Active Campaign
                  </h2>
                  <SocialPost
                    post={currentCampaign}
                    onSave={handlePostUpdate}
                    onPublish={handlePostUpdate}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboardPage;