// tailwindcss v3.3.0

/**
 * Human Tasks:
 * 1. Verify color contrast ratios meet WCAG 2.1 AA standards using a color contrast checker
 * 2. Test colors in both light and dark modes across different devices and browsers
 * 3. Validate color combinations with design team for brand consistency
 * 4. Ensure color-blind friendly alternatives are available
 */

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Primary colors for main actions and brand identity
const primary = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9', // Primary brand color
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
} as const;

// Secondary colors for supporting elements and accents
const secondary = {
  50: '#f5f3ff',
  100: '#ede9fe',
  200: '#ddd6fe',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6', // Secondary brand color
  600: '#7c3aed',
  700: '#6d28d9',
  800: '#5b21b6',
  900: '#4c1d95',
  950: '#2e1065',
} as const;

// Requirement: Theme Support (8.1 User Interface Design/Design Specifications/Theme Support)
// Neutral colors for text, backgrounds, and borders
const neutral = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712',
} as const;

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
// Utility colors for feedback, alerts, and system states
const utility = {
  success: {
    light: '#10b981', // Accessible on light backgrounds
    dark: '#34d399',  // Accessible on dark backgrounds
  },
  warning: {
    light: '#f59e0b', // Accessible on light backgrounds
    dark: '#fbbf24',  // Accessible on dark backgrounds
  },
  error: {
    light: '#ef4444', // Accessible on light backgrounds
    dark: '#f87171',  // Accessible on dark backgrounds
  },
  info: {
    light: '#3b82f6', // Accessible on light backgrounds
    dark: '#60a5fa',  // Accessible on dark backgrounds
  },
} as const;

// Main theme colors object that combines all color palettes
export const themeColors = {
  primary,
  secondary,
  neutral,
  utility,
} as const;

// Type definitions for better TypeScript support
export type ThemeColors = typeof themeColors;
export type ColorShade = keyof typeof primary | keyof typeof secondary | keyof typeof neutral;
export type UtilityColor = keyof typeof utility;
export type UtilityShade = keyof typeof utility.success;

// Color scale helper functions
export const getColorScale = (color: keyof ThemeColors, shade: ColorShade): string => {
  return themeColors[color][shade];
};

export const getUtilityColor = (color: UtilityColor, shade: UtilityShade): string => {
  return themeColors.utility[color][shade];
};