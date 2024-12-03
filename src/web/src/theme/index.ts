// tailwindcss v3.3.0

/**
 * Human Tasks:
 * 1. Verify theme configuration integration with TailwindCSS config file
 * 2. Test theme consistency across all application components
 * 3. Validate theme configuration with design system documentation
 * 4. Ensure theme tokens are properly documented in the style guide
 * 5. Test theme configuration with different viewport sizes and devices
 */

import { themeColors } from './colors';
import { spacingScale, accessibleSpacing } from './spacing';
import { typographyStyles } from './typography';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
// Aggregated theme configuration that combines all theme tokens
export const theme = {
  // Color tokens for consistent brand identity and visual hierarchy
  colors: {
    ...themeColors,
    // Theme-specific color mappings
    background: {
      primary: themeColors.neutral[50],
      secondary: themeColors.neutral[100],
      accent: themeColors.primary[50],
    },
    text: {
      primary: themeColors.neutral[900],
      secondary: themeColors.neutral[700],
      accent: themeColors.primary[700],
    },
    border: {
      light: themeColors.neutral[200],
      medium: themeColors.neutral[300],
      dark: themeColors.neutral[400],
    },
  },

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  // Spacing scale for consistent layout and component spacing
  spacing: {
    ...spacingScale,
    // Layout-specific spacing
    layout: {
      page: spacingScale.large,
      section: spacingScale.medium,
      component: spacingScale.small,
    },
    // Component-specific spacing
    component: {
      padding: spacingScale.medium,
      gap: spacingScale.small,
      inline: spacingScale.small,
    },
    // Accessibility-specific spacing
    accessibility: {
      ...accessibleSpacing,
    },
  },

  // Requirement: Theme Support (8.1 User Interface Design/Design Specifications/Theme Support)
  // Typography configuration for consistent text styling
  typography: {
    ...typographyStyles,
    // Theme-specific typography variants
    variants: {
      // Primary content typography
      content: {
        fontFamily: typographyStyles.fontFamily.body,
        fontSize: typographyStyles.fontSize.body,
        fontWeight: typographyStyles.fontWeight.bodyRegular,
        lineHeight: typographyStyles.lineHeight.body,
      },
      // Interactive element typography
      interactive: {
        fontFamily: typographyStyles.fontFamily.body,
        fontSize: typographyStyles.fontSize.bodySmall,
        fontWeight: typographyStyles.fontWeight.buttonWeight,
        lineHeight: typographyStyles.lineHeight.button,
      },
      // Display typography for marketing content
      display: {
        fontFamily: typographyStyles.fontFamily.heading,
        fontSize: typographyStyles.fontSize.heading1,
        fontWeight: typographyStyles.fontWeight.headingBold,
        lineHeight: typographyStyles.lineHeight.heading,
      },
    },
  },

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Theme-wide accessibility configurations
  accessibility: {
    focusRing: {
      color: themeColors.primary[400],
      width: '2px',
      offset: '2px',
      style: 'solid',
    },
    contrast: {
      high: {
        background: themeColors.neutral[950],
        text: themeColors.neutral[50],
      },
      medium: {
        background: themeColors.neutral[700],
        text: themeColors.neutral[100],
      },
    },
    motion: {
      reduced: {
        transition: 'none',
        animation: 'none',
      },
      default: {
        transition: '150ms ease-in-out',
        animation: '200ms ease-in-out',
      },
    },
  },
} as const;

// Type definitions for better TypeScript support
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
export type ThemeTypography = typeof theme.typography;
export type ThemeAccessibility = typeof theme.accessibility;

// Theme context interface for React components
export interface ThemeContextValue {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Theme utility types for component props
export interface ThemedProps {
  theme?: Theme;
  variant?: keyof typeof theme.typography.variants;
  spacing?: keyof typeof theme.spacing;
  color?: keyof typeof theme.colors;
}