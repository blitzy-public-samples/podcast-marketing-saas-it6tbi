/**
 * Human Tasks:
 * 1. Verify analytics data refresh intervals with product team
 * 2. Test dashboard responsiveness across different viewport sizes
 * 3. Validate analytics metrics requirements with stakeholders
 * 4. Ensure proper error tracking integration for analytics-related errors
 */

// React v18.0.0
'use client';

import React, { useEffect } from 'react';
// classnames v2.3.1
import classnames from 'classnames';

// Import custom hooks and components
import useAnalytics from '../../../hooks/use-analytics';
import { Chart } from '../../../components/analytics/chart';
import { MetricsCard } from '../../../components/analytics/metrics-card';
import { EngagementMetrics } from '../../../components/analytics/engagement-metrics';
import { PerformanceMetrics } from '../../../components/analytics/performance-metrics';

/**
 * Analytics Dashboard page component that displays various analytics metrics and visualizations.
 * 
 * Requirements addressed:
 * - Analytics Dashboard (8.1 User Interface Design/Analytics Dashboard):
 *   Provides a comprehensive view of analytics data using charts and cards
 * - Frontend State Management (9.1 Programming Languages/Frontend):
 *   Uses Redux for managing analytics data state
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Maintains consistent styling and layout across analytics components
 */
const AnalyticsPage: React.FC = () => {
  // Use analytics hook for data fetching and state management
  const {
    data,
    isLoading,
    error,
    fetchAnalyticsData,
    getMetricValue,
    getTotalMetricsValue
  } = useAnalytics();

  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAnalyticsData('/analytics/metrics');
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      }
    };

    fetchData();

    // Set up periodic data refresh (every 5 minutes)
    const refreshInterval = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [fetchAnalyticsData]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg font-medium mb-2">
          Failed to load analytics data
        </div>
        <div className="text-neutral-600">{error}</div>
      </div>
    );
  }

  // Handle empty data state
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neutral-600">
          No analytics data available
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900">
          Analytics Dashboard
        </h1>
        <p className="text-neutral-600">
          Track and analyze key metrics and performance indicators
        </p>
      </div>

      {/* Analytics Overview */}
      <div 
        className={classnames(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
          'transition-all duration-200 ease-in-out'
        )}
      >
        {data.data.slice(0, 4).map((metric, index) => (
          <MetricsCard
            key={`${metric.metric}-${index}`}
            data={metric}
            className="h-full"
          />
        ))}
      </div>

      {/* Engagement Metrics Section */}
      <section 
        className="space-y-4"
        aria-labelledby="engagement-metrics-heading"
      >
        <h2 
          id="engagement-metrics-heading"
          className="text-xl font-semibold text-neutral-900"
        >
          Engagement Metrics
        </h2>
        <EngagementMetrics data={data.data} />
      </section>

      {/* Performance Metrics Section */}
      <section 
        className="space-y-4"
        aria-labelledby="performance-metrics-heading"
      >
        <h2 
          id="performance-metrics-heading"
          className="text-xl font-semibold text-neutral-900"
        >
          Performance Metrics
        </h2>
        <PerformanceMetrics metrics={data.data} />
      </section>

      {/* Analytics Trends */}
      <section 
        className="space-y-4"
        aria-labelledby="analytics-trends-heading"
      >
        <h2 
          id="analytics-trends-heading"
          className="text-xl font-semibold text-neutral-900"
        >
          Analytics Trends
        </h2>
        <Chart
          data={data.data}
          title="Overall Analytics Trends"
          description="Historical view of all analytics metrics"
          type="line"
          height={400}
          showLegend={true}
          options={{
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Value',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
            },
          }}
        />
      </section>
    </div>
  );
};

export default AnalyticsPage;