/**
 * Human Tasks:
 * 1. Verify chart accessibility with screen readers
 * 2. Test component responsiveness across different viewports
 * 3. Validate color contrast ratios for metrics cards
 * 4. Ensure animations are disabled when reduced motion is preferred
 */

// React v18.0.0
import React, { useMemo } from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { Chart } from './chart';
import { MetricsCard } from './metrics-card';
import type { AnalyticsData } from '../../types/analytics';
import { formatError } from '../../lib/utils';

interface EngagementMetricsProps {
  /** Array of analytics data points to visualize */
  data: AnalyticsData[];
}

/**
 * A component that visualizes user engagement metrics using charts and metrics cards.
 * 
 * Requirements addressed:
 * - Analytics Visualization (8.1 User Interface Design/Analytics Dashboard):
 *   Provides visual representation of engagement metrics through charts and cards
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Maintains consistent styling and layout for analytics visualization
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Implements TypeScript interfaces for type-safe analytics data handling
 */
export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ data }) => {
  // Group metrics by type for organized display
  const groupedMetrics = useMemo(() => {
    try {
      return data.reduce((acc, item) => {
        if (!acc[item.metric]) {
          acc[item.metric] = [];
        }
        acc[item.metric].push(item);
        return acc;
      }, {} as Record<string, AnalyticsData[]>);
    } catch (error) {
      console.error(formatError(error));
      return {};
    }
  }, [data]);

  // Get latest values for each metric
  const latestMetrics = useMemo(() => {
    try {
      return Object.keys(groupedMetrics).map(metric => {
        const metricData = groupedMetrics[metric];
        return metricData.reduce((latest, current) => {
          return new Date(current.timestamp) > new Date(latest.timestamp)
            ? current
            : latest;
        });
      });
    } catch (error) {
      console.error(formatError(error));
      return [];
    }
  }, [groupedMetrics]);

  // Handle empty data state
  if (!data.length) {
    return (
      <div className="text-center text-neutral-600 py-8">
        No engagement metrics data available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Metrics Overview Cards */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="region"
        aria-label="Engagement metrics overview"
      >
        {latestMetrics.map((metric, index) => (
          <MetricsCard
            key={`${metric.metric}-${index}`}
            data={metric}
            className={classnames(
              'transition-all duration-200 ease-in-out',
              'hover:transform hover:scale-105'
            )}
          />
        ))}
      </div>

      {/* Metrics Trends Chart */}
      <div
        className="w-full"
        role="region"
        aria-label="Engagement metrics trends"
      >
        <Chart
          data={data}
          title="Engagement Trends"
          description="Historical view of engagement metrics over time"
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
      </div>
    </div>
  );
};

export default EngagementMetrics;