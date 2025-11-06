import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { cn } from '../../../utils/cn';

export interface SelectOption {
  /**
   * Unique value
   */
  value: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Whether the option is disabled
   */
  disabled?: boolean;

  /**
   * Optional icon
   */
  icon?: React.ReactNode;
}

export interface SelectProps {
  /**
   * Array of options
   */
  options: SelectOption[];

  /**
   * Current selected value(s)
   */
  value?: string | string[];

  /**
   * Change handler
   */
  onChange?: (value: string | string[]) => void;

  /**
   * Label for the select
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Whether the select is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Enable search/filter
   */
  searchable?: boolean;

  /**
   * Enable multi-select
   */
  multiple?: boolean;

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the select is loading
   */
  isLoading?: boolean;

  /**
   * Additional wrapper CSS classes
   */
  wrapperClassName?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Production-grade Select component with search and multi-select
 *
 * @example
 * <Select
 *   label="Country"
 *   options={countries}
 *   value={selectedCountry}
 *   onChange={setSelectedCountry}
 *   searchable
 * />
 *
 * @example
 * <Select
 *   label="Skills"
 *   options={skills}
 *   value={selectedSkills}
 *   onChange={setSelectedSkills}
 *   multiple
 *   searchable
 * />
 */
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  error,
  helperText,
  disabled = false,
  required = false,
  searchable = false,
  multiple = false,
  size = 'md',
  isLoading = false,
  wrapperClassName,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedValues = multiple
    ? Array.isArray(value) ? value : []
    : value ? [value as string] : [];

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected option labels
  const getSelectedLabel = () => {
    if (selectedValues.length === 0) return placeholder;
    if (multiple) {
      return `${selectedValues.length} selected`;
    }
    const selected = options.find((opt) => opt.value === selectedValues[0]);
    return selected?.label || placeholder;
  };

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          e.preventDefault();
          const option = filteredOptions[focusedIndex];
          if (option && !option.disabled) {
            handleSelect(option.value);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-5 py-3 text-lg min-h-[52px]',
  };

  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('relative', wrapperClassName)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            'block text-sm font-medium text-gray-700 mb-1.5',
            disabled && 'text-gray-500'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Select Button */}
      <div
        ref={selectRef}
        className="relative"
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          id={selectId}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            // Base
            'w-full flex items-center justify-between gap-2',
            'border border-gray-300 rounded-lg',
            'bg-white text-gray-900',
            'transition-all duration-200',
            'text-left',

            // Focus
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',

            // Hover
            'hover:border-gray-400',

            // Disabled
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200',

            // Error
            error && 'border-red-500 focus:ring-red-500',

            // Size
            sizeClasses[size],

            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-required={required}
          aria-invalid={!!error}
        >
          <span className={cn('flex-1 truncate', !selectedValues.length && 'text-gray-400')}>
            {getSelectedLabel()}
          </span>

          {isLoading ? (
            <svg
              className="w-5 h-5 animate-spin text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
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
          ) : (
            <svg
              className={cn(
                'w-5 h-5 text-gray-400 transition-transform',
                isOpen && 'transform rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && !isLoading && (
          <div
            className={cn(
              'absolute z-50 w-full mt-1',
              'bg-white border border-gray-200 rounded-lg shadow-lg',
              'max-h-60 overflow-auto'
            )}
            role="listbox"
            aria-labelledby={selectId}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={cn(
                    'w-full px-3 py-2 text-sm',
                    'border border-gray-300 rounded-md',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  )}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options */}
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isFocused = index === focusedIndex;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        'w-full flex items-center gap-2 px-4 py-2 text-sm text-left',
                        'transition-colors duration-150',
                        isSelected && 'bg-blue-50 text-blue-700',
                        isFocused && !isSelected && 'bg-gray-100',
                        !isSelected && !isFocused && 'hover:bg-gray-50',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {multiple && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded"
                          tabIndex={-1}
                        />
                      )}
                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}
                      <span className="flex-1">{option.label}</span>
                      {!multiple && isSelected && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      <div className="mt-1.5">
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    </div>
  );
};

export default Select;
