/**
 * Human Tasks:
 * 1. Verify layout responsiveness across different device sizes
 * 2. Test keyboard navigation flow through the landing page
 * 3. Validate ARIA roles and labels with screen readers
 * 4. Ensure proper color contrast ratios for all text elements
 */

'use client';

// react v18.2.0
import React from 'react';
// tailwindcss v3.3.0
import 'tailwindcss/tailwind.css';

// Internal imports with relative paths
import Layout from './layout';
import AppProviders from './providers';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import EpisodeList from '../components/episodes/episode-list';
import useEpisodes from '../hooks/use-episodes';

/**
 * Main landing page component for the web application.
 * 
 * Requirements addressed:
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
 * - Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management)
 * - Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
 * - Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
 */
const LandingPage: React.FC = () => {
  // Initialize episodes hook for data fetching
  const { episodes, isLoading, error } = useEpisodes();

  return (
    // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
    // Wrap the entire application with global providers
    <AppProviders>
      {/* Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy) */}
      <Layout>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded"
        >
          Skip to main content
        </a>

        {/* Header component for navigation and branding */}
        <Header />

        {/* Main content area */}
        <main
          id="main-content"
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
          role="main"
          aria-label="Main content"
        >
          {/* Welcome section */}
          <section
            className="mb-12 text-center"
            // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
            aria-labelledby="welcome-heading"
          >
            <h1
              id="welcome-heading"
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
            >
              Welcome to Podcast Marketing
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover and manage your podcast episodes in one place
            </p>
          </section>

          {/* Requirement: Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management) */}
          {/* Episodes section */}
          <section
            className="mb-12"
            // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
            aria-labelledby="episodes-heading"
          >
            <h2
              id="episodes-heading"
              className="sr-only"
            >
              Podcast Episodes
            </h2>
            <EpisodeList />
          </section>
        </main>

        {/* Footer component */}
        <Footer />
      </Layout>
    </AppProviders>
  );
};

export default LandingPage;