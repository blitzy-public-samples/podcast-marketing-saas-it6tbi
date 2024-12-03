/**
 * Human Tasks:
 * 1. Verify analytics data structure with backend team
 * 2. Confirm error handling strategies for analytics API calls
 * 3. Validate analytics state management requirements with product team
 * 4. Ensure proper error tracking setup for analytics-related errors
 */

// @reduxjs/toolkit v1.9.5
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsResponse } from '../types/analytics';
import { fetchData } from '../lib/api';

/**
 * Requirement: Analytics Data Representation (8.3 API Design/8.3.2 Interface Specifications)
 * Interface defining the structure of the analytics state in Redux
 */
interface AnalyticsState {
  data: AnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

/**
 * Initial state for the analytics slice
 */
const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Requirement: Frontend State Management (9.1 Programming Languages/Frontend)
 * Async thunk for fetching analytics data from the backend API
 */
export const fetchAnalytics = createAsyncThunk<
  AnalyticsResponse,
  string,
  { rejectValue: string }
>(
  'analytics/fetchAnalytics',
  async (endpoint: string, { rejectWithValue }) => {
    try {
      const response = await fetchData<AnalyticsResponse>(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.error?.message || 'Failed to fetch analytics data'
      );
    }
  }
);

/**
 * Requirement: Frontend State Management (9.1 Programming Languages/Frontend)
 * Redux slice for managing analytics state
 */
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    /**
     * Clears the analytics data from the state
     */
    clearAnalytics: (state) => {
      state.data = null;
      state.error = null;
      state.lastUpdated = null;
    },
    
    /**
     * Updates a specific analytics metric in the state
     */
    updateMetric: (state, action: PayloadAction<{ 
      metric: string;
      value: number;
      timestamp: string;
    }>) => {
      if (state.data?.data) {
        const metricIndex = state.data.data.findIndex(
          item => item.metric === action.payload.metric
        );
        
        if (metricIndex !== -1) {
          state.data.data[metricIndex] = action.payload;
        } else {
          state.data.data.push(action.payload);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for analytics fetch
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful analytics fetch
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      // Handle failed analytics fetch
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while fetching analytics data';
        state.lastUpdated = Date.now();
      });
  },
});

// Export actions and reducer
export const { clearAnalytics, updateMetric } = analyticsSlice.actions;
export const analyticsReducer = analyticsSlice.reducer;

// Selector functions for accessing analytics state
export const selectAnalyticsData = (state: { analytics: AnalyticsState }) => 
  state.analytics.data;
export const selectAnalyticsLoading = (state: { analytics: AnalyticsState }) => 
  state.analytics.loading;
export const selectAnalyticsError = (state: { analytics: AnalyticsState }) => 
  state.analytics.error;
export const selectAnalyticsLastUpdated = (state: { analytics: AnalyticsState }) => 
  state.analytics.lastUpdated;