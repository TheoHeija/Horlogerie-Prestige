import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import ScrollProgressBar from '../ui/scroll-progress-bar';
import { motion } from 'framer-motion';

/**
 * DashboardLayout - The main layout component for admin dashboard
 * Includes sidebar, header, and content area
 */
const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Add a background pattern to the dashboard
    const backgroundStyle = {
        backgroundImage: isDarkMode
            ? `radial-gradient(circle at 25px 25px, rgba(80, 80, 100, 0.15) 2%, transparent 0%), 
               radial-gradient(circle at 75px 75px, rgba(80, 80, 100, 0.15) 2%, transparent 0%)`
            : `radial-gradient(circle at 25px 25px, rgba(0, 0, 0, 0.05) 2%, transparent 0%), 
               radial-gradient(circle at 75px 75px, rgba(0, 0, 0, 0.05) 2%, transparent 0%)`,
        backgroundSize: '100px 100px',
        backgroundPosition: '0 0, 50px 50px'
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <ScrollProgressBar />
            <Toaster position="top-right" />

            {/* Sidebar - desktop */}
            <div className="hidden md:block">
                <Sidebar isDarkMode={isDarkMode} />
            </div>

            {/* Mobile Sidebar - overlay */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={toggleMobileMenu}
                    ></div>
                    <motion.div
                        className="fixed inset-y-0 left-0 z-40 md:hidden"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Sidebar
                            isDarkMode={isDarkMode}
                            isMobile={true}
                            closeMobileMenu={() => setIsMobileMenuOpen(false)}
                        />
                    </motion.div>
                </>
            )}

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    toggleMobileMenu={toggleMobileMenu}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                />

                <main
                    className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
                    style={backgroundStyle}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="container mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 