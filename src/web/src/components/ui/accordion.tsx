// classnames v2.3.1
import classNames from 'classnames';
import React, { useState, useCallback, useRef, useEffect } from 'react';

// Internal imports
import { theme } from '../../theme/index';
import { deepClone } from '../../lib/utils';
import type { CommonError } from '../../types/common';

/**
 * Human Tasks:
 * 1. Verify keyboard navigation behavior across different browsers
 * 2. Test ARIA attributes with screen readers
 * 3. Validate animation performance on lower-end devices
 * 4. Ensure touch targets meet accessibility standards on mobile
 */

// Types for accordion items and props
interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  className?: string;
  onItemToggle?: (itemId: string, isExpanded: boolean) => void;
  onError?: (error: CommonError) => void;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const accordionStyles = {
  wrapper: classNames(
    'w-full',
    'rounded-lg',
    'border',
    'border-solid',
    `border-${theme.colors.border.light}`,
    'bg-white',
    'shadow-sm'
  ),
  item: classNames(
    'border-b',
    'border-solid',
    `border-${theme.colors.border.light}`,
    'last:border-b-0'
  ),
  button: (isExpanded: boolean) => classNames(
    'flex',
    'w-full',
    'items-center',
    'justify-between',
    'px-4',
    'py-3',
    'text-left',
    'transition-colors',
    'duration-200',
    'ease-in-out',
    'hover:bg-gray-50',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    `focus:ring-${theme.colors.primary[400]}`,
    {
      'bg-gray-50': isExpanded,
      [`text-${theme.colors.text.primary}`]: !isExpanded,
      [`text-${theme.colors.text.accent}`]: isExpanded
    }
  ),
  content: (isExpanded: boolean) => classNames(
    'overflow-hidden',
    'transition-all',
    'duration-200',
    'ease-in-out',
    {
      'max-h-0': !isExpanded,
      'max-h-screen': isExpanded
    }
  ),
  contentInner: classNames(
    'p-4',
    `text-${theme.colors.text.secondary}`,
    `text-${theme.typography.fontSize.body}`
  ),
  icon: (isExpanded: boolean) => classNames(
    'transform',
    'transition-transform',
    'duration-200',
    'ease-in-out',
    {
      'rotate-180': isExpanded
    }
  )
};

// Requirement: Reusability (1.3 Scope/Core Features and Functionalities/User Management)
export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultExpanded = [],
  allowMultiple = false,
  className,
  onItemToggle,
  onError
}) => {
  // State for tracking expanded items
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);
  
  // Refs for managing focus and animations
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  const handleItemClick = useCallback((itemId: string) => {
    try {
      setExpandedItems(prevExpanded => {
        const newExpanded = deepClone(prevExpanded);
        const itemIndex = newExpanded.indexOf(itemId);

        if (itemIndex > -1) {
          newExpanded.splice(itemIndex, 1);
        } else {
          if (!allowMultiple) {
            newExpanded.length = 0;
          }
          newExpanded.push(itemId);
        }

        // Notify parent component of state change
        if (onItemToggle) {
          onItemToggle(itemId, itemIndex === -1);
        }

        return newExpanded;
      });
    } catch (error) {
      if (onError) {
        onError({
          code: 'ACCORDION_TOGGLE_ERROR',
          message: 'Failed to toggle accordion item'
        });
      }
    }
  }, [allowMultiple, onItemToggle, onError]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent, itemId: string, index: number) => {
    const keys = {
      ARROW_UP: 'ArrowUp',
      ARROW_DOWN: 'ArrowDown',
      HOME: 'Home',
      END: 'End'
    };

    switch (event.key) {
      case keys.ARROW_UP:
        event.preventDefault();
        const prevIndex = index - 1;
        if (prevIndex >= 0) {
          buttonRefs.current[items[prevIndex].id]?.focus();
        }
        break;
      case keys.ARROW_DOWN:
        event.preventDefault();
        const nextIndex = index + 1;
        if (nextIndex < items.length) {
          buttonRefs.current[items[nextIndex].id]?.focus();
        }
        break;
      case keys.HOME:
        event.preventDefault();
        buttonRefs.current[items[0].id]?.focus();
        break;
      case keys.END:
        event.preventDefault();
        buttonRefs.current[items[items.length - 1].id]?.focus();
        break;
    }
  }, [items]);

  // Update content height on window resize
  useEffect(() => {
    const handleResize = () => {
      expandedItems.forEach(itemId => {
        const content = contentRefs.current[itemId];
        if (content) {
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [expandedItems]);

  return (
    <div 
      className={classNames(accordionStyles.wrapper, className)}
      role="presentation"
    >
      {items.map((item, index) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <div 
            key={item.id}
            className={accordionStyles.item}
          >
            <button
              ref={el => buttonRefs.current[item.id] = el}
              id={`accordion-button-${item.id}`}
              aria-controls={`accordion-content-${item.id}`}
              aria-expanded={isExpanded}
              className={accordionStyles.button(isExpanded)}
              disabled={item.disabled}
              onClick={() => handleItemClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id, index)}
            >
              <span className={`text-${theme.typography.fontSize.body} font-${theme.typography.fontWeight.medium}`}>
                {item.title}
              </span>
              <svg
                className={accordionStyles.icon(isExpanded)}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              ref={el => contentRefs.current[item.id] = el}
              id={`accordion-content-${item.id}`}
              role="region"
              aria-labelledby={`accordion-button-${item.id}`}
              className={accordionStyles.content(isExpanded)}
            >
              <div className={accordionStyles.contentInner}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};