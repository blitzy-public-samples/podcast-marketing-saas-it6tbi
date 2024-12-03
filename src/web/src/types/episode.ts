/**
 * @fileoverview TypeScript type definitions for podcast episodes
 * 
 * Requirements addressed:
 * - Type Safety (9.1 Programming Languages/Frontend):
 *   Ensures type safety in episode-related data structures by defining reusable 
 *   types and interfaces.
 * - API Design (8.3 API Design/8.3.2 Interface Specifications):
 *   Provides structured types for episode-related API responses and requests,
 *   ensuring consistency and type safety.
 */

import { ApiResponse } from './api';
import { CommonError } from './common';

/**
 * Represents a podcast episode with its essential metadata and content information
 */
export interface Episode {
  /** Unique identifier for the episode */
  id: string;

  /** Title of the episode */
  title: string;

  /** Detailed description or show notes for the episode */
  description: string;

  /** URL to the episode's audio file */
  audioUrl: string;

  /** Publication date of the episode */
  publishDate: Date;

  /** Duration of the episode in seconds */
  duration: number;
}

/**
 * API response structure for a single episode request
 * Extends the standard ApiResponse with Episode as the data type
 */
export interface EpisodeResponse extends ApiResponse<Episode> {
  /** Episode data */
  data: Episode;

  /** HTTP status code */
  status: number;

  /** Human-readable response message */
  message: string;
}

/**
 * API response structure for paginated episode list requests
 * Contains pagination metadata along with the episode data
 */
export interface EpisodeListResponse {
  /** Array of episodes */
  data: Episode[];

  /** Total number of episodes available */
  total: number;

  /** Current page number (1-based) */
  page: number;

  /** Number of episodes per page */
  pageSize: number;
}