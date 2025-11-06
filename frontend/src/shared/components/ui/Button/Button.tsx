import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';

  /**
   * Size of the button
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether the button should take full width of its container
   */
  fullWidth?: boolean;

  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;

  /**
   * Icon to display before the button text
   */
  leftIcon?: ReactNode;

  /**
   * Icon to display after the button text
   */
  rightIcon?: ReactNode;

  /**
   * Button content
   */
  children?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Loading text to show when isLoading is true
   */
  loadingText?: string;
}

/**
 * Production-grade Button component with accessibility, variants, and loading states
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * @example
 * <Button variant="danger" isLoading loadingText="Deleting...">
 *   Delete
 * </Button>
 *
 * @example
 * <Button variant="outline" leftIcon={<PlusIcon />}>
 *   Add Item
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      loadingText,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles applied to all buttons
    const baseStyles = cn(
      // Layout & display
      'inline-flex items-center justify-center gap-2',
      'relative overflow-hidden',
      'font-medium leading-none',
      'border border-transparent',
      'rounded-lg',
      'transition-all duration-200 ease-in-out',

      // Focus styles for accessibility
      'focus:outline-none focus:ring-2 focus:ring-offset-2',

      // Disabled styles
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',

      // Full width option
      fullWidth && 'w-full'
    );

    // Variant-specific styles
    const variantStyles = {
      primary: cn(
        'bg-gradient-to-r from-blue-600 to-blue-700',
        'text-white',
        'hover:from-blue-700 hover:to-blue-800',
        'active:from-blue-800 active:to-blue-900',
        'focus:ring-blue-500',
        'shadow-md hover:shadow-lg',
        'transform hover:scale-[1.02] active:scale-[0.98]'
      ),
      secondary: cn(
        'bg-gray-100 text-gray-900',
        'hover:bg-gray-200',
        'active:bg-gray-300',
        'focus:ring-gray-500',
        'border-gray-200'
      ),
      danger: cn(
        'bg-gradient-to-r from-red-600 to-red-700',
        'text-white',
        'hover:from-red-700 hover:to-red-800',
        'active:from-red-800 active:to-red-900',
        'focus:ring-red-500',
        'shadow-md hover:shadow-lg',
        'transform hover:scale-[1.02] active:scale-[0.98]'
      ),
      success: cn(
        'bg-gradient-to-r from-green-600 to-green-700',
        'text-white',
        'hover:from-green-700 hover:to-green-800',
        'active:from-green-800 active:to-green-900',
        'focus:ring-green-500',
        'shadow-md hover:shadow-lg',
        'transform hover:scale-[1.02] active:scale-[0.98]'
      ),
      ghost: cn(
        'bg-transparent text-gray-700',
        'hover:bg-gray-100',
        'active:bg-gray-200',
        'focus:ring-gray-400'
      ),
      outline: cn(
        'bg-transparent text-blue-600',
        'border-blue-600',
        'hover:bg-blue-50',
        'active:bg-blue-100',
        'focus:ring-blue-500'
      ),
    };

    // Size-specific styles
    const sizeStyles = {
      xs: 'px-2.5 py-1.5 text-xs min-h-[28px]',
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-2.5 text-base min-h-[44px]',
      lg: 'px-6 py-3 text-lg min-h-[52px]',
      xl: 'px-8 py-4 text-xl min-h-[60px]',
    };

    // Icon size mapping
    const iconSizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };

    const isDisabled = disabled || isLoading;
    const showLeftIcon = !isLoading && leftIcon;
    const showRightIcon = !isLoading && rightIcon;
    const buttonText = isLoading && loadingText ? loadingText : children;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <svg
            className={cn('animate-spin', iconSizeClasses[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left Icon */}
        {showLeftIcon && (
          <span className={cn('inline-flex', iconSizeClasses[size])} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button Text */}
        {buttonText && <span>{buttonText}</span>}

        {/* Right Icon */}
        {showRightIcon && (
          <span className={cn('inline-flex', iconSizeClasses[size])} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
