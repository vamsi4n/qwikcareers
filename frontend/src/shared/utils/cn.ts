import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge to handle Tailwind conflicts
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * cn('text-red-500', 'text-blue-500') // Returns 'text-blue-500' (later class wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
