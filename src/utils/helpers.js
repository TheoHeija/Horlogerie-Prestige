import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * @param {...string} inputs - Class names to merge
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date in a human-readable format
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        return new Intl.DateTimeFormat('en-US', mergedOptions).format(dateObj);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

/**
 * Format a currency value
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (default: CHF)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value, currency = 'CHF') {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(value);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return `${currency} ${value}`;
    }
}

/**
 * Truncate a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated string
 */
export function truncateString(str, length = 50) {
    if (!str || str.length <= length) return str;
    return `${str.substring(0, length).trim()}...`;
}

/**
 * Generate a random ID
 * @returns {string} - Random ID
 */
export function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
} 