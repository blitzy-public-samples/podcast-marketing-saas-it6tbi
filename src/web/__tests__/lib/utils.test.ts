// jest v29.0.0

/**
 * Human Tasks:
 * 1. Verify that test cases cover all edge cases and error scenarios
 * 2. Ensure test coverage meets project requirements
 * 3. Validate test assertions with the development team
 */

import { formatError, isAppNameValid, deepClone } from '../../src/lib/utils';
import { APP_NAME } from '../../src/lib/constants';
import { validateCommonError } from '../../src/lib/validation';

/**
 * Requirements addressed:
 * - Code Quality (9.5 Development & Deployment/9.5.1 Development Environment):
 *   Tests ensure utility functions work correctly and maintain reliability
 */
describe('formatError', () => {
  it('should format error object with code and message correctly', () => {
    const error = {
      code: 'ERR_001',
      message: 'Test error message'
    };
    const expected = 'Error [ERR_001]: Test error message';
    expect(formatError(error)).toBe(expected);
  });

  it('should handle empty strings in error object', () => {
    const error = {
      code: '',
      message: ''
    };
    const expected = 'Error []: ';
    expect(formatError(error)).toBe(expected);
  });

  it('should preserve special characters in error message', () => {
    const error = {
      code: 'ERR_002',
      message: 'Error with [special] {characters} & symbols!'
    };
    const expected = 'Error [ERR_002]: Error with [special] {characters} & symbols!';
    expect(formatError(error)).toBe(expected);
  });
});

/**
 * Requirements addressed:
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Validates application name handling with proper type checking
 */
describe('isAppNameValid', () => {
  it('should return true for valid app name matching APP_NAME', () => {
    expect(isAppNameValid(APP_NAME)).toBe(true);
  });

  it('should return false for invalid app name', () => {
    expect(isAppNameValid('Invalid App Name')).toBe(false);
  });

  it('should be case sensitive in comparison', () => {
    expect(isAppNameValid(APP_NAME.toLowerCase())).toBe(false);
    expect(isAppNameValid(APP_NAME.toUpperCase())).toBe(false);
  });

  it('should handle empty string', () => {
    expect(isAppNameValid('')).toBe(false);
  });
});

/**
 * Requirements addressed:
 * - Code Quality (9.5 Development & Deployment/9.5.1 Development Environment):
 *   Ensures deep cloning functionality works correctly for complex objects
 */
describe('deepClone', () => {
  it('should create a deep copy of a nested object', () => {
    const original = {
      id: 1,
      user: {
        name: 'Test User',
        settings: {
          theme: 'dark',
          notifications: true
        }
      },
      tags: ['test', 'demo']
    };

    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.user).not.toBe(original.user);
    expect(cloned.user.settings).not.toBe(original.user.settings);
    expect(cloned.tags).not.toBe(original.tags);
  });

  it('should handle arrays correctly', () => {
    const original = [1, [2, 3], { value: 4 }];
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[1]).not.toBe(original[1]);
    expect(cloned[2]).not.toBe(original[2]);
  });

  it('should handle primitive values', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('test')).toBe('test');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('should preserve Date objects', () => {
    const original = { date: new Date() };
    const cloned = deepClone(original);
    expect(cloned.date).toEqual(original.date);
    expect(cloned.date).not.toBe(original.date);
  });
});

/**
 * Requirements addressed:
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Validates error object structure conforms to CommonError interface
 */
describe('validateCommonError', () => {
  it('should validate a valid CommonError object', () => {
    const error = {
      code: 'ERR_001',
      message: 'Test error message'
    };
    expect(validateCommonError(error)).toBe(true);
  });

  it('should reject objects missing required properties', () => {
    expect(validateCommonError({ code: 'ERR_001' })).toBe(false);
    expect(validateCommonError({ message: 'Test message' })).toBe(false);
    expect(validateCommonError({})).toBe(false);
  });

  it('should reject objects with incorrect property types', () => {
    expect(validateCommonError({ code: 123, message: 'Test' })).toBe(false);
    expect(validateCommonError({ code: 'ERR_001', message: 123 })).toBe(false);
  });

  it('should reject non-object values', () => {
    expect(validateCommonError(null)).toBe(false);
    expect(validateCommonError(undefined)).toBe(false);
    expect(validateCommonError('error')).toBe(false);
    expect(validateCommonError(123)).toBe(false);
  });
});