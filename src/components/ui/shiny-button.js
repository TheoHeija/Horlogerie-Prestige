"use client";

import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * ShinyButton component - A button with a shimmering effect
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional classes
 * @param {string} props.variant - Button variant (primary, secondary, etc.)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {React.ButtonHTMLAttributes} props.rest - Additional button attributes
 */
export const ShinyButton = ({
    children,
    className,
    variant = 'primary',
    disabled = false,
    ...rest
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-indigo-600 hover:bg-indigo-700 text-white';
            case 'secondary':
                return 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 text-white';
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            default:
                return 'bg-indigo-600 hover:bg-indigo-700 text-white';
        }
    };

    return (
        <button
            className={cn(
                'relative px-4 py-2 rounded-md font-medium transition-colors overflow-hidden',
                getVariantStyles(),
                'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer-slide before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                className
            )}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
}; 