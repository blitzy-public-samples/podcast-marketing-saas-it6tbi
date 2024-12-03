/**
 * Human Tasks:
 * 1. Verify campaign status transitions with product team
 * 2. Test accessibility of campaign editing interface
 * 3. Validate platform-specific content length restrictions
 * 4. Ensure proper error tracking for campaign management failures
 */

// react v18.0.0
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Internal imports
import ContentGenerator from '../../../../components/marketing/content-generator';
import PostPreview from '../../../../components/marketing/post-preview';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { useMarketingCampaign, useCreateMarketingCampaign } from '../../../../hooks/use-marketing';
import type { MarketingCampaign } from '../../../../types/marketing';

/**
 * Marketing campaign detail page component that allows users to view, edit, and manage
 * a specific marketing campaign.
 * 
 * Requirements addressed:
 * - Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
 *   Provides a detailed interface for managing individual marketing campaigns, including
 *   editing and scheduling.
 * - User Interface Design (8.1 User Interface Design/Interface Elements):
 *   Ensures a user-friendly and accessible interface for managing marketing campaigns.
 */
export default function MarketingCampaignPage() {
  // Get campaign ID from route parameters
  const { id } = useParams<{ id: string }>();

  // State management
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks for campaign management
  const {
    campaign,
    loading: campaignLoading,
    error: campaignError,
    updateCampaign
  } = useMarketingCampaign(id);

  const {
    createCampaign,
    loading: createLoading,
    error: createError
  } = useCreateMarketingCampaign();

  // Handle campaign updates
  const handleCampaignUpdate = async (updatedCampaign: Partial<MarketingCampaign>) => {
    try {
      setError(null);
      await updateCampaign(updatedCampaign);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update campaign');
      console.error('Campaign update error:', err);
    }
  };

  // Handle campaign publishing
  const handlePublish = async () => {
    if (!campaign) return;

    try {
      setError(null);
      await updateCampaign({
        ...campaign,
        status: 'published'
      });
    } catch (err) {
      setError('Failed to publish campaign');
      console.error('Campaign publish error:', err);
    }
  };

  // Handle campaign scheduling
  const handleSchedule = async (date: Date) => {
    if (!campaign) return;

    try {
      setError(null);
      await updateCampaign({
        ...campaign,
        scheduleDate: date,
        status: 'scheduled'
      });
    } catch (err) {
      setError('Failed to schedule campaign');
      console.error('Campaign schedule error:', err);
    }
  };

  if (campaignLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <Card
        title="Error"
        description="Failed to load marketing campaign"
        variant="outlined"
        className="m-4"
      >
        <p className="text-error-600 dark:text-error-400">
          {campaignError || 'Campaign not found'}
        </p>
        <Button
          label="Go Back"
          onClick={() => window.history.back()}
          variant="secondary"
          className="mt-4"
        />
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Campaign Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {campaign.title}
        </h1>
        <div className="flex space-x-4">
          <Button
            label={isEditing ? 'Cancel' : 'Edit'}
            onClick={() => setIsEditing(!isEditing)}
            variant="secondary"
          />
          {campaign.status === 'draft' && (
            <>
              <Button
                label="Schedule"
                onClick={() => handleSchedule(new Date())}
                variant="secondary"
                disabled={createLoading}
              />
              <Button
                label="Publish"
                onClick={handlePublish}
                variant="primary"
                disabled={createLoading}
              />
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {(error || createError) && (
        <div className="bg-error-50 dark:bg-error-900 text-error-600 dark:text-error-400 p-4 rounded-md">
          {error || createError}
        </div>
      )}

      {/* Campaign Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Editor */}
        <div className="space-y-6">
          {isEditing ? (
            <ContentGenerator
              initialContent={campaign.content}
              onComplete={(updatedCampaign) => {
                handleCampaignUpdate(updatedCampaign);
              }}
            />
          ) : (
            <Card
              title="Campaign Content"
              description="Current marketing campaign content and settings"
              variant="default"
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-800 p-4 rounded-md">
                  {campaign.content}
                </pre>
              </div>
            </Card>
          )}
        </div>

        {/* Campaign Preview */}
        <div>
          <PostPreview
            campaign={campaign}
            onEdit={() => setIsEditing(true)}
            onConfirm={handlePublish}
          />
        </div>
      </div>
    </div>
  );
}