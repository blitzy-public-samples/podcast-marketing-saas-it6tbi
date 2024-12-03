// tailwindcss v3.3.0
// postcss v8.4.21
// autoprefixer v10.4.13

/**
 * Human Tasks:
 * 1. Verify the configuration works with the build system and PostCSS setup
 * 2. Test dark mode functionality across different browsers and devices
 * 3. Validate that all custom theme extensions are properly applied
 * 4. Ensure all ShadCN components are styled correctly with the theme
 * 5. Test responsive breakpoints across different viewport sizes
 */

import type { Config } from 'tailwindcss';
import { themeColors } from './src/theme/colors';
import { spacingScale } from './src/theme/spacing';
import { typographyStyles } from './src/theme/typography';

// Requirement: Frontend Architecture (1.2 System Overview/High-Level Description)
// Configure TailwindCSS for the React-based SPA with ShadCN integration
const tailwindConfig = {
  // Enable dark mode based on class to support system preference and manual toggling
  // Requirement: Theme Support (8.1 User Interface Design/Design Specifications)
  darkMode: ['class'],
  
  // Define content sources for TailwindCSS to scan
  content: [
    './src/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  
  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: spacingScale.medium,
        sm: spacingScale.medium,
        lg: spacingScale.large,
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      // Extend color palette with theme colors
      colors: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        neutral: themeColors.neutral,
        success: themeColors.utility.success,
        warning: themeColors.utility.warning,
        error: themeColors.utility.error,
        info: themeColors.utility.info,
      },
      
      // Extend typography with custom styles
      fontFamily: typographyStyles.fontFamily,
      fontSize: typographyStyles.fontSize,
      fontWeight: typographyStyles.fontWeight,
      lineHeight: typographyStyles.lineHeight,
      letterSpacing: typographyStyles.utils.tracking,
      
      // Extend spacing with custom scale
      spacing: {
        sm: spacingScale.small,
        md: spacingScale.medium,
        lg: spacingScale.large,
      },
      
      // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications)
      // Define custom breakpoints for mobile-first responsive design
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      
      // Custom animations and transitions
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  
  // Configure plugins
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
  
  // Future-proof features and optimizations
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
  },
  
  // Experimental features
  experimental: {
    optimizeUniversalDefaults: true,
  },
} satisfies Config;

export default tailwindConfig;