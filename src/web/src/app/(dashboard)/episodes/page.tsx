/**
 * Human Tasks:
 * 1. Verify that the episodes page layout matches the design system specifications
 * 2. Test responsive behavior across different device sizes and orientations
 * 3. Validate accessibility features with screen readers
 * 4. Ensure proper error handling for episode loading failures
 */

'use client';

import { useEffect } from 'react';
import { Episode } from '../../../types/episode';
import useEpisodes from '../../../hooks/use-episodes';
import EpisodeList from '../../../components/episodes/episode-list';
import Sidebar from '../../../components/layout/sidebar';
import Header from '../../../components/layout/header';

/**
 * Main dashboard page for managing podcast episodes.
 * 
 * Requirements addressed:
 * - Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management):
 *   Implements the dashboard page for managing podcast episodes, providing a centralized
 *   interface for viewing and interacting with episodes.
 * 
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Maintains consistent layout and styling using the application's design system
 *   and reusable components.
 * 
 * - State Management (8.1 User Interface Design/8.1.3 Critical User Flows):
 *   Integrates with Redux store and custom hooks to manage episode state across
 *   the application.
 * 
 * - Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design):
 *   Implements a responsive layout that adapts to different screen sizes and devices.
 */
const EpisodesPage = () => {
  // Use the episodes hook for state management
  const { episodes, isLoading, error, fetchEpisodes } = useEpisodes();

  // Fetch episodes on component mount
  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header component for navigation and user actions */}
      <Header />

      {/* Main content area with sidebar and episode list */}
      <div className="flex h-full pt-16">
        {/* Sidebar for navigation */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 px-4 py-8 ml-64">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Episodes
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and organize your podcast episodes
            </p>
          </div>

          {/* Episode list component */}
          <div className="w-full">
            <EpisodeList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EpisodesPage;