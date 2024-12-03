/**
 * Human Tasks:
 * 1. Verify PostCSS plugins are installed and compatible with the current versions
 * 2. Test CSS processing pipeline in development and production environments
 * 3. Validate TailwindCSS configuration integration
 * 4. Ensure autoprefixer browser list matches project requirements
 * 5. Test CSS output optimization and minification in production
 */

// Requirement: Frontend Architecture (1.2 System Overview/High-Level Description)
// Configure PostCSS for processing TailwindCSS and other CSS transformations
module.exports = {
  // Define PostCSS plugins with their configurations
  plugins: [
    // tailwindcss v3.3.0
    // Process TailwindCSS utility classes and components
    require('tailwindcss'),

    // autoprefixer v10.4.13
    // Add vendor prefixes to CSS rules using values from Can I Use
    require('autoprefixer')({
      // Enable grid properties autoprefixing
      grid: true,
      // Flexbox properties are automatically included
      flexbox: true,
      // Ensure compatibility with major browsers
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not IE 11',
      ],
    }),

    // Requirement: Theme Support (8.1 User Interface Design/Design Specifications)
    // Process nested CSS and modern CSS features
    require('postcss-preset-env')({
      // Enable future CSS features
      stage: 3,
      // Enable modern CSS features
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true,
        'color-function': true,
        'place-properties': true,
      },
      // Ensure browser compatibility
      browsers: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not IE 11',
      ],
    }),

    // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications)
    // Production-only plugins
    ...(process.env.NODE_ENV === 'production' ? [
      // Optimize and minify CSS in production
      require('cssnano')({
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifyGradients: true,
          minifyParams: true,
          minifySelectors: true,
          mergeLonghand: true,
          mergeRules: true,
        }],
      }),
    ] : []),
  ],
};