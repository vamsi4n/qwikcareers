import React from 'react';
import { cn } from '../../../utils/cn';

export interface LoadingScreenProps {
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Whether to show the loading screen as fullscreen
   */
  fullscreen?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Loading variant (spinner, dots, pulse)
   */
  variant?: 'spinner' | 'dots' | 'pulse';
}

/**
 * Production-grade LoadingScreen component with multiple variants
 *
 * @example
 * <LoadingScreen size="lg" message="Loading data..." />
 *
 * @example
 * <LoadingScreen fullscreen variant="dots" />
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  size = 'md',
  message,
  fullscreen = false,
  className,
  variant = 'spinner',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-4',
    fullscreen && 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50',
    !fullscreen && 'py-12',
    className
  );

  const renderSpinner = () => (
    <svg
      className={cn('animate-spin text-blue-600', sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
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
  );

  const renderDots = () => (
    <div className="flex gap-2" role="status" aria-label="Loading">
      <div className={cn('rounded-full bg-blue-600 animate-bounce', sizeClasses[size])} style={{ animationDelay: '0ms' }} />
      <div className={cn('rounded-full bg-blue-600 animate-bounce', sizeClasses[size])} style={{ animationDelay: '150ms' }} />
      <div className={cn('rounded-full bg-blue-600 animate-bounce', sizeClasses[size])} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        'rounded-full bg-blue-600 animate-pulse',
        sizeClasses[size]
      )}
      role="status"
      aria-label="Loading"
    />
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoader()}
      {message && (
        <p className="text-gray-600 text-center font-medium" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingScreen;
