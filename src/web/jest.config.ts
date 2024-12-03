/**
 * Human Tasks:
 * 1. Verify that all test files follow the specified naming convention (*.test.ts, *.test.tsx)
 * 2. Ensure all required testing libraries are installed at the specified versions
 * 3. Validate that the moduleNameMapper paths align with the project's import structure
 * 4. Confirm that the test environment matches the project's requirements
 */

// Requirement: Frontend Testing Configuration (8.3 API Design/8.3.4 API Security Controls)
// Import required dependencies
// @ts-jest version ^29.0.0
// @testing-library/react version ^13.4.0
// jest version ^29.0.0

import type { Config } from 'jest';
import { API_BASE_URL } from './src/lib/constants';

// Jest configuration object that defines testing framework settings
const jestConfig: Config = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',

  // Set test environment to jsdom for React component testing
  testEnvironment: 'jsdom',

  // Setup files to run before tests
  setupFilesAfterEnv: [
    '<rootDir>/src/lib/constants.ts'
  ],

  // Module name mapping for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json'
    }]
  },

  // Module file extensions
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],

  // Test environment configuration
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: true
    },
    API_BASE_URL
  },

  // Mocking configuration
  resetMocks: true,
  restoreMocks: true,

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true
};

export default jestConfig;