/**
 * Human Tasks:
 * 1. Verify accessibility of metrics card with screen readers
 * 2. Test color contrast ratios for metric values and labels
 * 3. Validate responsive behavior across different viewport sizes
 * 4. Ensure animations are disabled when reduced motion is preferred
 */

// React v18.0.0
import React from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { AnalyticsData } from '../../types/analytics';
import { Card } from '../ui/card';
import { ProgressBar } from '../ui/progress';

interface MetricsCardProps {
  /** Analytics data to display */
  data: AnalyticsData;
  /** Optional CSS class name for custom styling */
  className?: string;
}

/**
 * A reusable card component for displaying analytics metrics with optional progress visualization.
 * 
 * Requirements addressed:
 * - Analytics Data Visualization (8.1 User Interface Design/Analytics Dashboard):
 *   Displays analytics metrics in a structured and visually appealing manner
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Uses consistent styling and layout for analytics cards
 * - Accessibility (8.1 User Interface Design/Design Specifications/Accessibility):
 *   Implements ARIA attributes and semantic HTML for screen reader support
 */
export const MetricsCard: React.FC<MetricsCardProps> = ({ data, className }) => {
  const { metric, value, timestamp } = data;

  // Format timestamp for display
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Determine if the metric represents a percentage
  const isPercentage = metric.toLowerCase().includes('percentage') || 
                      metric.toLowerCase().includes('ratio') ||
                      (value >= 0 && value <= 100);

  // Format value based on metric type
  const formattedValue = isPercentage 
    ? `${Math.round(value)}%`
    : new Intl.NumberFormat('en-US').format(value);

  // Combine class names for styling
  const cardClasses = classnames(
    'transition-all duration-200 ease-in-out',
    'hover:shadow-lg',
    className
  );

  return (
    <Card
      title={metric}
      description={formattedValue}
      variant="elevated"
      size="medium"
      className={cardClasses}
      hoverable
    >
      <div className="space-y-4">
        {/* Progress visualization for percentage metrics */}
        {isPercentage && (
          <div className="mt-2">
            <ProgressBar
              value={value}
              max={100}
              className="h-2"
            />
          </div>
        )}

        {/* Timestamp display */}
        <div 
          className="text-sm text-neutral-600"
          aria-label={`Last updated on ${formattedDate}`}
        >
          Last updated: {formattedDate}
        </div>
      </div>
    </Card>
  );
};

export default MetricsCard;