// React v18.0.0
import React, { useState, useCallback } from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { colors, spacing } from '../../theme/index';
import { deepClone } from '../../lib/utils';
import type { CommonError } from '../../types/common';

/**
 * Human Tasks:
 * 1. Verify that the default avatar fallback colors match the design system
 * 2. Test avatar component with different image formats and sizes
 * 3. Validate accessibility features with screen readers
 * 4. Ensure proper error handling for failed image loads
 */

interface AvatarProps {
  /** URL of the avatar image */
  src?: string;
  /** Alt text for the avatar image */
  alt: string;
  /** Size of the avatar in pixels - defaults to 40 */
  size?: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional initials to display when image fails to load */
  initials?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Component Library)
const defaultAvatarStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: colors.neutral[200],
  color: colors.neutral[700],
  fontWeight: 500,
  fontSize: '0.875rem',
  lineHeight: 1,
  userSelect: 'none',
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
const AvatarFallback: React.FC<{ initials?: string; size: number }> = ({ initials, size }) => {
  const fallbackStyles = deepClone(defaultAvatarStyles);
  fallbackStyles.width = `${size}px`;
  fallbackStyles.height = `${size}px`;
  fallbackStyles.fontSize = `${Math.floor(size * 0.4)}px`;

  return (
    <div 
      style={fallbackStyles}
      role="img"
      aria-label={initials ? `Avatar with initials ${initials}` : 'Default avatar'}
    >
      {initials || '•'}
    </div>
  );
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 40,
  className,
  initials,
}) => {
  const [imageError, setImageError] = useState<CommonError | null>(null);

  // Handle image load errors
  const handleImageError = useCallback(() => {
    setImageError({
      code: 'AVATAR_LOAD_ERROR',
      message: 'Failed to load avatar image'
    });
  }, []);

  // Base container styles
  const containerStyles = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  // Image styles when src is provided
  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    borderRadius: '50%',
  };

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Component Library)
  return (
    <div 
      style={containerStyles}
      className={classnames('avatar', className)}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          style={imageStyles}
          onError={handleImageError}
          // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
          role="img"
          aria-label={alt}
        />
      ) : (
        <AvatarFallback 
          initials={initials} 
          size={size}
        />
      )}
    </div>
  );
};

// Default export for the Avatar component
export default Avatar;