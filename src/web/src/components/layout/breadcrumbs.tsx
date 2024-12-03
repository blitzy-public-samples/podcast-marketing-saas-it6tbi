// react v18.0.0
import React from 'react';
// classnames v2.3.1
import classnames from 'classnames';

import { colors, typography } from '../../theme/index';
import { formatError } from '../../lib/utils';
import { CommonError } from '../../types/common';
import Tooltip from '../ui/tooltip';

/**
 * Human Tasks:
 * 1. Verify breadcrumb navigation works correctly with browser history
 * 2. Test keyboard navigation and screen reader compatibility
 * 3. Validate breadcrumb truncation on mobile devices
 * 4. Ensure color contrast meets WCAG 2.1 AA standards
 */

// Requirement: User Interface Enhancements (8.1 User Interface Design/Interface Elements)
// Base styles for the breadcrumbs component
const breadcrumbStyles = {
  container: classnames(
    'flex items-center flex-wrap',
    'py-2 px-4',
    'text-sm'
  ),
  list: 'flex items-center space-x-2',
  item: classnames(
    'flex items-center',
    'text-neutral-600 hover:text-neutral-900',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2',
    'focus:ring-primary-400 focus:ring-offset-2'
  ),
  separator: 'text-neutral-400 mx-2',
  current: classnames(
    'font-medium',
    'text-neutral-900',
    'cursor-default'
  ),
  icon: classnames(
    'w-4 h-4',
    'mr-1'
  )
};

interface BreadcrumbItem {
  // Label to display in the breadcrumb
  label: string;
  // Path or identifier for navigation
  path: string;
  // Optional icon component
  icon?: React.ReactNode;
  // Optional tooltip content
  tooltip?: string;
}

interface BreadcrumbsProps {
  // Array of breadcrumb items to display
  items: BreadcrumbItem[];
  // Callback function for navigation
  onNavigate: (path: string) => void;
}

// Requirement: User Interface Enhancements (8.1 User Interface Design/Interface Elements)
// Breadcrumbs component for displaying navigation hierarchy
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  // Handle click events for breadcrumb items
  const handleClick = (path: string, isLast: boolean) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (!isLast) {
      try {
        onNavigate(path);
      } catch (error) {
        const formattedError = formatError(error as CommonError);
        console.error('Breadcrumb navigation error:', formattedError);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyPress = (path: string, isLast: boolean) => (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isLast) {
        try {
          onNavigate(path);
        } catch (error) {
          const formattedError = formatError(error as CommonError);
          console.error('Breadcrumb navigation error:', formattedError);
        }
      }
    }
  };

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  // Render breadcrumbs with proper ARIA attributes and keyboard navigation
  return (
    <nav aria-label="Breadcrumb" className={breadcrumbStyles.container}>
      <ol className={breadcrumbStyles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const itemContent = (
            <>
              {item.icon && (
                <span className={breadcrumbStyles.icon} aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </>
          );

          return (
            <li key={item.path} className="flex items-center">
              {isLast ? (
                <span
                  className={breadcrumbStyles.current}
                  aria-current="page"
                >
                  {itemContent}
                </span>
              ) : (
                <>
                  {item.tooltip ? (
                    <Tooltip content={item.tooltip}>
                      <a
                        href={item.path}
                        className={breadcrumbStyles.item}
                        onClick={handleClick(item.path, isLast)}
                        onKeyPress={handleKeyPress(item.path, isLast)}
                        tabIndex={0}
                      >
                        {itemContent}
                      </a>
                    </Tooltip>
                  ) : (
                    <a
                      href={item.path}
                      className={breadcrumbStyles.item}
                      onClick={handleClick(item.path, isLast)}
                      onKeyPress={handleKeyPress(item.path, isLast)}
                      tabIndex={0}
                    >
                      {itemContent}
                    </a>
                  )}
                  <span 
                    className={breadcrumbStyles.separator}
                    aria-hidden="true"
                  >
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;