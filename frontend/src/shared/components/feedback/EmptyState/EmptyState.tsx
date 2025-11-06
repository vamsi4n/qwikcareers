import React, { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface EmptyStateProps {
  /**
   * Title of the empty state
   */
  title: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Custom icon/image element
   */
  icon?: ReactNode;

  /**
   * Action button or element
   */
  action?: ReactNode;

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Production-grade EmptyState component with customizable icons and actions
 *
 * @example
 * <EmptyState
 *   title="No results found"
 *   description="Try adjusting your search criteria"
 *   icon={<SearchIcon />}
 *   action={<Button>Clear Filters</Button>}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-base',
    },
    lg: {
      container: 'py-16',
      icon: 'w-24 h-24',
      title: 'text-xl',
      description: 'text-lg',
    },
  };

  const defaultIcon = (
    <svg
      className={cn('text-gray-300', sizeClasses[size].icon)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size].container,
        className
      )}
      role="status"
      aria-label="Empty state"
    >
      {/* Icon */}
      <div className="mb-4">{icon || defaultIcon}</div>

      {/* Title */}
      <h3
        className={cn(
          'font-semibold text-gray-900 mb-2',
          sizeClasses[size].title
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'text-gray-600 max-w-md mb-6',
            sizeClasses[size].description
          )}
        >
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
