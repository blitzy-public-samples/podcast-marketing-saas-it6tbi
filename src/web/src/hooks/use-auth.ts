/**
 * Human Tasks:
 * 1. Verify error handling strategies with the team
 * 2. Confirm authentication state persistence requirements
 * 3. Validate token refresh mechanism with backend team
 * 4. Test authentication flows across different user roles
 */

// react v18.0.0
import { useState, useEffect } from 'react';
// react-redux v8.0.0
import { useDispatch, useSelector } from 'react-redux';

import { login, logout, getCurrentUser } from '../lib/auth';
import authSlice from '../store/auth-slice';
import { AuthUser, LoginCredentials } from '../types/auth';
import axiosInstance from '../lib/axios';

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Custom React hook for managing user authentication state and operations
 * 
 * Requirement: Frontend Architecture (1.2 System Overview/High-Level Description/Frontend Architecture)
 * Provides a centralized authentication interface for React components
 */
const useAuth = () => {
  // Local state for managing user data
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Redux dispatch and state access
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Handles user login by authenticating credentials and updating state
   */
  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Authenticate user
      const authenticatedUser = await login(credentials);

      // Update Redux store
      dispatch(authSlice.actions.setAuth(authenticatedUser));

      // Update local state
      setUser(authenticatedUser);

      // Configure axios instance with new token
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authenticatedUser.token}`;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      dispatch(authSlice.actions.setError(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Handles user logout by clearing authentication state
   */
  const handleLogout = (): void => {
    try {
      // Clear authentication state
      logout();
      
      // Update Redux store
      dispatch(authSlice.actions.clearAuth());
      
      // Clear local state
      setUser(null);
      setError(null);
      
      // Remove authorization header
      delete axiosInstance.defaults.headers.common['Authorization'];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      dispatch(authSlice.actions.setError(errorMessage));
    }
  };

  /**
   * Requirement: Frontend Architecture (1.2 System Overview/High-Level Description/Frontend Architecture)
   * Synchronizes authentication state on component mount and state changes
   */
  useEffect(() => {
    const syncAuthState = () => {
      const currentUser = getCurrentUser();
      
      if (currentUser && !user) {
        setUser(currentUser);
        dispatch(authSlice.actions.setAuth(currentUser));
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${currentUser.token}`;
      } else if (!currentUser && user) {
        handleLogout();
      }
    };

    // Initial sync
    syncAuthState();

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes('auth_token')) {
        syncAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch, user]);

  return {
    user,
    loading: loading || authState.isLoading,
    error: error || authState.error,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!user
  };
};

export default useAuth;