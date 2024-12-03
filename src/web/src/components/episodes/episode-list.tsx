/**
 * Human Tasks:
 * 1. Verify accessibility of episode list with screen readers
 * 2. Test episode list pagination performance with large datasets
 * 3. Validate loading states and error messages with design team
 * 4. Ensure responsive layout works across all viewport sizes
 */

// classnames v2.3.1
import classnames from 'classnames';
import { useCallback, useEffect } from 'react';

// Internal imports
import { Episode } from '../../types/episode';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import useEpisodes from '../../hooks/use-episodes';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const episodeListStyles = {
  container: classnames(
    'flex',
    'flex-col',
    'gap-6',
    'w-full',
    'max-w-4xl',
    'mx-auto',
    'p-4',
    'sm:p-6'
  ),
  grid: classnames(
    'grid',
    'grid-cols-1',
    'md:grid-cols-2',
    'gap-6'
  ),
  error: classnames(
    'text-red-600',
    'text-center',
    'p-4',
    'rounded-md',
    'bg-red-50'
  ),
  loading: classnames(
    'flex',
    'justify-center',
    'items-center',
    'p-8'
  ),
  loadMore: classnames(
    'mt-6',
    'self-center'
  )
};

// Requirement: Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management)
const EpisodeList: React.FC = () => {
  // Use the episodes hook for state management
  const { episodes, isLoading, error, fetchEpisodes } = useEpisodes();

  // Fetch episodes on component mount
  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  // Format episode duration from seconds to MM:SS
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Format publish date to localized string
  const formatDate = useCallback((date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Render loading state
  if (isLoading && !episodes.length) {
    return (
      <div className={episodeListStyles.container}>
        <div className={episodeListStyles.loading}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !episodes.length) {
    return (
      <div className={episodeListStyles.container}>
        <div className={episodeListStyles.error}>
          <p>{error}</p>
          <Button
            label="Try Again"
            onClick={fetchEpisodes}
            variant="secondary"
            className="mt-4"
          />
        </div>
      </div>
    );
  }

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  return (
    <div className={episodeListStyles.container}>
      <div className={episodeListStyles.grid}>
        {episodes.map((episode: Episode) => (
          <Card
            key={episode.id}
            title={episode.title}
            description={episode.description}
            variant="interactive"
            footer={
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{formatDate(episode.publishDate)}</span>
                <span>{formatDuration(episode.duration)}</span>
              </div>
            }
            actions={
              <Button
                label="Play Episode"
                onClick={() => window.open(episode.audioUrl, '_blank')}
                variant="primary"
                size="small"
              />
            }
          />
        ))}
      </div>

      {/* Requirement: State Management (8.1 User Interface Design/8.1.3 Critical User Flows) */}
      {isLoading ? (
        <div className={episodeListStyles.loadMore}>
          <Button
            label="Loading..."
            disabled
            loading
            variant="secondary"
          />
        </div>
      ) : (
        <div className={episodeListStyles.loadMore}>
          <Button
            label="Load More Episodes"
            onClick={fetchEpisodes}
            variant="secondary"
          />
        </div>
      )}
    </div>
  );
};

export default EpisodeList;