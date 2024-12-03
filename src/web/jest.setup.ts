/**
 * Human Tasks:
 * 1. Verify that all required testing libraries are installed at the specified versions
 * 2. Ensure all mock implementations align with actual component/hook behavior
 * 3. Validate that global fetch mock configuration works with API calls
 * 4. Test mock implementations with actual test cases
 */

// @testing-library/react v13.4.0
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Import dependencies for mocking
import { handleApiResponse } from './src/lib/utils';
import { API_BASE_URL } from './src/lib/constants';
import useAuth from './src/hooks/use-auth';
import useToast from './src/hooks/use-toast';
import { Button } from './src/components/ui/button';

// Requirement: Frontend Testing Configuration (8.3 API Design/8.3.4 API Security Controls)
// Mock global fetch API
global.fetch = jest.fn();

// Mock handleApiResponse utility
jest.mock('./src/lib/utils', () => ({
  handleApiResponse: jest.fn(),
}));

// Mock API constants
jest.mock('./src/lib/constants', () => ({
  API_BASE_URL: 'http://localhost:8000/api/v1',
}));

// Requirement: Frontend Testing Configuration (8.3 API Design/8.3.4 API Security Controls)
// Mock authentication hook
jest.mock('./src/hooks/use-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: null,
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: false,
  })),
}));

// Mock toast notifications hook
jest.mock('./src/hooks/use-toast', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    toast: {
      visible: false,
      content: '',
      type: 'info',
      duration: 5000,
      position: 'top-right',
    },
    showToast: jest.fn(),
    hideToast: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  })),
}));

// Mock UI components
jest.mock('./src/components/ui/button', () => ({
  Button: jest.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )),
}));

// Requirement: Frontend Testing Configuration (8.3 API Design/8.3.4 API Security Controls)
// Global test setup
beforeAll(() => {
  // Reset all mocks before each test suite
  jest.clearAllMocks();
  
  // Configure default fetch mock response
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {
  jest.resetModules();
});

// Export setup for use in jest.config.ts
export default undefined;