// react v18.0.0
import React, { useState, useRef, useEffect, ReactNode } from 'react';
// classnames v2.3.1
import classNames from 'classnames';

import { colors, spacing } from '../../theme/index';
import { deepClone } from '../../lib/utils';

/**
 * Human Tasks:
 * 1. Verify tooltip positioning works correctly across different viewport sizes
 * 2. Test keyboard navigation and screen reader compatibility
 * 3. Validate tooltip content rendering with different content lengths
 * 4. Ensure tooltip animations are smooth and performant
 */

// Requirement: User Interface Enhancements (8.1 User Interface Design/Interface Elements)
// Base styles for the tooltip component
const tooltipStyles = {
  container: 'relative inline-block',
  tooltip: classNames(
    'absolute z-50 px-3 py-2 text-sm',
    'rounded-md shadow-lg',
    'transition-opacity duration-200',
    'max-w-xs break-words'
  ),
  arrow: 'absolute w-2 h-2 rotate-45',
  // Default positioning classes
  positions: {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  },
  // Arrow positioning classes
  arrowPositions: {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
    left: 'right-[-4px] top-1/2 -translate-y-1/2',
    right: 'left-[-4px] top-1/2 -translate-y-1/2'
  }
};

interface TooltipProps {
  /** Content to be displayed in the tooltip */
  content: string;
  /** Element that triggers the tooltip */
  children: ReactNode;
  /** Position of the tooltip relative to the trigger element */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Whether the tooltip should be shown */
  show?: boolean;
  /** Custom class names for the tooltip */
  className?: string;
  /** Whether the tooltip should be disabled */
  disabled?: boolean;
  /** Delay before showing the tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding the tooltip (ms) */
  hideDelay?: number;
}

// Requirement: User Interface Enhancements (8.1 User Interface Design/Interface Elements)
// Tooltip component for displaying contextual information
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  show: controlledShow,
  className,
  disabled = false,
  showDelay = 200,
  hideDelay = 150
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const showTimeout = useRef<NodeJS.Timeout>();
  const hideTimeout = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Handle keyboard interactions for accessibility
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // Handle controlled visibility if show prop is provided
  useEffect(() => {
    if (controlledShow !== undefined) {
      setIsVisible(controlledShow);
    }
  }, [controlledShow]);

  const handleMouseEnter = () => {
    if (disabled) return;
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    showTimeout.current = setTimeout(() => setIsVisible(true), showDelay);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    if (showTimeout.current) clearTimeout(showTimeout.current);
    hideTimeout.current = setTimeout(() => setIsVisible(false), hideDelay);
  };

  // Requirement: User Interface Enhancements (8.1 User Interface Design/Interface Elements)
  // Generate tooltip classes based on position and theme
  const tooltipClasses = classNames(
    tooltipStyles.tooltip,
    tooltipStyles.positions[position],
    {
      'opacity-0 invisible': !isVisible,
      'opacity-100 visible': isVisible
    },
    'bg-neutral-800 text-white',
    className
  );

  const arrowClasses = classNames(
    tooltipStyles.arrow,
    tooltipStyles.arrowPositions[position],
    'bg-neutral-800'
  );

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Wrap children with tooltip container and accessibility attributes
  return (
    <div
      className={tooltipStyles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <div
        role="tooltip"
        ref={tooltipRef}
        className={tooltipClasses}
        aria-hidden={!isVisible}
      >
        {content}
        <div className={arrowClasses} />
      </div>
      {React.cloneElement(React.Children.only(children) as React.ReactElement, {
        'aria-describedby': tooltipRef.current?.id,
        tabIndex: disabled ? undefined : 0
      })}
    </div>
  );
};

export default Tooltip;