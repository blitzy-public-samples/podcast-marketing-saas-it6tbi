/**
 * Human Tasks:
 * 1. Verify analytics metrics display with actual backend data
 * 2. Test responsive layout across different screen sizes
 * 3. Validate episode list pagination performance
 * 4. Ensure marketing calendar interactions work as expected
 */

'use client';

// React v18.2.0
import React, { useEffect } from 'react';

// Internal imports with relative paths
import DashboardLayout from './layout';
import MetricsCard from '../../components/analytics/metrics-card';
import EpisodeList from '../../components/episodes/episode-list';
import ScheduleCalendar from '../../components/marketing/schedule-calendar';
import useAnalytics from '../../hooks/use-analytics';
import useEpisodes from '../../hooks/use-episodes';
import { useFetchMarketingCampaigns } from '../../hooks/use-marketing';

/**
 * Main dashboard page component that integrates analytics, episodes, and marketing components.
 * 
 * Requirements addressed:
 * - Dashboard Overview (8.1 User Interface Design/8.1.2 Main Dashboard)
 * - Analytics Data Visualization (8.1 User Interface Design/Analytics Dashboard)
 * - Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management)
 * - Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation)
 */
const DashboardPage: React.FC = () => {
  // Initialize hooks for data fetching
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError, fetchAnalyticsData } = useAnalytics();
  const { episodes, isLoading: episodesLoading, error: episodesError, fetchEpisodes } = useEpisodes();
  const { campaigns, loading: marketingLoading, error: marketingError } = useFetchMarketingCampaigns();

  // Fetch initial data
  useEffect(() => {
    fetchAnalyticsData('/analytics/dashboard');
    fetchEpisodes();
  }, [fetchAnalyticsData, fetchEpisodes]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Analytics Section */}
        <section aria-labelledby="analytics-heading">
          <h2 id="analytics-heading" className="text-2xl font-semibold mb-4">
            Analytics Overview
          </h2>
          {analyticsError ? (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg">
              Failed to load analytics data
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsLoading ? (
                // Loading skeleton for analytics cards
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-32 bg-gray-100 animate-pulse rounded-lg"
                  />
                ))
              ) : (
                // Render analytics metrics cards
                analyticsData?.data.map((metric) => (
                  <MetricsCard
                    key={metric.metric}
                    data={metric}
                    className="h-full"
                  />
                ))
              )}
            </div>
          )}
        </section>

        {/* Recent Episodes Section */}
        <section aria-labelledby="episodes-heading">
          <h2 id="episodes-heading" className="text-2xl font-semibold mb-4">
            Recent Episodes
          </h2>
          {episodesError ? (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg">
              Failed to load episodes
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <EpisodeList />
            </div>
          )}
        </section>

        {/* Marketing Calendar Section */}
        <section aria-labelledby="marketing-heading">
          <h2 id="marketing-heading" className="text-2xl font-semibold mb-4">
            Marketing Schedule
          </h2>
          {marketingError ? (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg">
              Failed to load marketing calendar
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <ScheduleCalendar />
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;