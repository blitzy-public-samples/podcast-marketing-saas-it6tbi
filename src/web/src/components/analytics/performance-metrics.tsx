/**
 * Human Tasks:
 * 1. Verify accessibility of performance metrics with screen readers
 * 2. Test responsiveness of metric cards across different viewport sizes
 * 3. Validate color contrast ratios for metric values and labels
 * 4. Ensure performance optimization for large datasets
 */

// React v18.0.0
import React from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { AnalyticsData } from '../../types/analytics';
import { Card } from '../ui/card';
import { ProgressBar } from '../ui/progress';
import { formatError } from '../../lib/utils';

interface PerformanceMetricsProps {
  /** Array of analytics data points to display */
  metrics: AnalyticsData[];
}

/**
 * A component that displays performance metrics using cards and progress bars.
 * 
 * Requirements addressed:
 * - Analytics Visualization (8.1 User Interface Design/Analytics Dashboard):
 *   Provides visual representation of performance metrics using reusable components
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Maintains consistent styling and behavior across analytics components
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Leverages TypeScript for type-safe analytics data handling
 */
export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  // Validate input metrics
  if (!Array.isArray(metrics)) {
    const error = formatError({
      code: 'INVALID_METRICS',
      message: 'Metrics must be provided as an array'
    });
    throw new Error(error);
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error(formatError({
        code: 'INVALID_TIMESTAMP',
        message: 'Failed to format timestamp'
      }));
      return timestamp;
    }
  };

  // Calculate maximum value for progress bars
  const maxValue = Math.max(...metrics.map(m => m.value), 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={`${metric.metric}-${index}`}
          title={metric.metric}
          description={`Last updated: ${formatTimestamp(metric.timestamp)}`}
          variant="default"
          size="medium"
          className={classnames(
            'transition-all duration-200',
            'hover:shadow-md'
          )}
        >
          <div className="space-y-4">
            {/* Metric value display */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                {metric.value.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                {`${Math.round((metric.value / maxValue) * 100)}%`}
              </span>
            </div>

            {/* Progress bar visualization */}
            <ProgressBar
              value={metric.value}
              max={maxValue}
              className="w-full"
            />

            {/* Additional metric details */}
            <div className="text-sm text-gray-600">
              <dl className="grid grid-cols-2 gap-2">
                <dt>Metric ID:</dt>
                <dd className="font-medium">{metric.metric}</dd>
                <dt>Timestamp:</dt>
                <dd className="font-medium">{formatTimestamp(metric.timestamp)}</dd>
              </dl>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceMetrics;