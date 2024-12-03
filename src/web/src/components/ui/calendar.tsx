/**
 * Human Tasks:
 * 1. Verify calendar accessibility with screen readers
 * 2. Test keyboard navigation across all supported browsers
 * 3. Validate date selection behavior with form validation
 * 4. Ensure calendar styling matches design system
 * 5. Test responsive layout on different screen sizes
 */

// react v18.0.0
import { useState, useEffect } from 'react';

// Internal imports
import { theme } from '../../theme/index';
import { formatError } from '../../lib/utils';
import useForm from '../../hooks/use-form';
import type { CommonError } from '../../types/common';

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
interface CalendarProps {
  // Selected date value
  value?: Date;
  // Date change handler
  onChange?: (date: Date) => void;
  // Minimum selectable date
  minDate?: Date;
  // Maximum selectable date
  maxDate?: Date;
  // Initial visible month/year
  defaultMonth?: Date;
  // Custom class name
  className?: string;
  // Disabled state
  disabled?: boolean;
  // Error message
  error?: string;
  // Required field
  required?: boolean;
  // ARIA label
  ariaLabel?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  defaultMonth = new Date(),
  className = '',
  disabled = false,
  error,
  required = false,
  ariaLabel = 'Calendar',
}) => {
  // Current visible month/year
  const [currentMonth, setCurrentMonth] = useState<Date>(defaultMonth);
  
  // Selected date state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  // Form integration
  const { handleChange, errors } = useForm({
    selectedDate: value?.toISOString() || '',
  });

  // Days of the week
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  const calendarStyles = {
    container: `
      relative
      w-full
      max-w-[320px]
      bg-white
      rounded-lg
      shadow-lg
      p-4
      ${theme.typography.variants.interactive}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `,
    header: `
      flex
      justify-between
      items-center
      mb-4
      ${theme.typography.variants.content}
    `,
    weekDays: `
      grid
      grid-cols-7
      gap-1
      mb-2
      text-center
      ${theme.typography.variants.interactive}
    `,
    days: `
      grid
      grid-cols-7
      gap-1
    `,
    day: `
      aspect-square
      flex
      items-center
      justify-center
      rounded-full
      cursor-pointer
      hover:bg-primary-100
      transition-colors
      ${theme.typography.variants.interactive}
    `,
    selectedDay: `
      bg-primary-600
      text-white
      hover:bg-primary-700
    `,
    disabledDay: `
      opacity-50
      cursor-not-allowed
      hover:bg-transparent
    `,
    error: `
      text-red-500
      text-sm
      mt-1
      ${theme.typography.variants.interactive}
    `,
  };

  // Get days in month
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if date is within allowed range
  const isDateInRange = (date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  // Generate calendar days
  const generateDays = (): (Date | null)[] => {
    const days: (Date | null)[] = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (date: Date | null) => {
    if (!date || disabled || !isDateInRange(date)) return;

    try {
      setSelectedDate(date);
      onChange?.(date);
      handleChange({
        target: {
          name: 'selectedDate',
          value: date.toISOString(),
        },
      } as React.ChangeEvent<HTMLInputElement>);
    } catch (err) {
      console.error(formatError(err as CommonError));
    }
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div
      className={calendarStyles.container}
      role="application"
      aria-label={ariaLabel}
    >
      {/* Calendar Header */}
      <div className={calendarStyles.header}>
        <button
          onClick={previousMonth}
          disabled={disabled}
          aria-label="Previous month"
          className="p-1 rounded hover:bg-gray-100"
        >
          ←
        </button>
        <div>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button
          onClick={nextMonth}
          disabled={disabled}
          aria-label="Next month"
          className="p-1 rounded hover:bg-gray-100"
        >
          →
        </button>
      </div>

      {/* Week Days */}
      <div className={calendarStyles.weekDays}>
        {weekDays.map((day) => (
          <div key={day} aria-hidden="true">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className={calendarStyles.days} role="grid">
        {generateDays().map((date, index) => {
          const isSelected = date && selectedDate?.toDateString() === date.toDateString();
          const isDisabled = date && !isDateInRange(date);

          return (
            <div
              key={index}
              role="gridcell"
              aria-selected={isSelected}
              aria-disabled={isDisabled}
              className={`
                ${calendarStyles.day}
                ${isSelected ? calendarStyles.selectedDay : ''}
                ${isDisabled ? calendarStyles.disabledDay : ''}
              `}
              onClick={() => handleDateSelect(date)}
            >
              {date?.getDate()}
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {(error || errors.selectedDate) && (
        <div 
          className={calendarStyles.error}
          role="alert"
        >
          {error || errors.selectedDate}
        </div>
      )}

      {/* Hidden input for form integration */}
      <input
        type="hidden"
        name="selectedDate"
        value={selectedDate?.toISOString() || ''}
        required={required}
      />
    </div>
  );
};

export default Calendar;