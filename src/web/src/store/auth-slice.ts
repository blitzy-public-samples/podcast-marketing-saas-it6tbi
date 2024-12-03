/**
 * Human Tasks:
 * 1. Verify Redux store configuration with the team's state management patterns
 * 2. Ensure proper error handling strategies for authentication failures
 * 3. Validate token storage security measures with the security team
 * 4. Confirm authentication state persistence requirements with product team
 */

// @reduxjs/toolkit v1.9.0
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, logout, getCurrentUser } from '../lib/auth';
import { AuthUser } from '../types/auth';

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Interface defining the authentication state structure in the Redux store
 */
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Initial state for the authentication slice
 */
const initialState: AuthState = {
  user: getCurrentUser(), // Initialize with current user from token if available
  isAuthenticated: !!getCurrentUser(),
  isLoading: false,
  error: null,
};

/**
 * Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
 * Redux slice for managing authentication state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets the loading state during authentication operations
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null;
    },

    /**
     * Updates the authentication state with user data after successful login
     */
    setAuth: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Clears the authentication state after logout
     */
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      logout(); // Clear tokens from storage
    },

    /**
     * Sets error state when authentication operations fail
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

// Export actions for use in components and thunks
export const { setLoading, setAuth, clearAuth, setError } = authSlice.actions;

/**
 * Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
 * Async thunk for handling user login
 */
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const user = await login({ email, password });
    dispatch(setAuth(user));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Login failed'));
  }
};

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Async thunk for handling user logout
 */
export const logoutUser = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearAuth());
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Logout failed'));
  }
};

// Export the reducer as default
export default authSlice.reducer;