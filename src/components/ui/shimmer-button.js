import React from "react";

/**
 * ShimmerButton - A button with a shimmering effect for a premium feel
 */
export const ShimmerButton = ({
    children,
    className = '',
    shimmerColor = 'rgba(255, 255, 255, 0.2)',
    ...props
}) => {
    return (
        <button
            className={`relative overflow-hidden rounded-lg bg-black dark:bg-gray-800 px-6 py-3 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg ${className}`}
            {...props}
        >
            {/* Shimmer effect */}
            <div
                className="absolute inset-0 pointer-events-none animate-shimmer"
                style={{
                    background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer-slide 2s infinite',
                }}
            />

            {/* Button content */}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

ShimmerButton.displayName = "ShimmerButton"; 