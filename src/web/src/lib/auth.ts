/**
 * Human Tasks:
 * 1. Verify JWT token expiration settings with security team
 * 2. Confirm refresh token rotation strategy with backend team
 * 3. Validate token storage mechanism with security requirements
 * 4. Ensure proper CORS configuration for authentication endpoints
 */

// jwt-decode v3.1.2
import jwtDecode from 'jwt-decode';
import { AuthUser, LoginCredentials } from '../types/auth';
import axiosInstance from './axios';
import { APP_NAME } from './constants';

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Handles user login by sending credentials to the backend and storing the returned tokens.
 */
export const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    
    // Extract tokens from response
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Store tokens securely in localStorage
    localStorage.setItem(`${APP_NAME}_access_token`, accessToken);
    localStorage.setItem(`${APP_NAME}_refresh_token`, refreshToken);
    
    // Return the authenticated user
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      token: accessToken
    };
  } catch (error) {
    console.error(`[${APP_NAME}] Login Error:`, error);
    throw error;
  }
};

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Logs out the user by clearing tokens from local storage.
 */
export const logout = (): void => {
  try {
    // Remove all auth-related tokens
    localStorage.removeItem(`${APP_NAME}_access_token`);
    localStorage.removeItem(`${APP_NAME}_refresh_token`);
    
    // Clear any cached user data
    localStorage.removeItem(`${APP_NAME}_user`);
  } catch (error) {
    console.error(`[${APP_NAME}] Logout Error:`, error);
    throw error;
  }
};

/**
 * Requirement: API Design (8.3 API Design/8.3.2 Interface Specifications)
 * Retrieves the currently authenticated user by decoding the stored access token.
 */
export const getCurrentUser = (): AuthUser | null => {
  try {
    // Get the access token from storage
    const token = localStorage.getItem(`${APP_NAME}_access_token`);
    
    if (!token) {
      return null;
    }
    
    // Decode the JWT token
    const decodedToken = jwtDecode<{
      sub: string;
      email: string;
      roles: string[];
      exp: number;
    }>(token);
    
    // Check if token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      logout();
      return null;
    }
    
    // Return the user information from the decoded token
    return {
      id: decodedToken.sub,
      email: decodedToken.email,
      roles: decodedToken.roles,
      token
    };
  } catch (error) {
    console.error(`[${APP_NAME}] Get Current User Error:`, error);
    // Clear invalid tokens
    logout();
    return null;
  }
};