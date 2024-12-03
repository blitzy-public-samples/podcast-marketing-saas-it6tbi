/**
 * Human Tasks:
 * 1. Verify that the APP_NAME matches the official branding guidelines
 * 2. Confirm the list of SUPPORTED_LANGUAGES with the localization team
 * 3. Ensure theme constants are properly integrated with the design system
 * 4. Validate error handling constants with the backend team
 */

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Import theme configuration for consistent styling
import { theme } from '../theme/index';

// Requirement: Type Safety (9.1 Programming Languages/Frontend)
// Import common error interface for type-safe error handling
import { CommonError } from '../types/common';

// Application-wide constants
export const APP_NAME = 'Podcast Marketing Automation';

// Internationalization constants
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'] as const;

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Re-export theme configuration for consistent usage across the application
export const {
  colors,
  spacing,
  typography
} = theme;

// Type definitions for better TypeScript support
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Requirement: Type Safety (9.1 Programming Languages/Frontend)
// Re-export common error interface for standardized error handling
export type { CommonError };

// Type guard to check if a language code is supported
export const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};