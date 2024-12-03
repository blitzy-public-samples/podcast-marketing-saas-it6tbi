// @testing-library/react v13.4.0
// @testing-library/jest-dom v5.16.5
// react v18.0.0

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Button } from '../../../src/components/ui/button';
import { formatError } from '../../../src/lib/utils';
import { theme } from '../../../src/theme/index';

// Human Tasks:
// 1. Verify test coverage meets minimum threshold (>90%)
// 2. Test with actual screen readers for accessibility validation
// 3. Run visual regression tests across different browsers
// 4. Validate button behavior on touch devices
// 5. Test with different keyboard navigation patterns

describe('Button Component', () => {
  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button label="Click me" />);
      const button = screen.getByRole('button', { name: /click me/i });
      
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary-600'); // Default primary variant
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('aria-busy');
    });

    it('renders with custom className', () => {
      const customClass = 'custom-button';
      render(<Button label="Custom" className={customClass} />);
      
      expect(screen.getByRole('button')).toHaveClass(customClass);
    });

    it('renders with different variants', () => {
      const variants = ['primary', 'secondary', 'tertiary', 'danger', 'ghost'] as const;
      
      variants.forEach(variant => {
        const { rerender } = render(<Button label="Variant" variant={variant} />);
        const button = screen.getByRole('button');
        
        // Verify variant-specific styles
        switch (variant) {
          case 'primary':
            expect(button).toHaveClass('bg-primary-600');
            break;
          case 'secondary':
            expect(button).toHaveClass('bg-secondary-100');
            break;
          case 'tertiary':
            expect(button).toHaveClass('bg-transparent');
            break;
          case 'danger':
            expect(button).toHaveClass('bg-red-600');
            break;
          case 'ghost':
            expect(button).toHaveClass('bg-transparent');
            break;
        }
        
        rerender(<></>); // Cleanup
      });
    });

    it('renders with different sizes', () => {
      const sizes = ['small', 'medium', 'large'] as const;
      
      sizes.forEach(size => {
        const { rerender } = render(<Button label="Size" size={size} />);
        const button = screen.getByRole('button');
        
        // Verify size-specific styles
        switch (size) {
          case 'small':
            expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
            break;
          case 'medium':
            expect(button).toHaveClass('px-4', 'py-2', 'text-base');
            break;
          case 'large':
            expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
            break;
        }
        
        rerender(<></>); // Cleanup
      });
    });
  });

  // Requirement: Code Quality (9.5 Development & Deployment/Development Environment)
  describe('Interaction', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button label="Click me" onClick={handleClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents click when disabled', () => {
      const handleClick = jest.fn();
      render(<Button label="Disabled" onClick={handleClick} disabled />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('prevents click when loading', () => {
      const handleClick = jest.fn();
      render(<Button label="Loading" onClick={handleClick} loading />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('handles error in click handler', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      const handleClick = () => { throw error; };
      
      render(<Button label="Error" onClick={handleClick} />);
      fireEvent.click(screen.getByRole('button'));
      
      expect(consoleError).toHaveBeenCalledWith(formatError({ code: 'ERROR', message: error.message }));
      consoleError.mockRestore();
    });
  });

  // Requirement: Accessibility (8.1 User Interface Design/Design Specifications/Accessibility)
  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Button label="Accessible" ariaLabel="Custom label" />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('uses default label as aria-label when not provided', () => {
      const label = 'Default label';
      render(<Button label={label} />);
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', label);
    });

    it('indicates disabled state with aria-disabled', () => {
      render(<Button label="Disabled" disabled />);
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('indicates loading state with aria-busy', () => {
      render(<Button label="Loading" loading />);
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
  });

  // Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">icon</span>;

    it('renders icon on the left by default', () => {
      render(<Button label="Icon" icon={<TestIcon />} />);
      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');
      
      expect(button).toContainElement(icon);
      expect(button.firstElementChild).toContainElement(icon);
    });

    it('renders icon on the right when specified', () => {
      render(<Button label="Icon" icon={<TestIcon />} iconPosition="right" />);
      const button = screen.getByRole('button');
      const icon = screen.getByTestId('test-icon');
      
      expect(button).toContainElement(icon);
      expect(button.lastElementChild).toContainElement(icon);
    });

    it('hides icon when loading', () => {
      render(<Button label="Loading" icon={<TestIcon />} loading />);
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
      expect(screen.getByRole('button')).toContainElement(screen.getByRole('img', { hidden: true }));
    });
  });
});