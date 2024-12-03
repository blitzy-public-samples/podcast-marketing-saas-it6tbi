/**
 * Human Tasks:
 * 1. Verify chart accessibility with screen readers
 * 2. Test chart responsiveness across different viewports
 * 3. Validate chart color schemes for color-blind users
 * 4. Ensure chart interactions meet WCAG 2.1 AA standards
 */

// chart.js v3.9.1
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { useEffect, useRef, useState } from 'react';

import { Card } from '../ui/card';
import { formatError } from '../../lib/utils';
import type { AnalyticsData } from '../../types/analytics';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart type options
type ChartType = 'line' | 'bar';

interface ChartProps {
  // Analytics data to visualize
  data: AnalyticsData[];
  // Title of the chart
  title: string;
  // Description of the chart
  description?: string;
  // Type of chart to render
  type?: ChartType;
  // Height of the chart in pixels
  height?: number;
  // Whether to show the legend
  showLegend?: boolean;
  // Custom chart options
  options?: ChartOptions<ChartType>;
}

// Requirement: Analytics Visualization (8.1 User Interface Design/Analytics Dashboard)
export const Chart: React.FC<ChartProps> = ({
  data,
  title,
  description,
  type = 'line',
  height = 300,
  showLegend = true,
  options = {}
}) => {
  // Reference to the chart canvas element
  const chartRef = useRef<HTMLCanvasElement>(null);
  // Reference to the Chart.js instance
  const chartInstance = useRef<ChartJS | null>(null);
  // Loading state for chart initialization
  const [isLoading, setIsLoading] = useState(true);
  // Error state for chart rendering
  const [error, setError] = useState<string | null>(null);

  // Requirement: Type Safety (9.1 Programming Languages/Frontend)
  const prepareChartData = (): ChartData<ChartType> => {
    try {
      // Group data by metric
      const metrics = Array.from(new Set(data.map(item => item.metric)));
      
      // Sort timestamps for x-axis
      const timestamps = Array.from(new Set(data.map(item => item.timestamp)))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      // Prepare datasets
      const datasets = metrics.map(metric => {
        const metricData = data.filter(item => item.metric === metric);
        return {
          label: metric,
          data: timestamps.map(timestamp => {
            const point = metricData.find(item => item.timestamp === timestamp);
            return point ? point.value : 0;
          }),
          borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
          backgroundColor: `hsla(${Math.random() * 360}, 70%, 50%, 0.5)`,
          tension: 0.4,
        };
      });

      return {
        labels: timestamps.map(timestamp => 
          new Date(timestamp).toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric' 
          })
        ),
        datasets,
      };
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
      return {
        labels: [],
        datasets: [],
      };
    }
  };

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  const defaultOptions: ChartOptions<ChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        align: 'center' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: '600',
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  useEffect(() => {
    const initializeChart = async () => {
      if (!chartRef.current) return;

      try {
        setIsLoading(true);

        // Destroy existing chart instance if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create new chart instance
        chartInstance.current = new ChartJS(chartRef.current, {
          type,
          data: prepareChartData(),
          options: {
            ...defaultOptions,
            ...options,
          },
        });

        setError(null);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setIsLoading(false);
      }
    };

    initializeChart();

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, options]);

  // Requirement: Analytics Visualization (8.1 User Interface Design/Analytics Dashboard)
  return (
    <Card
      title={title}
      description={description || 'Analytics visualization'}
      className="w-full"
    >
      <div 
        style={{ height: `${height}px` }}
        className="relative w-full"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        )}

        <canvas
          ref={chartRef}
          role="img"
          aria-label={`${title} chart`}
          className={`w-full h-full ${isLoading || error ? 'opacity-50' : ''}`}
        />
      </div>
    </Card>
  );
};

export default Chart;