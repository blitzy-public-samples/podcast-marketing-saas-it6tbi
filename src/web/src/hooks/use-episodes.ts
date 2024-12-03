/**
 * Human Tasks:
 * 1. Verify Redux store configuration for episode state management
 * 2. Confirm error handling strategies with the backend team
 * 3. Validate episode data caching requirements with the team
 */

// react-redux v8.0.5
import { useDispatch, useSelector } from 'react-redux';
import { Episode } from '../types/episode';
import { fetchData, postData } from '../lib/api';

/**
 * Custom React hook for managing podcast episodes
 * 
 * Requirements addressed:
 * - Episode Management (1.3 Scope/Core Features and Functionalities/Podcast Management)
 * - State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
 * - Type Safety (9.1 Programming Languages/Frontend)
 */
const useEpisodes = () => {
  const dispatch = useDispatch();
  
  // Select episodes from Redux store
  const episodes = useSelector((state: { episodes: Episode[] }) => state.episodes);
  const isLoading = useSelector((state: { episodesLoading: boolean }) => state.episodesLoading);
  const error = useSelector((state: { episodesError: string | null }) => state.episodesError);

  /**
   * Fetches episodes from the API and updates the Redux store
   * Requirement: Episode Management
   */
  const fetchEpisodes = async () => {
    try {
      dispatch({ type: 'SET_EPISODES_LOADING', payload: true });
      const response = await fetchData<Episode[]>('/episodes');
      dispatch({ type: 'SET_EPISODES', payload: response.data });
      dispatch({ type: 'SET_EPISODES_ERROR', payload: null });
    } catch (error) {
      dispatch({ 
        type: 'SET_EPISODES_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch episodes' 
      });
    } finally {
      dispatch({ type: 'SET_EPISODES_LOADING', payload: false });
    }
  };

  /**
   * Adds a new episode to the system
   * Requirements: Episode Management, State Management
   */
  const addEpisode = async (episode: Omit<Episode, 'id'>) => {
    try {
      dispatch({ type: 'SET_EPISODES_LOADING', payload: true });
      const response = await postData<Episode>('/episodes', episode);
      dispatch({ 
        type: 'ADD_EPISODE', 
        payload: response.data 
      });
      dispatch({ type: 'SET_EPISODES_ERROR', payload: null });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: 'SET_EPISODES_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to add episode' 
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_EPISODES_LOADING', payload: false });
    }
  };

  /**
   * Updates an existing episode
   * Requirements: Episode Management, State Management
   */
  const updateEpisode = async (id: string, updates: Partial<Episode>) => {
    try {
      dispatch({ type: 'SET_EPISODES_LOADING', payload: true });
      const response = await postData<Episode>(`/episodes/${id}`, updates);
      dispatch({ 
        type: 'UPDATE_EPISODE', 
        payload: response.data 
      });
      dispatch({ type: 'SET_EPISODES_ERROR', payload: null });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: 'SET_EPISODES_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update episode' 
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_EPISODES_LOADING', payload: false });
    }
  };

  /**
   * Deletes an episode by ID
   * Requirements: Episode Management, State Management
   */
  const deleteEpisode = async (id: string) => {
    try {
      dispatch({ type: 'SET_EPISODES_LOADING', payload: true });
      await postData<void>(`/episodes/${id}/delete`, {});
      dispatch({ type: 'DELETE_EPISODE', payload: id });
      dispatch({ type: 'SET_EPISODES_ERROR', payload: null });
    } catch (error) {
      dispatch({ 
        type: 'SET_EPISODES_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to delete episode' 
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_EPISODES_LOADING', payload: false });
    }
  };

  /**
   * Gets a single episode by ID
   * Requirements: Episode Management, Type Safety
   */
  const getEpisodeById = (id: string): Episode | undefined => {
    return episodes.find(episode => episode.id === id);
  };

  return {
    episodes,
    isLoading,
    error,
    fetchEpisodes,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    getEpisodeById
  };
};

export default useEpisodes;