/**
 * Human Tasks:
 * 1. Verify tab component accessibility with screen readers
 * 2. Test keyboard navigation across all tab panels
 * 3. Validate tab styles match design system documentation
 * 4. Test tab responsiveness across different viewport sizes
 * 5. Ensure tab animations are disabled when reduced motion is preferred
 */

// classnames v2.3.1
import classnames from 'classnames';
import { useState, useCallback } from 'react';

import { colors, spacing, typography } from '../../theme/index';
import { formatError } from '../../lib/utils';
import type { CommonError } from '../../types/common';
import { Button } from './button';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underlined';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onChange?: (index: number) => void;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const baseTabListStyles = {
  display: 'flex',
  borderBottom: `1px solid ${colors.border.light}`,
  marginBottom: spacing.component.gap,
};

const baseTabStyles = {
  fontFamily: typography.fontFamily.body,
  fontWeight: typography.fontWeight.buttonWeight,
  transition: 'all 150ms ease-in-out',
};

// Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
const sizeStyles = {
  small: {
    padding: `${spacing.small} ${spacing.medium}`,
    fontSize: typography.fontSize.sm,
  },
  medium: {
    padding: `${spacing.medium} ${spacing.large}`,
    fontSize: typography.fontSize.base,
  },
  large: {
    padding: `${spacing.large} ${spacing.large}`,
    fontSize: typography.fontSize.lg,
  },
};

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const variantStyles = {
  default: {
    tab: classnames(
      'border-b-2',
      'border-transparent',
      'hover:text-primary-600',
      'hover:border-primary-300',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary-500',
      'focus:ring-offset-2'
    ),
    activeTab: classnames(
      'border-primary-500',
      'text-primary-600'
    ),
  },
  pills: {
    tab: classnames(
      'rounded-md',
      'hover:bg-primary-50',
      'hover:text-primary-600',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary-500',
      'focus:ring-offset-2'
    ),
    activeTab: classnames(
      'bg-primary-100',
      'text-primary-700'
    ),
  },
  underlined: {
    tab: classnames(
      'border-b-2',
      'border-transparent',
      'hover:border-primary-300',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary-500',
      'focus:ring-offset-2'
    ),
    activeTab: classnames(
      'border-primary-500',
      'text-primary-700'
    ),
  },
};

// Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab = 0,
  orientation = 'horizontal',
  variant = 'default',
  size = 'medium',
  className,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Handle tab click with error handling
  const handleTabClick = useCallback((tabIndex: number) => {
    try {
      if (tabIndex !== activeTab) {
        setActiveTab(tabIndex);
        onChange?.(tabIndex);
      }
    } catch (error) {
      const formattedError = formatError(error as CommonError);
      console.error(formattedError);
    }
  }, [activeTab, onChange]);

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  const tabListClasses = classnames(
    baseTabListStyles,
    {
      'flex-col': orientation === 'vertical',
      'overflow-x-auto': orientation === 'horizontal',
      'scrollbar-thin': orientation === 'horizontal',
      'scrollbar-thumb-gray-300': orientation === 'horizontal',
      'scrollbar-track-transparent': orientation === 'horizontal',
    },
    className
  );

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div className="w-full" role="tablist" aria-orientation={orientation}>
      {/* Tab List */}
      <div className={tabListClasses}>
        {tabs.map((tab, index) => (
          <Button
            key={tab.id}
            label={tab.label}
            onClick={() => handleTabClick(index)}
            className={classnames(
              baseTabStyles,
              sizeStyles[size],
              variantStyles[variant].tab,
              {
                [variantStyles[variant].activeTab]: activeTab === index,
                'opacity-50 cursor-not-allowed': tab.disabled,
              }
            )}
            disabled={tab.disabled}
            type="button"
            ariaLabel={`${tab.label} tab`}
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={tab.disabled}
            role="tab"
          />
        ))}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== index}
          className={classnames(
            'focus:outline-none',
            'transition-opacity',
            'duration-200',
            {
              'opacity-100': activeTab === index,
              'opacity-0': activeTab !== index,
            }
          )}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;