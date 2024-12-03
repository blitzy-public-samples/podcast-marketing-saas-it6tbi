/**
 * Human Tasks:
 * 1. Verify ARIA labels and roles with accessibility team
 * 2. Test animation performance across different browsers
 * 3. Validate progress indicator behavior with screen readers
 */

// React v18.0.0
import React from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { Episode } from '../../types/episode';
import { fetchData } from '../../lib/api';
import { ProgressBar } from '../ui/progress';
import useEpisodes from '../../hooks/use-episodes';
import { episodesSlice } from '../../store/episodes-slice';

interface UploadProgressProps {
  /** Current progress value between 0 and 100 */
  progress: number;
  /** ID of the episode being uploaded */
  episodeId: string;
}

/**
 * Component that displays the upload progress for podcast episodes.
 * 
 * Requirements addressed:
 * - Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management):
 *   Provides visual feedback during episode uploads
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Maintains consistent styling for progress indicators
 * - State Management (8.1 User Interface Design/8.1.3 Critical User Flows):
 *   Integrates with Redux store for episode state management
 */
const UploadProgress: React.FC<UploadProgressProps> = ({ progress, episodeId }) => {
  const { getEpisodeById } = useEpisodes();
  const episode = getEpisodeById(episodeId);

  // Validate progress value
  const validProgress = Math.min(Math.max(progress, 0), 100);

  const containerClasses = classnames(
    'w-full p-4 bg-white rounded-lg shadow-sm',
    'border border-neutral-200',
    'transition-all duration-200'
  );

  const titleClasses = classnames(
    'text-sm font-medium text-neutral-900',
    'mb-2 truncate'
  );

  const statusClasses = classnames(
    'text-xs',
    'mt-2',
    progress === 100 ? 'text-green-600' : 'text-neutral-600'
  );

  return (
    <div className={containerClasses} role="region" aria-label="Upload Progress">
      {episode && (
        <div className="space-y-2">
          <h3 className={titleClasses} title={episode.title}>
            {episode.title}
          </h3>
          
          {/* Progress Bar Component */}
          <ProgressBar 
            value={validProgress} 
            max={100}
            className="w-full"
          />

          {/* Status Text */}
          <div className={statusClasses}>
            {progress === 100 ? (
              <span className="flex items-center">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Upload complete
              </span>
            ) : (
              <span>
                Uploading... {validProgress}%
              </span>
            )}
          </div>
        </div>
      )}

      {!episode && (
        <div className="text-sm text-neutral-600">
          Episode not found
        </div>
      )}
    </div>
  );
};

export default UploadProgress;