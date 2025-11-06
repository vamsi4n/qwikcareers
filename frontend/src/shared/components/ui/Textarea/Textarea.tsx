import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { cn } from '../../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label for the textarea
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below the textarea
   */
  helperText?: string;

  /**
   * Whether the textarea should take full width
   */
  fullWidth?: boolean;

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

  /**
   * Enable auto-resize based on content
   */
  autoResize?: boolean;

  /**
   * Minimum number of rows (only applies when autoResize is true)
   */
  minRows?: number;

  /**
   * Maximum number of rows (only applies when autoResize is true)
   */
  maxRows?: number;
}

/**
 * Production-grade Textarea component with auto-resize and character count
 *
 * @example
 * <Textarea
 *   label="Description"
 *   placeholder="Enter description"
 *   error={errors.description}
 *   required
 *   maxLength={500}
 *   showCount
 * />
 *
 * @example
 * <Textarea
 *   label="Message"
 *   autoResize
 *   minRows={3}
 *   maxRows={10}
 * />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      wrapperClassName,
      labelClassName,
      showCount = false,
      required = false,
      className,
      disabled,
      maxLength,
      value,
      id,
      autoResize = false,
      minRows = 3,
      maxRows,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState('');
    const textareaValue = value !== undefined ? value : internalValue;
    const currentLength = String(textareaValue || '').length;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Generate unique ID if not provided
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;

        // Reset height to calculate scrollHeight properly
        textarea.style.height = 'auto';

        // Calculate new height
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const minHeight = minRows * lineHeight;
        const maxHeight = maxRows ? maxRows * lineHeight : Infinity;
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

        textarea.style.height = `${newHeight}px`;
      }
    }, [textareaValue, autoResize, minRows, maxRows]);

    // Base textarea styles
    const textareaStyles = cn(
      // Base
      'w-full',
      'font-normal',
      'border border-gray-300 rounded-lg',
      'bg-white text-gray-900 placeholder-gray-400',
      'transition-all duration-200',
      'px-4 py-3',

      // Focus styles
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',

      // Hover
      'hover:border-gray-400',

      // Disabled
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200',

      // Error state
      error && 'border-red-500 focus:ring-red-500',

      // Auto-resize
      autoResize && 'resize-none overflow-hidden',
      !autoResize && 'resize-y',

      className
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      props.onChange?.(e);
    };

    const setRefs = (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
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

        {/* Textarea Field */}
        <textarea
          ref={setRefs}
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={textareaValue}
          onChange={handleChange}
          rows={autoResize ? minRows : rows}
          className={textareaStyles}
          aria-invalid={!!error}
          aria-describedby={cn(
            error && errorId,
            helperText && helperId
          )}
          aria-required={required}
          {...props}
        />

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

Textarea.displayName = 'Textarea';

export default Textarea;
