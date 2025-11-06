import React, { useState, useRef, useEffect, ReactNode, cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: ReactNode;

  /**
   * Element that triggers the tooltip
   */
  children: React.ReactElement;

  /**
   * Preferred position of the tooltip
   */
  position?: TooltipPosition;

  /**
   * Delay before showing tooltip (ms)
   */
  showDelay?: number;

  /**
   * Delay before hiding tooltip (ms)
   */
  hideDelay?: number;

  /**
   * Maximum width of the tooltip
   */
  maxWidth?: string;

  /**
   * Disable the tooltip
   */
  disabled?: boolean;

  /**
   * Show arrow indicator
   */
  showArrow?: boolean;

  /**
   * Variant style
   */
  variant?: 'dark' | 'light' | 'error' | 'success' | 'warning';

  /**
   * Additional CSS classes for tooltip content
   */
  className?: string;

  /**
   * Trigger method
   */
  trigger?: 'hover' | 'focus' | 'both';
}

/**
 * Production-grade Tooltip component with intelligent positioning
 *
 * @example
 * <Tooltip content="Click to save">
 *   <Button>Save</Button>
 * </Tooltip>
 *
 * @example
 * <Tooltip
 *   content="This action cannot be undone"
 *   position="top"
 *   variant="error"
 *   showDelay={500}
 * >
 *   <Button variant="danger">Delete</Button>
 * </Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  showDelay = 200,
  hideDelay = 0,
  maxWidth = '320px',
  disabled = false,
  showArrow = true,
  variant = 'dark',
  className,
  trigger = 'both',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(position);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spacing = 8; // Gap between trigger and tooltip
    const arrowSize = showArrow ? 6 : 0;

    let top = 0;
    let left = 0;
    let finalPosition = position;

    // Calculate initial position based on preference
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - spacing - arrowSize;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

        // Flip to bottom if not enough space above
        if (top < 0) {
          finalPosition = 'bottom';
          top = triggerRect.bottom + spacing + arrowSize;
        }
        break;

      case 'bottom':
        top = triggerRect.bottom + spacing + arrowSize;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

        // Flip to top if not enough space below
        if (top + tooltipRect.height > window.innerHeight) {
          finalPosition = 'top';
          top = triggerRect.top - tooltipRect.height - spacing - arrowSize;
        }
        break;

      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - spacing - arrowSize;

        // Flip to right if not enough space on left
        if (left < 0) {
          finalPosition = 'right';
          left = triggerRect.right + spacing + arrowSize;
        }
        break;

      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + spacing + arrowSize;

        // Flip to left if not enough space on right
        if (left + tooltipRect.width > window.innerWidth) {
          finalPosition = 'left';
          left = triggerRect.left - tooltipRect.width - spacing - arrowSize;
        }
        break;
    }

    // Keep tooltip within viewport horizontally
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }

    // Keep tooltip within viewport vertically
    if (top < 8) top = 8;
    if (top + tooltipRect.height > window.innerHeight - 8) {
      top = window.innerHeight - tooltipRect.height - 8;
    }

    setCoords({ top, left });
    setTooltipPosition(finalPosition);
  };

  // Show tooltip
  const show = () => {
    if (disabled) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);
  };

  // Hide tooltip
  const hide = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();

      // Recalculate on scroll or resize
      const handleUpdate = () => calculatePosition();
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);

      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isVisible]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Clone child element and add event handlers
  const triggerElement = isValidElement(children)
    ? cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: (e: React.MouseEvent) => {
          if (trigger === 'hover' || trigger === 'both') show();
          if (children.props.onMouseEnter) children.props.onMouseEnter(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          if (trigger === 'hover' || trigger === 'both') hide();
          if (children.props.onMouseLeave) children.props.onMouseLeave(e);
        },
        onFocus: (e: React.FocusEvent) => {
          if (trigger === 'focus' || trigger === 'both') show();
          if (children.props.onFocus) children.props.onFocus(e);
        },
        onBlur: (e: React.FocusEvent) => {
          if (trigger === 'focus' || trigger === 'both') hide();
          if (children.props.onBlur) children.props.onBlur(e);
        },
        'aria-describedby': isVisible ? tooltipId.current : undefined,
      } as any)
    : children;

  const variantStyles = {
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      arrow: 'border-gray-900',
    },
    light: {
      bg: 'bg-white border border-gray-200',
      text: 'text-gray-900',
      arrow: 'border-white',
    },
    error: {
      bg: 'bg-red-600',
      text: 'text-white',
      arrow: 'border-red-600',
    },
    success: {
      bg: 'bg-green-600',
      text: 'text-white',
      arrow: 'border-green-600',
    },
    warning: {
      bg: 'bg-yellow-600',
      text: 'text-white',
      arrow: 'border-yellow-600',
    },
  };

  const styles = variantStyles[variant];

  // Arrow positioning styles
  const arrowPositionStyles = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  };

  const tooltipContent = isVisible ? (
    <div
      ref={tooltipRef}
      id={tooltipId.current}
      role="tooltip"
      className={cn(
        // Base
        'fixed z-[9999]',
        'px-3 py-2',
        'rounded-lg',
        'text-sm leading-snug',
        'shadow-lg',
        'pointer-events-none',

        // Animation
        'animate-fade-in',

        // Variant
        styles.bg,
        styles.text,

        className
      )}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        maxWidth,
      }}
    >
      {content}

      {/* Arrow */}
      {showArrow && (
        <div
          className={cn(
            'absolute w-0 h-0',
            'border-[6px]',
            styles.arrow,
            arrowPositionStyles[tooltipPosition]
          )}
        />
      )}
    </div>
  ) : null;

  return (
    <>
      {triggerElement}
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
