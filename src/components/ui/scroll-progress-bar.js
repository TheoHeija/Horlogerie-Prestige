import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgressBar component - Shows a progress bar indicating scroll position
 * @param {Object} props - Component props
 * @param {string} props.color - Color of the progress bar
 * @param {string} props.height - Height of the progress bar
 * @param {number} props.zIndex - z-index of the progress bar
 */
const ScrollProgressBar = ({
    color = "#6366F1",
    height = "3px",
    zIndex = 100
}) => {
    const [visible, setVisible] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setVisible(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 right-0"
            style={{
                height,
                background: color,
                transformOrigin: "0%",
                scaleX,
                zIndex
            }}
        />
    );
};

export default ScrollProgressBar; 