/**
 * Human Tasks:
 * 1. Verify environment variables are properly configured in deployment environment
 * 2. Test build optimizations in production environment
 * 3. Validate TailwindCSS and PostCSS integration
 * 4. Ensure webpack configuration works with all project dependencies
 * 5. Test environment variable access in deployed application
 */

// next v13.4.0
// tailwindcss v3.3.0
// postcss v8.4.21
// autoprefixer v10.4.13

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Requirement: Frontend Framework Configuration (9.2 Frameworks & Libraries/9.2.1 Core Frameworks)
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Requirement: Environment Variable Configuration (8.3 API Design/8.3.2 Interface Specifications)
  // Configure environment variables for frontend application
  env: {
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    REACT_APP_AUTH_CLIENT_ID: process.env.REACT_APP_AUTH_CLIENT_ID,
    REACT_APP_ANALYTICS_KEY: process.env.REACT_APP_ANALYTICS_KEY,
  },

  // Requirement: Frontend Build Optimization (9.5 Development & Deployment/9.5.1 Development Environment)
  // Configure webpack for optimal build performance
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in development
    if (dev) {
      config.devtool = 'eval-source-map';
    }

    // Optimize production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        // Enable module concatenation for better tree shaking
        concatenateModules: true,
        // Minimize code in production
        minimize: true,
      };
    }

    // Add custom webpack rules
    config.module.rules.push({
      // Process CSS modules
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              auto: true,
              localIdentName: dev
                ? '[name]__[local]--[hash:base64:5]'
                : '[hash:base64]',
            },
          },
        },
        'postcss-loader',
      ],
    });

    return config;
  },

  // Image optimization configuration
  images: {
    domains: ['assets.example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configure redirects for legacy routes
  async redirects() {
    return [
      {
        source: '/legacy/:path*',
        destination: '/new/:path*',
        permanent: true,
      },
    ];
  },

  // Configure build output
  output: {
    // Enable static exports
    export: true,
    // Clean build directory before export
    clean: true,
  },

  // Configure TypeScript compilation
  typescript: {
    // Enable type checking in production builds
    ignoreBuildErrors: false,
  },

  // Configure PostCSS with TailwindCSS
  postcss: {
    plugins: {
      'tailwindcss': {},
      'autoprefixer': {},
      'postcss-preset-env': {
        stage: 3,
        features: {
          'nesting-rules': true,
        },
      },
    },
  },

  // Enable experimental features
  experimental: {
    // Enable app directory
    appDir: true,
    // Enable server components
    serverComponents: true,
    // Enable concurrent features
    concurrentFeatures: true,
  },
};

module.exports = nextConfig;