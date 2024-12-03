/**
 * Human Tasks:
 * 1. Verify card accessibility with screen readers for episode content
 * 2. Test episode card responsiveness across different viewports
 * 3. Validate episode duration formatting with design team
 * 4. Ensure audio playback integration works across browsers
 */

// classnames v2.3.1
import classnames from 'classnames';
import { Episode } from '../../types/episode';
import { deepClone } from '../../lib/utils';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface EpisodeCardProps {
  /** Episode data to display */
  episode: Episode;
  /** Callback function when play button is clicked */
  onPlay: (audioUrl: string) => void;
  /** Callback function when delete button is clicked */
  onDelete: (id: string) => void;
}

/**
 * A reusable component for displaying podcast episode details.
 * 
 * Requirements addressed:
 * - UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy):
 *   Uses consistent card styles and behaviors for displaying episode details.
 * - Accessibility (8.1 User Interface Design/Design Specifications/Accessibility):
 *   Implements accessible controls and semantic HTML for WCAG 2.1 AA compliance.
 * - Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design):
 *   Adapts episode card styles to different screen sizes.
 */
export class EpisodeCard {
  private episode: Episode;
  private onPlay: (audioUrl: string) => void;
  private onDelete: (id: string) => void;

  constructor(props: EpisodeCardProps) {
    this.episode = deepClone(props.episode);
    this.onPlay = props.onPlay;
    this.onDelete = props.onDelete;
  }

  /**
   * Handles the play button click event
   */
  private handlePlayClick = (audioUrl: string): void => {
    if (!audioUrl) {
      console.error('Invalid audio URL provided');
      return;
    }
    this.onPlay(audioUrl);
  };

  /**
   * Formats the episode duration from seconds to HH:MM:SS
   */
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(hours.toString().padStart(2, '0'));
    }
    parts.push(minutes.toString().padStart(2, '0'));
    parts.push(remainingSeconds.toString().padStart(2, '0'));

    return parts.join(':');
  }

  /**
   * Formats the publish date to a localized string
   */
  private formatPublishDate(date: Date): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  render(): JSX.Element {
    const { id, title, description, audioUrl, publishDate, duration } = this.episode;

    return (
      <Card
        title={title}
        description={description}
        variant="elevated"
        className={classnames(
          'w-full',
          'max-w-2xl',
          'hover:shadow-lg',
          'transition-shadow'
        )}
        footer={
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Published: {this.formatPublishDate(publishDate)}</span>
            <span>Duration: {this.formatDuration(duration)}</span>
          </div>
        }
        actions={
          <div className="flex space-x-4">
            <Button
              label="Play Episode"
              variant="primary"
              onClick={() => this.handlePlayClick(audioUrl)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              ariaLabel={`Play episode: ${title}`}
            />
            <Button
              label="Delete"
              variant="danger"
              onClick={() => this.onDelete(id)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              ariaLabel={`Delete episode: ${title}`}
            />
          </div>
        }
      />
    );
  }
}

export default EpisodeCard;