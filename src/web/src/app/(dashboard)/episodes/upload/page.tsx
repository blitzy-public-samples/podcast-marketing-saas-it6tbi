/**
 * Human Tasks:
 * 1. Verify file upload size limits with backend team
 * 2. Test upload progress tracking across different network conditions
 * 3. Validate error handling scenarios with QA team
 * 4. Ensure proper analytics tracking for upload events
 */

'use client';

// react v18.0.0
import React, { useState, useEffect } from 'react';

// Internal imports
import EpisodeForm from '../../../components/episodes/episode-form';
import UploadProgress from '../../../components/episodes/upload-progress';
import useEpisodes from '../../../hooks/use-episodes';
import { postData } from '../../../lib/api';
import { login } from '../../../lib/auth';
import { Episode } from '../../../types/episode';

/**
 * Upload page component for podcast episodes.
 * 
 * Requirements addressed:
 * - Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management):
 *   Implements episode upload functionality with form validation and progress tracking
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Maintains consistent styling and layout for the upload interface
 * - State Management (8.1 User Interface Design/8.1.3 Critical User Flows):
 *   Manages upload state and progress with proper error handling
 * - API Design (8.3 API Design/8.3.2 Interface Specifications):
 *   Integrates with backend API for episode uploads
 */
const UploadPage: React.FC = () => {
  // State for tracking upload progress
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingEpisodeId, setUploadingEpisodeId] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Hook for episode management
  const { addEpisode } = useEpisodes();

  // Reset upload state when component unmounts
  useEffect(() => {
    return () => {
      setUploadProgress(0);
      setUploadingEpisodeId('');
      setUploadError(null);
    };
  }, []);

  /**
   * Handles the episode upload process
   * Requirement: Episode Management
   */
  const handleEpisodeUpload = async (episodeData: Partial<Episode>) => {
    try {
      setUploadError(null);
      setUploadProgress(0);

      // Create the episode record first
      const episode = await addEpisode(episodeData as Omit<Episode, 'id'>);
      setUploadingEpisodeId(episode.id);

      // Simulate upload progress (replace with actual upload logic)
      const uploadInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 500);

      // Upload the audio file
      const formData = new FormData();
      formData.append('episodeId', episode.id);
      formData.append('audioFile', episodeData.audioUrl as string);

      const response = await postData<Episode>(
        `/episodes/${episode.id}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            setUploadProgress(progress);
          },
        }
      );

      clearInterval(uploadInterval);
      setUploadProgress(100);

      return response.data;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setUploadProgress(0);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Upload Episode</h1>

      {/* Error display */}
      {uploadError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          <p className="font-medium">Upload Error</p>
          <p className="text-sm">{uploadError}</p>
        </div>
      )}

      {/* Episode upload form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <EpisodeForm
          onSubmit={handleEpisodeUpload}
          isLoading={uploadProgress > 0 && uploadProgress < 100}
        />
      </div>

      {/* Upload progress indicator */}
      {uploadingEpisodeId && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Upload Progress</h2>
          <UploadProgress
            progress={uploadProgress}
            episodeId={uploadingEpisodeId}
          />
        </div>
      )}
    </div>
  );
};

export default UploadPage;