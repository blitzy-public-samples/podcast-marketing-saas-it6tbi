/**
 * Human Tasks:
 * 1. Verify API endpoint configurations with backend team
 * 2. Test accessibility of episode detail page with screen readers
 * 3. Validate loading states and error handling with UX team
 * 4. Ensure responsive design works across all viewport sizes
 */

'use client';

// react v18.0.0
import { useState, useEffect } from 'react';
// react-router-dom v6.0.0
import { useParams } from 'react-router-dom';

// Internal imports with relative paths
import { Episode } from '../../../types/episode';
import { fetchData } from '../../../lib/api';
import { EpisodeCard } from '../../../components/episodes/episode-card';
import MetadataEditor from '../../../components/episodes/metadata-editor';
import UploadProgress from '../../../components/episodes/upload-progress';
import useEpisodes from '../../../hooks/use-episodes';

/**
 * Episode detail page component that displays and manages a single podcast episode.
 * 
 * Requirements addressed:
 * - Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management):
 *   Provides detailed view and management of podcast episodes
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Maintains consistent styling and layout for episode details
 * - API Integration (8.3 API Design/8.3.2 Interface Specifications):
 *   Integrates with backend API for episode data management
 */
export default function EpisodeDetailPage() {
  // Get episode ID from URL parameters
  const { id } = useParams<{ id: string }>();
  
  // Local state for episode data and loading status
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get episode management functions from custom hook
  const { 
    getEpisodeById, 
    updateEpisode,
    deleteEpisode 
  } = useEpisodes();

  // Get episode data from store or fetch it
  const episode = getEpisodeById(id || '');

  // Fetch episode data when component mounts or ID changes
  useEffect(() => {
    const loadEpisode = async () => {
      if (!id) {
        setError('Episode ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchData<Episode>(`/episodes/${id}`);
        // Episode data will be updated through Redux store
        setUploadProgress(0); // Reset upload progress
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load episode');
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisode();
  }, [id]);

  // Handle episode playback
  const handlePlay = (audioUrl: string) => {
    // Implement audio playback logic
    console.log(`Playing episode from: ${audioUrl}`);
  };

  // Handle episode deletion
  const handleDelete = async (episodeId: string) => {
    try {
      await deleteEpisode(episodeId);
      // Redirect to episodes list after successful deletion
      window.location.href = '/episodes';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete episode');
    }
  };

  // Handle metadata updates
  const handleMetadataUpdate = async (updates: Partial<Episode>) => {
    if (!id) return;

    try {
      await updateEpisode(id, updates);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update episode');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg" role="alert">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Not found state
  if (!episode) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg" role="alert">
        <h2 className="text-lg font-semibold mb-2">Episode Not Found</h2>
        <p>The requested episode could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Episode header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Episode Details
        </h1>
        <p className="text-gray-600">
          Manage and preview your podcast episode
        </p>
      </div>

      {/* Episode card */}
      <EpisodeCard
        episode={episode}
        onPlay={handlePlay}
        onDelete={handleDelete}
      />

      {/* Upload progress (if applicable) */}
      {uploadProgress > 0 && (
        <UploadProgress
          progress={uploadProgress}
          episodeId={episode.id}
        />
      )}

      {/* Metadata editor */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Edit Episode Metadata
        </h2>
        <MetadataEditor
          episode={episode}
          onSubmit={handleMetadataUpdate}
        />
      </div>
    </div>
  );
}