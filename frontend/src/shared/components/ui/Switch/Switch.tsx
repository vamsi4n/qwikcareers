import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label for the switch
   */
  label?: string;

  /**
   * Description text below the label
   */
  description?: string;

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

  /**
   * Label position
   */
  labelPosition?: 'left' | 'right';
}

/**
 * Production-grade Switch toggle component
 *
 * @example
 * <Switch
 *   label="Enable notifications"
 *   checked={notificationsEnabled}
 *   onChange={(e) => setNotificationsEnabled(e.target.checked)}
 * />
 *
 * @example
 * <Switch
 *   label="Dark Mode"
 *   description="Use dark theme"
 *   labelPosition="left"
 *   checked={darkMode}
 *   onChange={(e) => setDarkMode(e.target.checked)}
 * />
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      size = 'md',
      error,
      wrapperClassName,
      className,
      disabled,
      id,
      labelPosition = 'right',
      checked,
      ...props
    },
    ref
  ) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: {
        switch: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
      },
      md: {
        switch: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
      },
      lg: {
        switch: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
      },
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const switchElement = (
      <label
        htmlFor={switchId}
        className={cn(
          'relative inline-flex items-center',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          className="sr-only"
          disabled={disabled}
          checked={checked}
          aria-describedby={error ? `${switchId}-error` : undefined}
          {...props}
        />
        <div
          className={cn(
            // Base
            sizeClasses[size].switch,
            'rounded-full',
            'transition-colors duration-200 ease-in-out',

            // States
            checked ? 'bg-blue-600' : 'bg-gray-200',
            disabled && 'opacity-50',
            error && !checked && 'bg-red-200',

            // Hover
            !disabled && 'hover:bg-opacity-90',

            className
          )}
        >
          <span
            className={cn(
              // Base
              sizeClasses[size].thumb,
              'inline-block',
              'bg-white',
              'rounded-full',
              'shadow-lg',
              'transform',
              'transition-transform duration-200 ease-in-out',
              'translate-x-0.5',

              // Checked state
              checked && sizeClasses[size].translate
            )}
          />
        </div>
      </label>
    );

    const labelContent = (label || description) && (
      <div className="flex-1">
        {label && (
          <span
            className={cn(
              'font-medium text-gray-900 block',
              labelSizeClasses[size],
              disabled && 'text-gray-500'
            )}
          >
            {label}
          </span>
        )}
        {description && (
          <span className="text-sm text-gray-600 block mt-1">{description}</span>
        )}
      </div>
    );

    return (
      <div className={cn('flex items-start gap-3', wrapperClassName)}>
        {labelPosition === 'left' && labelContent}
        {switchElement}
        {labelPosition === 'right' && labelContent}

        {error && (
          <p
            id={`${switchId}-error`}
            className="text-sm text-red-600 mt-1 w-full"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
