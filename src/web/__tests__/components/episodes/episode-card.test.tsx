// @testing-library/react v14.0.0
// @testing-library/jest-dom v6.0.0

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EpisodeCard } from '../../../src/components/episodes/episode-card';
import { Episode } from '../../../src/types/episode';
import { deepClone } from '../../../src/lib/utils';
import { theme } from '../../../src/theme/index';

// Test data setup
const mockEpisode: Episode = {
  id: 'ep123',
  title: 'Test Episode Title',
  description: 'Test episode description for testing purposes',
  audioUrl: 'https://example.com/audio/test-episode.mp3',
  publishDate: new Date('2023-01-01T12:00:00Z'),
  duration: 1800 // 30 minutes
};

// Helper function to render the component with required props
const renderComponent = ({
  episode = mockEpisode,
  onPlay = jest.fn(),
  onDelete = jest.fn()
} = {}) => {
  return render(
    <EpisodeCard
      episode={episode}
      onPlay={onPlay}
      onDelete={onDelete}
    />
  );
};

describe('EpisodeCard Component', () => {
  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  describe('Rendering', () => {
    it('renders episode details correctly', () => {
      renderComponent();

      // Verify title is rendered
      expect(screen.getByText(mockEpisode.title)).toBeInTheDocument();

      // Verify description is rendered
      expect(screen.getByText(mockEpisode.description)).toBeInTheDocument();

      // Verify publish date is rendered in correct format
      const formattedDate = new Date(mockEpisode.publishDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      expect(screen.getByText(new RegExp(formattedDate))).toBeInTheDocument();

      // Verify duration is rendered in correct format (HH:MM:SS)
      const formattedDuration = '00:30:00'; // 1800 seconds = 30 minutes
      expect(screen.getByText(new RegExp(formattedDuration))).toBeInTheDocument();
    });

    it('applies correct theme styles', () => {
      const { container } = renderComponent();
      
      // Verify card uses theme colors
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({
        backgroundColor: theme.colors.background.primary
      });
    });
  });

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  describe('Accessibility', () => {
    it('provides accessible button labels', () => {
      renderComponent();

      // Verify play button has accessible label
      expect(screen.getByLabelText(`Play episode: ${mockEpisode.title}`)).toBeInTheDocument();

      // Verify delete button has accessible label
      expect(screen.getByLabelText(`Delete episode: ${mockEpisode.title}`)).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      const onPlay = jest.fn();
      renderComponent({ onPlay });

      const playButton = screen.getByLabelText(`Play episode: ${mockEpisode.title}`);
      
      // Verify button can be focused
      playButton.focus();
      expect(playButton).toHaveFocus();

      // Verify keyboard activation works
      fireEvent.keyDown(playButton, { key: 'Enter' });
      expect(onPlay).toHaveBeenCalledWith(mockEpisode.audioUrl);
    });
  });

  // Requirement: Code Quality (9.5 Development & Deployment/Development Environment)
  describe('Interactions', () => {
    it('handles play button click', () => {
      const onPlay = jest.fn();
      renderComponent({ onPlay });

      // Click play button
      const playButton = screen.getByLabelText(`Play episode: ${mockEpisode.title}`);
      fireEvent.click(playButton);

      // Verify onPlay was called with correct audio URL
      expect(onPlay).toHaveBeenCalledTimes(1);
      expect(onPlay).toHaveBeenCalledWith(mockEpisode.audioUrl);
    });

    it('handles delete button click', () => {
      const onDelete = jest.fn();
      renderComponent({ onDelete });

      // Click delete button
      const deleteButton = screen.getByLabelText(`Delete episode: ${mockEpisode.title}`);
      fireEvent.click(deleteButton);

      // Verify onDelete was called with correct episode ID
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(mockEpisode.id);
    });

    it('prevents play button click when audio URL is invalid', () => {
      const onPlay = jest.fn();
      const invalidEpisode = deepClone(mockEpisode);
      invalidEpisode.audioUrl = '';

      renderComponent({
        episode: invalidEpisode,
        onPlay
      });

      // Click play button
      const playButton = screen.getByLabelText(`Play episode: ${mockEpisode.title}`);
      fireEvent.click(playButton);

      // Verify onPlay was not called
      expect(onPlay).not.toHaveBeenCalled();
    });
  });

  describe('Data Handling', () => {
    it('creates deep clone of episode data', () => {
      const episode = deepClone(mockEpisode);
      const { rerender } = renderComponent({ episode });

      // Modify original episode data
      const modifiedEpisode = { ...episode, title: 'Modified Title' };
      
      // Rerender with modified data
      rerender(
        <EpisodeCard
          episode={modifiedEpisode}
          onPlay={jest.fn()}
          onDelete={jest.fn()}
        />
      );

      // Verify original title is still displayed
      expect(screen.getByText(episode.title)).toBeInTheDocument();
      expect(screen.queryByText(modifiedEpisode.title)).not.toBeInTheDocument();
    });
  });
});