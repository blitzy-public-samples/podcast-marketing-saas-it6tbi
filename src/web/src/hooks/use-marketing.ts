/**
 * Human Tasks:
 * 1. Verify API endpoints for marketing campaigns with backend team
 * 2. Confirm error handling strategies align with frontend guidelines
 * 3. Validate campaign status transitions with product team
 * 4. Ensure proper error tracking setup for marketing-related errors
 */

// react v18.0.0
import { useState, useEffect } from 'react';
// react-redux v8.0.5
import { useDispatch, useSelector } from 'react-redux';

import { MarketingCampaign } from '../types/marketing';
import { fetchData, postData } from '../lib/api';

/**
 * Requirement: Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation)
 * Custom hook for fetching marketing campaigns from the backend API.
 * Implements data fetching and state management for marketing campaigns.
 * 
 * @returns Object containing campaigns data and loading state
 */
export const useFetchMarketingCampaigns = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetchData<MarketingCampaign[]>('/marketing/campaigns');
        setCampaigns(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch marketing campaigns');
        console.error('Error fetching marketing campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    refetch: async () => {
      setLoading(true);
      try {
        const response = await fetchData<MarketingCampaign[]>('/marketing/campaigns');
        setCampaigns(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch marketing campaigns');
        console.error('Error fetching marketing campaigns:', err);
      } finally {
        setLoading(false);
      }
    }
  };
};

/**
 * Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
 * Custom hook for creating new marketing campaigns.
 * Handles campaign creation and error management.
 * 
 * @param campaignData - The marketing campaign data to be created
 * @returns Promise resolving to the created marketing campaign
 */
export const useCreateMarketingCampaign = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createCampaign = async (campaignData: Omit<MarketingCampaign, 'id'>): Promise<MarketingCampaign> => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!campaignData.title || !campaignData.content || !campaignData.platforms.length) {
        throw new Error('Missing required campaign fields');
      }

      const response = await postData<MarketingCampaign>('/marketing/campaigns', {
        ...campaignData,
        status: campaignData.status || 'draft',
        scheduleDate: campaignData.scheduleDate || new Date()
      });

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create marketing campaign';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCampaign,
    loading,
    error
  };
};

/**
 * Requirement: Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation)
 * Custom hook for managing a single marketing campaign's state and operations.
 * 
 * @param campaignId - Optional ID of the campaign to manage
 * @returns Object containing campaign data and management functions
 */
export const useMarketingCampaign = (campaignId?: string) => {
  const [campaign, setCampaign] = useState<MarketingCampaign | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (campaignId) {
      const fetchCampaign = async () => {
        try {
          setLoading(true);
          const response = await fetchData<MarketingCampaign>(`/marketing/campaigns/${campaignId}`);
          setCampaign(response.data);
          setError(null);
        } catch (err) {
          setError('Failed to fetch campaign details');
          console.error('Error fetching campaign:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchCampaign();
    }
  }, [campaignId]);

  const updateCampaign = async (
    updateData: Partial<Omit<MarketingCampaign, 'id'>>
  ): Promise<MarketingCampaign> => {
    if (!campaignId) {
      throw new Error('Campaign ID is required for updates');
    }

    try {
      setLoading(true);
      const response = await postData<MarketingCampaign>(
        `/marketing/campaigns/${campaignId}`,
        updateData
      );
      setCampaign(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = 'Failed to update campaign';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    campaign,
    loading,
    error,
    updateCampaign
  };
};