// tailwindcss v3.3.0

/**
 * Human Tasks:
 * 1. Verify font choices with design team for brand alignment
 * 2. Test font rendering across different browsers and operating systems
 * 3. Validate font loading performance and implement font loading strategies
 * 4. Ensure custom fonts are properly licensed for web use
 * 5. Test font scaling behavior across different viewport sizes
 */

import { themeColors } from './colors';
import { spacingScale } from './spacing';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Font families with fallbacks for consistent cross-platform rendering
const fontFamilies = {
  primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  secondary: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", Consolas, Monaco, "Andale Mono", monospace',
} as const;

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
// Font size scale with responsive values using rem units
const fontSizes = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
} as const;

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Font weights for different text styles
const fontWeights = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
// Line heights optimized for readability and WCAG compliance
const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

// Requirement: Theme Support (8.1 User Interface Design/Design Specifications/Theme Support)
// Typography styles for different text elements with theme color integration
export const typographyStyles = {
  fontFamily: {
    ...fontFamilies,
    // Default text elements
    body: fontFamilies.primary,
    heading: fontFamilies.secondary,
    code: fontFamilies.mono,
  },
  fontSize: {
    ...fontSizes,
    // Common text elements with responsive sizes
    body: fontSizes.base,
    bodySmall: fontSizes.sm,
    bodyLarge: fontSizes.lg,
    heading1: fontSizes['5xl'],
    heading2: fontSizes['4xl'],
    heading3: fontSizes['3xl'],
    heading4: fontSizes['2xl'],
    heading5: fontSizes.xl,
    heading6: fontSizes.lg,
  },
  fontWeight: {
    ...fontWeights,
    // Semantic weights for text elements
    bodyRegular: fontWeights.regular,
    bodyMedium: fontWeights.medium,
    headingBold: fontWeights.bold,
    buttonWeight: fontWeights.semibold,
    linkWeight: fontWeights.medium,
  },
  lineHeight: {
    ...lineHeights,
    // Optimized line heights for different text blocks
    body: lineHeights.normal,
    heading: lineHeights.tight,
    code: lineHeights.snug,
    // Compact line height for UI elements
    button: lineHeights.none,
  },
  // Typography utility styles
  utils: {
    // Text colors using theme color tokens
    textPrimary: themeColors.primary[900],
    textSecondary: themeColors.secondary[700],
    // Letter spacing utilities
    tracking: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
    // Paragraph spacing using spacing scale
    paragraphSpacing: {
      small: spacingScale.small,
      medium: spacingScale.medium,
    },
  },
} as const;

// Type definitions for better TypeScript support
export type TypographyStyles = typeof typographyStyles;
export type FontFamily = keyof typeof fontFamilies;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;

// Typography utility types for component props
export interface TypographyProps {
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  lineHeight?: LineHeight;
}