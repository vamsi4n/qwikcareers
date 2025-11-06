import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '../../../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label for the checkbox
   */
  label?: string;

  /**
   * Description text below the label
   */
  description?: string;

  /**
   * Indeterminate state (for parent checkboxes in a group)
   */
  indeterminate?: boolean;

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Error message
   */
  error?: string;

  /**
   * Additional wrapper CSS classes
   */
  wrapperClassName?: string;
}

/**
 * Production-grade Checkbox component with indeterminate state
 *
 * @example
 * <Checkbox
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 *   required
 * />
 *
 * @example
 * <Checkbox
 *   label="Select all"
 *   indeterminate={someSelected && !allSelected}
 *   checked={allSelected}
 *   onChange={handleSelectAll}
 * />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      indeterminate = false,
      size = 'md',
      error,
      wrapperClassName,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Handle indeterminate state
    useEffect(() => {
      const checkbox = internalRef.current;
      if (checkbox) {
        checkbox.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Combine refs
    const setRefs = (element: HTMLInputElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <div className={cn('flex items-start gap-3', wrapperClassName)}>
        <div className="flex items-center h-6">
          <input
            ref={setRefs}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className={cn(
              // Base styles
              sizeClasses[size],
              'rounded border-gray-300',
              'text-blue-600',
              'transition-colors duration-200',

              // Focus styles
              'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',

              // Disabled styles
              'disabled:opacity-50 disabled:cursor-not-allowed',

              // Error styles
              error && 'border-red-500 focus:ring-red-500',

              // Hover
              !disabled && 'hover:border-blue-500 cursor-pointer',

              className
            )}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            {...props}
          />
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'font-medium text-gray-900 block',
                  labelSizeClasses[size],
                  disabled && 'text-gray-500 cursor-not-allowed',
                  !disabled && 'cursor-pointer'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
            {error && (
              <p
                id={`${checkboxId}-error`}
                className="text-sm text-red-600 mt-1"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
