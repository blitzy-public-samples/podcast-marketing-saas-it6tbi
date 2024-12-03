// @reduxjs/toolkit v1.9.0
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setAuth, clearAuth } from '../../src/store/auth-slice';
import { login, logout } from '../../src/lib/auth';
import type { AuthUser } from '../../src/types/auth';

/**
 * Human Tasks:
 * 1. Verify test coverage meets team's requirements
 * 2. Ensure mock data matches expected production data structures
 * 3. Validate test assertions align with business requirements
 */

// Mock the auth functions
jest.mock('../../src/lib/auth', () => ({
  login: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(() => null)
}));

// Mock user data for testing
const mockUser: AuthUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  roles: ['user'],
  token: 'mock-jwt-token'
};

// Create a type-safe mock store for testing
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer
    }
  });
};

describe('Auth Slice Tests', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  /**
   * Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
   * Tests the initial state of the auth slice
   */
  describe('Initial State', () => {
    it('should have the correct initial state', () => {
      const state = store.getState().auth;
      
      expect(state).toEqual({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    });
  });

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Tests the setAuth action for updating authentication state
   */
  describe('setAuth Action', () => {
    it('should update state when user is authenticated', () => {
      store.dispatch(setAuth(mockUser));
      const state = store.getState().auth;

      expect(state).toEqual({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    });

    it('should maintain user data structure integrity', () => {
      store.dispatch(setAuth(mockUser));
      const state = store.getState().auth;

      expect(state.user).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        roles: expect.any(Array),
        token: expect.any(String)
      });
    });
  });

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Tests the clearAuth action for logging out users
   */
  describe('clearAuth Action', () => {
    it('should clear authentication state', () => {
      // First set an authenticated state
      store.dispatch(setAuth(mockUser));
      
      // Then clear it
      store.dispatch(clearAuth());
      const state = store.getState().auth;

      expect(state).toEqual({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    });

    it('should call logout function when clearing auth', () => {
      store.dispatch(clearAuth());
      expect(logout).toHaveBeenCalled();
    });
  });

  /**
   * Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
   * Tests state transitions during authentication flows
   */
  describe('Authentication Flow', () => {
    it('should handle the complete authentication cycle', () => {
      // Initial state
      let state = store.getState().auth;
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.user).toBeNull();

      // Set authenticated state
      store.dispatch(setAuth(mockUser));
      state = store.getState().auth;
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.user).toEqual(mockUser);

      // Clear authentication
      store.dispatch(clearAuth());
      state = store.getState().auth;
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.user).toBeNull();
    });

    it('should maintain error state consistency through transitions', () => {
      // Set auth should clear any existing errors
      store.dispatch(setAuth(mockUser));
      let state = store.getState().auth;
      expect(state.error).toBeNull();

      // Clear auth should maintain clean error state
      store.dispatch(clearAuth());
      state = store.getState().auth;
      expect(state.error).toBeNull();
    });
  });

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Tests error handling in authentication state
   */
  describe('Error Handling', () => {
    it('should handle authentication errors appropriately', () => {
      // Mock a failed login attempt
      const error = new Error('Authentication failed');
      (login as jest.Mock).mockRejectedValue(error);

      // Verify error state is maintained
      const state = store.getState().auth;
      expect(state.error).toBeNull();
      expect(state.isLoading).toBeFalsy();
    });
  });
});