/**
 * Human Tasks:
 * 1. Verify API endpoint configurations with backend team
 * 2. Confirm error handling strategies align with backend responses
 * 3. Validate state management patterns with frontend architecture team
 * 4. Ensure proper error tracking and monitoring setup
 */

// @reduxjs/toolkit v1.9.5
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Episode } from '../types/episode';
import { fetchData, postData } from '../lib/api';

/**
 * Requirement: State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
 * Interface defining the state structure for episodes management
 */
interface EpisodesState {
  items: Episode[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedEpisode: Episode | null;
}

// Initial state for the episodes slice
const initialState: EpisodesState = {
  items: [],
  status: 'idle',
  error: null,
  selectedEpisode: null,
};

/**
 * Requirement: Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management)
 * Async thunk for fetching episodes from the API
 */
export const fetchEpisodes = createAsyncThunk(
  'episodes/fetchEpisodes',
  async () => {
    const response = await fetchData<Episode[]>('/episodes');
    return response.data;
  }
);

/**
 * Requirement: Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management)
 * Async thunk for adding a new episode
 */
export const addEpisode = createAsyncThunk(
  'episodes/addEpisode',
  async (newEpisode: Omit<Episode, 'id'>) => {
    const response = await postData<Episode>('/episodes', newEpisode);
    return response.data;
  }
);

/**
 * Requirement: Type Safety (9.1 Programming Languages/Frontend)
 * Redux slice for managing podcast episodes state
 */
const episodesSlice = createSlice({
  name: 'episodes',
  initialState,
  reducers: {
    // Select an episode for editing or viewing
    setSelectedEpisode: (state, action: PayloadAction<Episode | null>) => {
      state.selectedEpisode = action.payload;
    },
    // Clear any error state
    clearError: (state) => {
      state.error = null;
    },
    // Reset the episodes state
    resetState: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      state.selectedEpisode = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fetchEpisodes states
    builder
      .addCase(fetchEpisodes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch episodes';
      })
      // Handle addEpisode states
      .addCase(addEpisode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addEpisode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addEpisode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add episode';
      });
  },
});

// Export actions and reducer
export const { setSelectedEpisode, clearError, resetState } = episodesSlice.actions;
export const { reducer: episodesReducer } = episodesSlice;

// Selector functions for accessing state
export const selectAllEpisodes = (state: { episodes: EpisodesState }) => state.episodes.items;
export const selectEpisodesStatus = (state: { episodes: EpisodesState }) => state.episodes.status;
export const selectEpisodesError = (state: { episodes: EpisodesState }) => state.episodes.error;
export const selectSelectedEpisode = (state: { episodes: EpisodesState }) => state.episodes.selectedEpisode;