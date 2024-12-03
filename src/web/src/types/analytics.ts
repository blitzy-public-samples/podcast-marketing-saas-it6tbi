/**
 * @fileoverview Analytics-related TypeScript type definitions for standardized analytics data handling
 * 
 * Requirements addressed:
 * - Analytics Data Handling (8.3 API Design/8.3.2 Interface Specifications):
 *   Provides structured types for analytics data, ensuring consistency and type safety
 *   in analytics-related operations.
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Ensures type safety in analytics data structures by defining reusable types and interfaces.
 */

import { ApiResponse, PaginatedResponse } from './api';

/**
 * Represents a single analytics data point with metric information
 */
export interface AnalyticsData {
  /** Name or identifier of the metric being tracked */
  metric: string;

  /** Numerical value of the metric */
  value: number;

  /** ISO 8601 formatted timestamp when the metric was recorded */
  timestamp: string;
}

/**
 * Represents a paginated response containing analytics data
 * Extends PaginatedResponse to maintain consistency with API response patterns
 */
export interface AnalyticsResponse extends PaginatedResponse<AnalyticsData> {
  /** Array of analytics data points */
  data: AnalyticsData[];

  /** Total number of analytics records available */
  total: number;

  /** Current page number (1-based indexing) */
  page: number;

  /** Number of items per page */
  pageSize: number;
}

// Type aliases for commonly used analytics response types
export type SingleAnalyticsResponse = ApiResponse<AnalyticsData>;
export type MultipleAnalyticsResponse = ApiResponse<AnalyticsData[]>;
export type PaginatedAnalyticsResponse = ApiResponse<AnalyticsResponse>;