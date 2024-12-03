/**
 * Human Tasks:
 * 1. Verify API endpoints for marketing campaigns with backend team
 * 2. Confirm error handling strategies align with frontend standards
 * 3. Validate state structure with marketing feature requirements
 * 4. Ensure proper error tracking and monitoring setup
 */

// @reduxjs/toolkit v1.9.5
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MarketingCampaign } from '../types/marketing';
import { fetchData, postData } from '../lib/api';

// Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
interface MarketingState {
  campaigns: MarketingCampaign[];
  loading: boolean;
  error: string | null;
  selectedCampaign: MarketingCampaign | null;
}

const initialState: MarketingState = {
  campaigns: [],
  loading: false,
  error: null,
  selectedCampaign: null,
};

// Requirement: Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation)
export const fetchMarketingCampaigns = createAsyncThunk(
  'marketing/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchData<MarketingCampaign[]>('/marketing/campaigns');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error?.message || 'Failed to fetch marketing campaigns');
    }
  }
);

// Requirement: Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation)
export const createMarketingCampaign = createAsyncThunk(
  'marketing/createCampaign',
  async (campaignData: Omit<MarketingCampaign, 'id'>, { rejectWithValue }) => {
    try {
      const response = await postData<MarketingCampaign>(
        '/marketing/campaigns',
        campaignData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error?.message || 'Failed to create marketing campaign');
    }
  }
);

// Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
export const marketingSlice = createSlice({
  name: 'marketing',
  initialState,
  reducers: {
    // Select a campaign for editing or viewing details
    setSelectedCampaign: (state, action: PayloadAction<MarketingCampaign | null>) => {
      state.selectedCampaign = action.payload;
    },
    // Clear any error messages
    clearError: (state) => {
      state.error = null;
    },
    // Update a campaign's status locally
    updateCampaignStatus: (
      state,
      action: PayloadAction<{ id: string; status: MarketingCampaign['status'] }>
    ) => {
      const campaign = state.campaigns.find(c => c.id === action.payload.id);
      if (campaign) {
        campaign.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    // Handle fetch marketing campaigns
    builder
      .addCase(fetchMarketingCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketingCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchMarketingCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    // Handle create marketing campaign
      .addCase(createMarketingCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMarketingCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.push(action.payload);
      })
      .addCase(createMarketingCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const {
  setSelectedCampaign,
  clearError,
  updateCampaignStatus,
} = marketingSlice.actions;

export default marketingSlice.reducer;