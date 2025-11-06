import React, { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card content
   */
  children: ReactNode;

  /**
   * Visual variant of the card
   */
  variant?: 'default' | 'bordered' | 'elevated' | 'flat' | 'glass';

  /**
   * Padding size
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether the card is hoverable (adds hover effects)
   */
  hoverable?: boolean;

  /**
   * Whether the card is clickable (adds pointer cursor)
   */
  clickable?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Production-grade Card component with variants and accessibility
 *
 * @example
 * <Card variant="elevated" padding="lg">
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * @example
 * <Card hoverable clickable onClick={handleClick}>
 *   Interactive card content
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'rounded-lg',
      'transition-all duration-200',
      clickable && 'cursor-pointer'
    );

    const variantStyles = {
      default: cn(
        'bg-white',
        'border border-gray-200',
        'shadow-sm',
        hoverable && 'hover:shadow-md hover:border-gray-300'
      ),
      bordered: cn(
        'bg-white',
        'border-2 border-gray-300',
        hoverable && 'hover:border-blue-500'
      ),
      elevated: cn(
        'bg-white',
        'shadow-lg',
        hoverable && 'hover:shadow-xl hover:-translate-y-1'
      ),
      flat: cn(
        'bg-gray-50',
        hoverable && 'hover:bg-gray-100'
      ),
      glass: cn(
        'bg-white/80 backdrop-blur-md',
        'border border-white/20',
        'shadow-lg',
        hoverable && 'hover:bg-white/90 hover:shadow-xl'
      ),
    };

    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for better composition
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-0', className)}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';

export default Card;
