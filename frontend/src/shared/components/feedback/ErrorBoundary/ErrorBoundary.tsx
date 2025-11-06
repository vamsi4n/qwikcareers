import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  /**
   * Child components to wrap
   */
  children: ReactNode;

  /**
   * Fallback UI to render when an error occurs
   */
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode);

  /**
   * Callback when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Whether to log errors to console (default: true in development)
   */
  logErrors?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Production-grade ErrorBoundary component with error logging and recovery
 *
 * @example
 * <ErrorBoundary
 *   fallback={(error, errorInfo, reset) => (
 *     <div>
 *       <h2>Something went wrong</h2>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 *   onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
 * >
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, logErrors = process.env.NODE_ENV === 'development' } = this.props;

    // Log error to console in development
    if (logErrors) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    // Store error info in state
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // TODO: Send error to logging service (e.g., Sentry, LogRocket, etc.)
    // Example: logErrorToService(error, errorInfo);
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  renderDefaultFallback(): ReactNode {
    const { error, errorInfo } = this.state;

    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Oops! Something went wrong
          </h1>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                Error Details (Development Only)
              </summary>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-sm text-gray-700 mb-1">Error Message:</h3>
                  <pre className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-x-auto">
                    {error.message}
                  </pre>
                </div>
                {error.stack && (
                  <div>
                    <h3 className="font-medium text-sm text-gray-700 mb-1">Stack Trace:</h3>
                    <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto max-h-48">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {errorInfo && errorInfo.componentStack && (
                  <div>
                    <h3 className="font-medium text-sm text-gray-700 mb-1">Component Stack:</h3>
                    <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto max-h-48">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={this.reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Go to Homepage
            </button>
          </div>

          {/* Support Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Need help?{' '}
            <a
              href="/support"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    );
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Render custom fallback if provided
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, errorInfo!, this.reset);
        }
        return fallback;
      }

      // Render default fallback
      return this.renderDefaultFallback();
    }

    // No error, render children normally
    return children;
  }
}

export default ErrorBoundary;
