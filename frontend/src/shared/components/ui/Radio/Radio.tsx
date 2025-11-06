import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label for the radio button
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
}

/**
 * Production-grade Radio component
 *
 * @example
 * <Radio
 *   name="plan"
 *   value="basic"
 *   label="Basic Plan"
 *   description="$9.99/month"
 *   checked={selectedPlan === 'basic'}
 *   onChange={(e) => setSelectedPlan(e.target.value)}
 * />
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
      ...props
    },
    ref
  ) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

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
            ref={ref}
            type="radio"
            id={radioId}
            disabled={disabled}
            className={cn(
              // Base styles
              sizeClasses[size],
              'border-gray-300',
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
            aria-describedby={error ? `${radioId}-error` : undefined}
            {...props}
          />
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={radioId}
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
                id={`${radioId}-error`}
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

Radio.displayName = 'Radio';

// RadioGroup component for managing multiple radios
export interface RadioGroupProps {
  /**
   * Radio group label
   */
  label?: string;

  /**
   * Radio options
   */
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;

  /**
   * Current selected value
   */
  value?: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Name for the radio group
   */
  name: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Layout direction
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * RadioGroup component for managing multiple radio buttons
 *
 * @example
 * <RadioGroup
 *   label="Select a plan"
 *   name="plan"
 *   value={selectedPlan}
 *   onChange={setSelectedPlan}
 *   options={[
 *     { value: 'basic', label: 'Basic', description: '$9.99/month' },
 *     { value: 'pro', label: 'Pro', description: '$19.99/month' },
 *   ]}
 * />
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  name,
  error,
  size = 'md',
  direction = 'vertical',
  className,
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <fieldset className={cn('space-y-2', className)}>
      {label && (
        <legend className="text-sm font-medium text-gray-900 mb-3">
          {label}
        </legend>
      )}
      <div
        className={cn(
          direction === 'vertical' ? 'space-y-3' : 'flex flex-wrap gap-4',
        )}
        role="radiogroup"
        aria-labelledby={label ? groupId : undefined}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={option.disabled}
            size={size}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};

RadioGroup.displayName = 'RadioGroup';

export default Radio;
