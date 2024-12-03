// @testing-library/react-hooks v7.0.0
import { renderHook, act } from '@testing-library/react-hooks';
// jest v29.0.0
import { jest } from '@jest/globals';
// redux-mock-store v1.5.4
import configureStore from 'redux-mock-store';

import useAuth from '../../hooks/use-auth';
import { login, logout } from '../../lib/auth';
import authSlice from '../../store/auth-slice';
import type { AuthUser } from '../../types/auth';

// Mock the modules
jest.mock('../../lib/auth');
jest.mock('../../store/auth-slice');

/**
 * Human Tasks:
 * 1. Verify test coverage meets team's requirements
 * 2. Ensure all edge cases are properly tested
 * 3. Validate error handling test scenarios
 * 4. Confirm mock implementations match production behavior
 */

describe('useAuth Hook', () => {
  // Mock store setup
  const mockStore = configureStore([]);
  let store: any;

  // Mock user data
  const mockUser: AuthUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    roles: ['user'],
    token: 'mock-jwt-token'
  };

  // Mock credentials
  const mockCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Initialize mock store with default state
    store = mockStore({
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    });

    // Mock store dispatch
    jest.spyOn(store, 'dispatch');

    // Mock Redux hooks
    jest.mock('react-redux', () => ({
      useDispatch: () => store.dispatch,
      useSelector: (selector: any) => selector(store.getState())
    }));
  });

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Tests the initial state of the useAuth hook
   */
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toEqual({
      user: null,
      loading: false,
      error: null,
      login: expect.any(Function),
      logout: expect.any(Function),
      isAuthenticated: false
    });
  });

  /**
   * Requirement: Frontend Architecture (1.2 System Overview/High-Level Description/Frontend Architecture)
   * Tests successful login functionality
   */
  it('should handle successful login', async () => {
    // Mock successful login
    (login as jest.Mock).mockResolvedValueOnce(mockUser);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login(mockCredentials);
    });

    // Verify auth state updates
    expect(login).toHaveBeenCalledWith(mockCredentials);
    expect(store.dispatch).toHaveBeenCalledWith(
      authSlice.actions.setAuth(mockUser)
    );
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Tests login error handling
   */
  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials';
    (login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login(mockCredentials);
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      authSlice.actions.setError(errorMessage)
    );
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isAuthenticated).toBe(false);
  });

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Tests successful logout functionality
   */
  it('should handle successful logout', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      result.current.logout();
    });

    expect(logout).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      authSlice.actions.clearAuth()
    );
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
  });

  /**
   * Requirement: Frontend Architecture (1.2 System Overview/High-Level Description/Frontend Architecture)
   * Tests loading state during authentication operations
   */
  it('should set loading state during authentication operations', async () => {
    (login as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockUser), 100))
    );

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login(mockCredentials);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.loading).toBe(false);
  });

  /**
   * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
   * Tests authentication state synchronization
   */
  it('should synchronize authentication state with localStorage', () => {
    // Mock getCurrentUser to return a user
    const getCurrentUser = jest.requireMock('../../lib/auth').getCurrentUser;
    getCurrentUser.mockReturnValueOnce(mockUser);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      authSlice.actions.setAuth(mockUser)
    );
  });

  /**
   * Requirement: Frontend Architecture (1.2 System Overview/High-Level Description/Frontend Architecture)
   * Tests cleanup of event listeners
   */
  it('should clean up storage event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useAuth());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function)
    );
  });
});