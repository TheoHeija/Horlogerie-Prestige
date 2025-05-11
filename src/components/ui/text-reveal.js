import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * TextReveal component - Text with a sliding reveal animation
 * @param {Object} props - Component props
 * @param {string} props.text - Text to display
 * @param {string} props.className - Additional classes
 * @param {string} props.highlightColor - Color for text highlight animation
 */
export const TextReveal = ({
    text,
    className,
    highlightColor = "rgba(99, 102, 241, 0.2)",
    ...props
}) => {
    const letters = Array.from(text);
    const container = useRef(null);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
            },
        },
    };

    const letterVariants = {
        hidden: {
            y: 20,
            opacity: 0
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        },
    };

    // Highlight animation
    const highlightVariants = {
        hidden: { width: "0%" },
        visible: {
            width: "100%",
            transition: {
                duration: 0.8,
                ease: "easeInOut",
                delay: 0.2
            }
        }
    };

    useEffect(() => {
        const currentContainer = container.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && currentContainer) {
                    // Add a data attribute when the element is visible
                    currentContainer.setAttribute('data-visible', 'true');
                }
            },
            { threshold: 0.1 }
        );

        if (currentContainer) {
            observer.observe(currentContainer);
        }

        return () => {
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
        };
    }, []);

    return (
        <div className="relative inline-block" ref={container}>
            <motion.div
                className="relative inline-block"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                variants={containerVariants}
            >
                {letters.map((letter, index) => (
                    <motion.span
                        key={index}
                        className={cn("inline-block", className)}
                        variants={letterVariants}
                        {...props}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                ))}
            </motion.div>

            <motion.div
                className="absolute bottom-0 left-0 h-[6px] rounded-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                variants={highlightVariants}
                style={{ backgroundColor: highlightColor }}
            />
        </div>
    );
}; 