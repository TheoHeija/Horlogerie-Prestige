import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * MagicCard component - A card with interactive hover effects
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional class names
 * @param {boolean} props.glow - Whether to add glow effect
 * @param {boolean} props.spotlight - Whether to add spotlight effect
 * @param {string} props.spotlightColor - Color of the spotlight (supports rgba)
 * @param {boolean} props.tilt - Whether to add tilt effect
 * @param {Object} props.rest - Additional props
 */
export const MagicCard = ({
    children,
    className,
    glow = false,
    spotlight = false,
    spotlightColor = "rgba(255, 255, 255, 0.03)",
    tilt = false,
    ...rest
}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();

        // Calculate position relative to the card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Get center points and calculate normalized position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = tilt ? ((y - centerY) / centerY) * -10 : 0; // -10 to 10 deg
        const rotateY = tilt ? ((x - centerX) / centerX) * 10 : 0; // -10 to 10 deg

        setPosition({ x, y, centerX, centerY, rotateX, rotateY });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0, centerX: 0, centerY: 0, rotateX: 0, rotateY: 0 });
    };

    return (
        <motion.div
            ref={cardRef}
            className={cn(
                "relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/50 shadow-sm transition-all duration-300",
                glow && "shadow-lg",
                isHovered && "shadow-md",
                glow && isHovered && "shadow-xl shadow-indigo-500/10",
                className
            )}
            animate={{
                rotateX: position.rotateX,
                rotateY: position.rotateY,
                transition: { type: "spring", stiffness: 400, damping: 30 }
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
            }}
            {...rest}
        >
            {/* Glow effect */}
            {glow && isHovered && (
                <div
                    className="absolute inset-0 z-[-1] opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                        background: "radial-gradient(circle at var(--x) var(--y), rgba(99, 102, 241, 0.15), transparent 80%)",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: "100%",
                        "--x": position.x + "px",
                        "--y": position.y + "px",
                    }}
                />
            )}

            {/* Spotlight effect */}
            {spotlight && isHovered && (
                <div
                    className="absolute inset-0 z-10 transition-opacity"
                    style={{
                        background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 25%)`,
                        opacity: 0.8,
                        pointerEvents: "none"
                    }}
                />
            )}

            {/* Border highlight effect */}
            {isHovered && (
                <div
                    className="absolute inset-0 z-[-1] rounded-xl"
                    style={{
                        background: `linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))`,
                        filter: "blur(15px)",
                        opacity: 0.15,
                        transform: "translateZ(-10px)"
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

MagicCard.displayName = "MagicCard"; 