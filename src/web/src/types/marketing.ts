/**
 * @fileoverview Marketing-related TypeScript type definitions for the web application
 * 
 * Requirements addressed:
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Ensures type safety in marketing-related data structures by defining reusable 
 *   types and interfaces.
 * - API Design (8.3 API Design/8.3.2 Interface Specifications):
 *   Provides structured types for marketing-related API responses and requests,
 *   ensuring consistency and type safety.
 */

import { ApiResponse } from './api';
import { CommonError } from './common';
import { Episode } from './episode';

/**
 * Represents a marketing campaign with its essential metadata and content information
 */
export interface MarketingCampaign {
  /** Unique identifier for the campaign */
  id: string;

  /** Title or name of the marketing campaign */
  title: string;

  /** List of social media or marketing platforms where the campaign will be distributed */
  platforms: string[];

  /** The actual content or message of the marketing campaign */
  content: string;

  /** Scheduled date for the campaign to be published */
  scheduleDate: Date;

  /** Current status of the marketing campaign */
  status: 'draft' | 'scheduled' | 'published';
}

/**
 * API response structure for a single marketing campaign request
 * Extends the standard ApiResponse with MarketingCampaign as the data type
 */
export interface MarketingResponse extends ApiResponse<MarketingCampaign> {
  /** Marketing campaign data */
  data: MarketingCampaign;

  /** HTTP status code */
  status: number;

  /** Human-readable response message */
  message: string;
}

/**
 * API response structure for paginated marketing campaign list requests
 * Contains pagination metadata along with the marketing campaign data
 */
export interface MarketingListResponse {
  /** Array of marketing campaigns */
  data: MarketingCampaign[];

  /** Total number of campaigns available */
  total: number;

  /** Current page number (1-based) */
  page: number;

  /** Number of campaigns per page */
  pageSize: number;
}