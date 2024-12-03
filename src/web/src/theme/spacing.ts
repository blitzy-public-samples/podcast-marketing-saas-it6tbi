// tailwindcss v3.3.0

/**
 * Human Tasks:
 * 1. Validate spacing values with design team for consistency across breakpoints
 * 2. Test spacing scale across different viewport sizes and devices
 * 3. Verify spacing values meet minimum touch target sizes for accessibility
 * 4. Ensure spacing scale integrates properly with the design system's grid layout
 */

import { themeColors } from './colors';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Base spacing unit in pixels - used as a foundation for the spacing scale
const BASE_SPACING = 4;

// Spacing multipliers for consistent scaling
const MULTIPLIERS = {
  small: 2, // 8px
  medium: 4, // 16px
  large: 8, // 32px
} as const;

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
// Spacing scale with responsive values that maintain consistent ratios
export const spacingScale = {
  // Small spacing for tight layouts and compact components
  small: `${BASE_SPACING * MULTIPLIERS.small}px`,
  
  // Medium spacing for standard component spacing and layout gaps
  medium: `${BASE_SPACING * MULTIPLIERS.medium}px`,
  
  // Large spacing for section divisions and major layout components
  large: `${BASE_SPACING * MULTIPLIERS.large}px`,
} as const;

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
// Utility spacing values for specific accessibility requirements
export const accessibleSpacing = {
  // Minimum touch target size (44x44px) as per WCAG 2.1
  touchTarget: '44px',
  
  // Minimum spacing between interactive elements
  interactiveGap: spacingScale.medium,
  
  // Focus outline offset using primary color reference
  focusOffset: `4px solid ${themeColors.primary[400]}`,
  
  // Secondary element spacing using secondary color reference
  secondaryGap: `calc(${spacingScale.small} + ${2}px)`,
} as const;

// Type definitions for better TypeScript support
export type SpacingScale = typeof spacingScale;
export type SpacingSize = keyof typeof spacingScale;
export type AccessibleSpacing = typeof accessibleSpacing;

// Spacing utility types for component props
export interface SpacingProps {
  gap?: SpacingSize;
  padding?: SpacingSize;
  margin?: SpacingSize;
}