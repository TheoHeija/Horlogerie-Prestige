import React from 'react';

/**
 * AnimatedGradientText - A text component with animated gradient color for luxury display
 */
export const AnimatedGradientText = ({
    children,
    className = '',
    colorFrom = 'var(--gold)',
    colorTo = 'var(--gold-light)',
    speed = 1,
    ...props
}) => {
    return (
        <span
            className={`inline-block font-bold ${className}`}
            style={{
                background: `linear-gradient(to right, ${colorFrom}, ${colorTo}, ${colorFrom})`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: `gradient-animation ${4 / speed}s linear infinite`,
            }}
            {...props}
        >
            {children}
        </span>
    );
};

// Add this to index.css if not already present:
// @keyframes gradient-animation {
//   to {
//     background-position: 200% center;
//   }
// } 