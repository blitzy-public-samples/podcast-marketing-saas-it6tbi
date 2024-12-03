// React v18.0.0
// classnames v2.3.1

import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { colors, spacing, typography } from '../../theme/index';
import { formatError } from '../../lib/utils';
import { APP_NAME } from '../../lib/constants';
import Input from './input';
import { Button } from './button';

/**
 * Human Tasks:
 * 1. Verify command component accessibility with screen readers
 * 2. Test command execution performance with different input sizes
 * 3. Validate command styling matches design system specifications
 * 4. Test command component responsiveness across different devices
 */

interface CommandProps {
  // Placeholder text for the command input
  placeholder?: string;
  // Callback function when command is executed
  onExecute?: (command: string) => void;
  // List of available commands for validation
  commands?: string[];
  // Initial command value
  initialValue?: string;
  // Whether the command input is disabled
  disabled?: boolean;
  // Loading state during command execution
  loading?: boolean;
  // Additional CSS classes
  className?: string;
  // Error message to display
  error?: string;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const Command: React.FC<CommandProps> = ({
  placeholder = `Enter a command for ${APP_NAME}...`,
  onExecute,
  commands = [],
  initialValue = '',
  disabled = false,
  loading = false,
  className = '',
  error,
}) => {
  // State for command input value
  const [command, setCommand] = useState<string>(initialValue);
  // State for command validation
  const [isValid, setIsValid] = useState<boolean>(true);

  // Update command validation when input changes
  useEffect(() => {
    if (commands.length > 0) {
      setIsValid(commands.includes(command) || command === '');
    }
  }, [command, commands]);

  // Handle command input changes
  const handleCommandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(event.target.value);
  };

  // Handle command execution
  const handleExecute = () => {
    if (!command.trim() || disabled || loading || !onExecute) return;

    try {
      onExecute(command);
      setCommand('');
    } catch (err) {
      console.error(formatError(err));
    }
  };

  // Handle enter key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleExecute();
    }
  };

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  const containerStyles = classnames(
    'flex',
    'items-center',
    'gap-2',
    'w-full',
    'max-w-2xl',
    'p-2',
    'rounded-lg',
    'border',
    'border-gray-200',
    'bg-white',
    'shadow-sm',
    'transition-all',
    'duration-200',
    {
      'opacity-75': disabled,
      'border-red-500': !isValid || error,
    },
    className
  );

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  return (
    <div
      className={containerStyles}
      role="group"
      aria-label="Command input with execute button"
    >
      <Input
        name="command"
        value={command}
        onChange={handleCommandChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        error={!isValid ? 'Invalid command' : error}
        className="flex-1"
        aria-label="Command input"
      />
      
      <Button
        label="Execute"
        onClick={handleExecute}
        disabled={disabled || !isValid || !command.trim()}
        loading={loading}
        variant="primary"
        size="medium"
        ariaLabel="Execute command"
        className="shrink-0"
      />
    </div>
  );
};

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
export default Command;