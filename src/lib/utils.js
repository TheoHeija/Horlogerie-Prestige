import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class strings and merges tailwind classes efficiently
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
} 