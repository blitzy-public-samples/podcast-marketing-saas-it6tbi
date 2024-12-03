// react v18.0.0
import React, { useState, useRef, useEffect, ReactNode } from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { colors, spacing } from '../../theme/index';
import { deepClone } from '../../lib/utils';
import Tooltip from './tooltip';

/**
 * Human Tasks:
 * 1. Verify popover positioning works correctly across different viewport sizes
 * 2. Test keyboard navigation and screen reader compatibility
 * 3. Ensure popover animations are smooth and performant
 * 4. Validate popover content rendering with different content lengths
 */

// Requirement: User Interface Enhancements (8.1 User Interface Design/Interface Elements)
// Base styles for the popover component using theme tokens
const popoverStyles = {
  container: classnames(
    'relative inline-block'
  ),
  popover: classnames(
    'absolute z-50',
    'bg-white dark:bg-neutral-800',
    'rounded-lg shadow-lg',
    'border border-neutral-200 dark:border-neutral-700',
    'transition-all duration-200',
    'min-w-[200px] max-w-[400px]'
  ),
  content: classnames(
    'p-4',
    'text-sm text-neutral-900 dark:text-neutral-100'
  ),
  arrow: classnames(
    'absolute w-2 h-2',
    'bg-white dark:bg-neutral-800',
    'border-t border-l border-neutral-200 dark:border-neutral-700',
    'rotate-45'
  ),
  // Default positioning classes
  positions: {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  },
  // Arrow positioning classes
  arrowPositions: {
    top: 'bottom-[-5px] left-1/2 -translate-x-1/2',
    bottom: 'top-[-5px] left-1/2 -translate-x-1/2',
    left: 'right-[-5px] top-1/2 -translate-y-1/2',
    right: 'left-[-5px] top-1/2 -translate-y-1/2'
  }
};

interface PopoverProps {
  /** Content to be displayed in the popover */
  content: string | ReactNode;
  /** Element that triggers the popover */
  children: ReactNode;
  /** Position of the popover relative to the trigger element */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Whether the popover should be shown */
  show?: boolean;
  /** Custom class names for the popover */
  className?: string;
  /** Whether the popover should be disabled */
  disabled?: boolean;
  /** Whether to show a tooltip when hovering over the trigger */
  showTooltip?: boolean;
  /** Custom tooltip content */
  tooltipContent?: string;
}

// Requirement: User Interface Enhancements (8.1 User Interface Design/Interface Elements)
// Popover component for displaying contextual information or actions
const Popover: React.FC<PopoverProps> = ({
  content,
  children,
  position = 'bottom',
  show: controlledShow,
  className,
  disabled = false,
  showTooltip = false,
  tooltipContent
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Handle controlled visibility if show prop is provided
  useEffect(() => {
    if (controlledShow !== undefined) {
      setIsVisible(controlledShow);
    }
  }, [controlledShow]);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Handle keyboard interactions and click outside for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Escape':
          if (isVisible) {
            setIsVisible(false);
            triggerRef.current?.focus();
          }
          break;
        case 'Tab':
          if (isVisible && !popoverRef.current?.contains(document.activeElement)) {
            setIsVisible(false);
          }
          break;
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible &&
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, disabled]);

  const handleToggle = () => {
    if (!disabled) {
      setIsVisible(!isVisible);
    }
  };

  // Generate popover classes based on position and theme
  const popoverClasses = classnames(
    popoverStyles.popover,
    popoverStyles.positions[position],
    {
      'opacity-0 invisible': !isVisible,
      'opacity-100 visible': isVisible
    },
    className
  );

  const arrowClasses = classnames(
    popoverStyles.arrow,
    popoverStyles.arrowPositions[position]
  );

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Wrap children with popover container and accessibility attributes
  const triggerElement = (
    <div
      ref={triggerRef}
      className={popoverStyles.container}
      onClick={handleToggle}
      onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-expanded={isVisible}
      aria-haspopup="true"
      aria-disabled={disabled}
    >
      {children}
    </div>
  );

  return (
    <>
      {showTooltip ? (
        <Tooltip content={tooltipContent || content} disabled={disabled}>
          {triggerElement}
        </Tooltip>
      ) : (
        triggerElement
      )}
      <div
        ref={popoverRef}
        className={popoverClasses}
        role="dialog"
        aria-hidden={!isVisible}
        aria-modal="true"
      >
        <div className={popoverStyles.content}>
          {content}
        </div>
        <div className={arrowClasses} aria-hidden="true" />
      </div>
    </>
  );
};

export default Popover;