import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface AccordionItem {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Title/header content
   */
  title: string;

  /**
   * Body/content
   */
  content: ReactNode;

  /**
   * Whether the item is disabled
   */
  disabled?: boolean;

  /**
   * Optional icon
   */
  icon?: ReactNode;
}

export interface AccordionProps {
  /**
   * Array of accordion items
   */
  items: AccordionItem[];

  /**
   * Currently expanded item IDs
   */
  expandedItems?: string[];

  /**
   * Callback when items expand/collapse
   */
  onChange?: (expandedItems: string[]) => void;

  /**
   * Allow multiple items to be expanded
   */
  allowMultiple?: boolean;

  /**
   * Variant style
   */
  variant?: 'default' | 'bordered' | 'separated';

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
 * Production-grade Accordion component with smooth animations
 *
 * @example
 * <Accordion
 *   items={[
 *     {
 *       id: 'faq-1',
 *       title: 'What is your refund policy?',
 *       content: 'We offer a 30-day money-back guarantee...',
 *     },
 *     {
 *       id: 'faq-2',
 *       title: 'How do I cancel my subscription?',
 *       content: 'You can cancel anytime from your account settings...',
 *     },
 *   ]}
 *   allowMultiple
 * />
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  expandedItems: controlledExpandedItems,
  onChange,
  allowMultiple = false,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const [internalExpandedItems, setInternalExpandedItems] = useState<string[]>([]);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const expandedItems = controlledExpandedItems !== undefined ? controlledExpandedItems : internalExpandedItems;

  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  const toggleItem = (itemId: string) => {
    let newExpandedItems: string[];

    if (isExpanded(itemId)) {
      // Collapse
      newExpandedItems = expandedItems.filter((id) => id !== itemId);
    } else {
      // Expand
      if (allowMultiple) {
        newExpandedItems = [...expandedItems, itemId];
      } else {
        newExpandedItems = [itemId];
      }
    }

    if (onChange) {
      onChange(newExpandedItems);
    } else {
      setInternalExpandedItems(newExpandedItems);
    }
  };

  const sizeClasses = {
    sm: {
      header: 'text-sm px-4 py-2',
      content: 'text-sm px-4 py-2',
      icon: 'w-4 h-4',
    },
    md: {
      header: 'text-base px-5 py-3',
      content: 'text-base px-5 py-4',
      icon: 'w-5 h-5',
    },
    lg: {
      header: 'text-lg px-6 py-4',
      content: 'text-lg px-6 py-5',
      icon: 'w-6 h-6',
    },
  };

  const variantStyles = {
    default: {
      container: 'divide-y divide-gray-200 border border-gray-200 rounded-lg',
      item: '',
      header: 'hover:bg-gray-50',
    },
    bordered: {
      container: 'space-y-2',
      item: 'border border-gray-200 rounded-lg overflow-hidden',
      header: 'hover:bg-gray-50',
    },
    separated: {
      container: 'space-y-4',
      item: 'bg-white shadow-sm rounded-lg overflow-hidden',
      header: 'hover:bg-gray-50',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(styles.container, className)}>
      {items.map((item) => {
        const expanded = isExpanded(item.id);

        return (
          <div key={item.id} className={styles.item}>
            {/* Header */}
            <button
              type="button"
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={cn(
                // Base
                'w-full',
                'flex items-center justify-between gap-3',
                'font-medium text-left',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',

                // Size
                sizeClasses[size].header,

                // Variant
                styles.header,

                // States
                item.disabled && 'opacity-50 cursor-not-allowed',
                expanded && 'bg-gray-50'
              )}
              aria-expanded={expanded}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center gap-3 flex-1">
                {item.icon && (
                  <span className="flex-shrink-0 text-gray-500">{item.icon}</span>
                )}
                <span className="text-gray-900">{item.title}</span>
              </div>

              {/* Chevron Icon */}
              <svg
                className={cn(
                  'flex-shrink-0 text-gray-500',
                  'transition-transform duration-200',
                  sizeClasses[size].icon,
                  expanded && 'transform rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Content */}
            <div
              id={`accordion-content-${item.id}`}
              ref={(el) => (contentRefs.current[item.id] = el)}
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                expanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
              )}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
            >
              <div className={cn('text-gray-700', sizeClasses[size].content)}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
