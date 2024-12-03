/**
 * Human Tasks:
 * 1. Verify Redux DevTools configuration with development team
 * 2. Confirm middleware configuration aligns with application requirements
 * 3. Validate store persistence strategy with application architecture
 * 4. Ensure proper error tracking middleware setup
 */

// @reduxjs/toolkit v1.9.5
import { configureStore } from '@reduxjs/toolkit';

// Import reducers from slices
import authSlice, { setAuth, clearAuth } from './auth-slice';
import { episodesReducer as episodes } from './episodes-slice';
import marketingSlice from './marketing-slice';
import { analyticsReducer as analytics } from './analytics-slice';

/**
 * Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
 * Configure the Redux store with all application slices and middleware
 */
const store = configureStore({
  reducer: {
    auth: authSlice,
    episodes,
    marketing: marketingSlice,
    analytics,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure middleware options
      serializableCheck: {
        // Ignore certain action types that may contain non-serializable data
        ignoredActions: ['auth/setAuth'],
        // Ignore certain paths in the state that may contain non-serializable data
        ignoredPaths: ['auth.user'],
      },
      // Enable immutability checks in development
      immutableCheck: process.env.NODE_ENV === 'development',
      // Enable thunk middleware for async actions
      thunk: true,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export the store's dispatch and getState types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export auth actions for global usage
export { setAuth, clearAuth };

// Export the configured store as default
export default store;