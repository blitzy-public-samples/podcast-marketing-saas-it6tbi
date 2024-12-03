/**
 * Human Tasks:
 * 1. Verify analytics data refresh intervals with product team
 * 2. Confirm error handling strategies with frontend team
 * 3. Validate analytics metrics requirements with stakeholders
 * 4. Ensure proper error tracking integration for analytics-related errors
 */

// react-redux v8.0.5
import { useSelector, useDispatch } from 'react-redux';
import { AnalyticsResponse } from '../types/analytics';
import { 
  fetchAnalytics,
  selectAnalyticsData,
  selectAnalyticsLoading,
  selectAnalyticsError,
  clearAnalytics
} from '../store/analytics-slice';

/**
 * Requirement: Frontend State Management (9.1 Programming Languages/Frontend)
 * Custom React hook for managing analytics data using Redux state
 * 
 * @returns {Object} An object containing analytics data, loading state, error state,
 * and functions to fetch and clear analytics data
 */
const useAnalytics = () => {
  const dispatch = useDispatch();

  // Select analytics state from Redux store
  const analyticsData = useSelector(selectAnalyticsData);
  const isLoading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  /**
   * Requirement: Analytics Data Representation (8.3 API Design/8.3.2 Interface Specifications)
   * Fetches analytics data from the backend API
   * 
   * @param {string} endpoint - The API endpoint to fetch analytics data from
   * @returns {Promise<void>}
   */
  const fetchAnalyticsData = async (endpoint: string): Promise<void> => {
    try {
      await dispatch(fetchAnalytics(endpoint)).unwrap();
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      throw error;
    }
  };

  /**
   * Clears the analytics data from the Redux store
   */
  const clearAnalyticsData = (): void => {
    dispatch(clearAnalytics());
  };

  /**
   * Extracts specific metrics from the analytics data
   * 
   * @param {string} metricName - The name of the metric to retrieve
   * @returns {number | null} The metric value or null if not found
   */
  const getMetricValue = (metricName: string): number | null => {
    if (!analyticsData?.data) {
      return null;
    }

    const metric = analyticsData.data.find(item => item.metric === metricName);
    return metric ? metric.value : null;
  };

  /**
   * Calculates the total value across all metrics
   * 
   * @returns {number} The sum of all metric values
   */
  const getTotalMetricsValue = (): number => {
    if (!analyticsData?.data) {
      return 0;
    }

    return analyticsData.data.reduce((total, item) => total + item.value, 0);
  };

  return {
    // Analytics data and state
    data: analyticsData as AnalyticsResponse | null,
    isLoading,
    error,
    
    // Pagination information
    total: analyticsData?.total || 0,
    currentPage: analyticsData?.page || 1,
    pageSize: analyticsData?.pageSize || 10,
    
    // Utility functions
    fetchAnalyticsData,
    clearAnalyticsData,
    getMetricValue,
    getTotalMetricsValue,
  };
};

export default useAnalytics;