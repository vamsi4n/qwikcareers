import React, { forwardRef, ReactNode, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label for the input field
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below the input
   */
  helperText?: string;

  /**
   * Size variant of the input
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the input should take full width
   */
  fullWidth?: boolean;

  /**
   * Icon to display at the start of the input
   */
  leftIcon?: ReactNode;

  /**
   * Icon to display at the end of the input
   */
  rightIcon?: ReactNode;

  /**
   * Additional wrapper CSS classes
   */
  wrapperClassName?: string;

  /**
   * Additional label CSS classes
   */
  labelClassName?: string;

  /**
   * Show character count (requires maxLength prop)
   */
  showCount?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;
}

/**
 * Production-grade Input component with validation, error states, and accessibility
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={errors.email}
 *   required
 * />
 *
 * @example
 * <Input
 *   label="Search"
 *   leftIcon={<MagnifyingGlassIcon />}
 *   placeholder="Search..."
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      wrapperClassName,
      labelClassName,
      showCount = false,
      required = false,
      className,
      disabled,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState('');
    const inputValue = value !== undefined ? value : internalValue;
    const currentLength = String(inputValue || '').length;

    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Size-specific styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm min-h-[36px]',
      md: 'px-4 py-2.5 text-base min-h-[44px]',
      lg: 'px-5 py-3 text-lg min-h-[52px]',
    };

    // Icon size mapping
    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Base input styles
    const inputStyles = cn(
      // Base
      'w-full',
      'font-normal',
      'border border-gray-300 rounded-lg',
      'bg-white text-gray-900 placeholder-gray-400',
      'transition-all duration-200',

      // Focus styles
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',

      // Hover
      'hover:border-gray-400',

      // Disabled
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200',

      // Error state
      error && 'border-red-500 focus:ring-red-500',

      // Add padding for icons
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',

      // Size
      sizeStyles[size],

      className
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      props.onChange?.(e);
    };

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-gray-700',
              disabled && 'text-gray-500',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                'text-gray-400',
                iconSizeClasses[size],
                disabled && 'opacity-50'
              )}
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={inputValue}
            onChange={handleChange}
            className={inputStyles}
            aria-invalid={!!error}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
            aria-required={required}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'text-gray-400',
                iconSizeClasses[size],
                disabled && 'opacity-50'
              )}
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message / Character Count */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            {/* Error Message */}
            {error && (
              <p
                id={errorId}
                className="text-sm text-red-600 flex items-center gap-1"
                role="alert"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </p>
            )}

            {/* Helper Text */}
            {!error && helperText && (
              <p id={helperId} className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>

          {/* Character Count */}
          {showCount && maxLength && (
            <p
              className={cn(
                'text-sm tabular-nums',
                currentLength > maxLength ? 'text-red-600' : 'text-gray-500'
              )}
              aria-live="polite"
            >
              {currentLength} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
