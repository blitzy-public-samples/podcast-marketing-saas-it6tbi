// classnames v2.3.1
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Internal imports
import { colors, spacing } from '../../theme/index';
import { deepClone } from '../../lib/utils';
import type { CommonError } from '../../types/common';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  label?: string;
  error?: CommonError;
  className?: string;
}

/**
 * Human Tasks:
 * 1. Verify slider touch targets meet WCAG requirements on mobile devices
 * 2. Test slider keyboard navigation across different browsers
 * 3. Validate color contrast ratios for slider track and thumb
 * 4. Ensure smooth performance with React.memo if needed
 */

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  disabled = false,
  label,
  error,
  className
}) => {
  const [currentValue, setCurrentValue] = useState<number>(value);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  const getTrackStyle = useCallback(() => {
    const percentage = ((currentValue - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, 
        ${colors.primary[500]} 0%, 
        ${colors.primary[500]} ${percentage}%, 
        ${colors.neutral[200]} ${percentage}%, 
        ${colors.neutral[200]} 100%)`
    };
  }, [currentValue, min, max]);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    const keyActions: { [key: string]: number } = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: step * 10,
      PageDown: -step * 10,
      Home: min - currentValue,
      End: max - currentValue
    };

    const adjustment = keyActions[event.key];
    if (adjustment) {
      event.preventDefault();
      const newValue = Math.min(max, Math.max(min, currentValue + adjustment));
      handleSliderChange(newValue);
    }
  }, [currentValue, min, max, step, disabled]);

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  const handleSliderChange = useCallback((newValue: number) => {
    const clampedValue = Math.min(max, Math.max(min, newValue));
    setCurrentValue(clampedValue);
    onChange?.(clampedValue);
  }, [min, max, onChange]);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  const handleMouseDown = useCallback(() => {
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging && sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const newValue = min + percentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      handleSliderChange(steppedValue);
    }
  }, [isDragging, min, max, step, handleSliderChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  const formatError = useCallback((error: CommonError): string => {
    const errorClone = deepClone(error);
    return `Error [${errorClone.code}]: ${errorClone.message}`;
  }, []);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div className={classNames('relative flex flex-col w-full', className)}>
      {label && (
        <label
          className={classNames(
            'mb-2 text-sm font-medium',
            disabled ? 'text-neutral-400' : 'text-neutral-700'
          )}
        >
          {label}
        </label>
      )}
      <div
        ref={sliderRef}
        className={classNames(
          'relative h-6 flex items-center',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <div
          className="absolute w-full h-2 rounded-full"
          style={getTrackStyle()}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          disabled={disabled}
          className={classNames(
            'absolute w-full h-2 appearance-none bg-transparent cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
            'range-thumb:w-4 range-thumb:h-4 range-thumb:rounded-full',
            'range-thumb:bg-white range-thumb:border-2 range-thumb:border-primary-500',
            'range-thumb:transition-transform range-thumb:duration-150',
            isDragging && 'range-thumb:transform range-thumb:scale-110',
            disabled && 'cursor-not-allowed'
          )}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-label={label || 'Slider'}
          aria-disabled={disabled}
          role="slider"
        />
      </div>
      {error && (
        <div className="mt-2 text-sm text-error-500" role="alert">
          {formatError(error)}
        </div>
      )}
    </div>
  );
};

export default Slider;