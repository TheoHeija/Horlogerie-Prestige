import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    ClockIcon,
    ShoppingBagIcon,
    UserGroupIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    TicketIcon,
    DocumentTextIcon,
    BanknotesIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

/**
 * Sidebar component - Provides navigation for the dashboard
 * @param {Object} props - Component props
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 * @param {boolean} props.isMobile - Whether sidebar is shown on mobile
 * @param {Function} props.closeMobileMenu - Function to close mobile menu
 */
const Sidebar = ({ isDarkMode, isMobile = false, closeMobileMenu }) => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
        { name: 'Products', icon: ClockIcon, path: '/products' },
        { name: 'Orders', icon: ShoppingBagIcon, path: '/orders' },
        { name: 'Customers', icon: UserGroupIcon, path: '/customers' },
        { name: 'Analytics', icon: ChartBarIcon, path: '/analytics' },
        { name: 'Discounts', icon: TicketIcon, path: '/discounts' },
        { name: 'Reports', icon: DocumentTextIcon, path: '/reports' },
        { name: 'Payments', icon: BanknotesIcon, path: '/payments' },
        { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
    ];

    const containerAnimation = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnimation = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    const handleNavClick = () => {
        if (isMobile && closeMobileMenu) {
            closeMobileMenu();
        }
    };

    return (
        <aside className={cn(
            "h-screen w-64 flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-lg transition-all duration-300",
            isDarkMode ? "border-opacity-10" : ""
        )}>
            <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center justify-center p-2">
                    <div className="relative w-10 h-10 mr-3">
                        <div className={cn(
                            "absolute inset-0 rounded-full bg-gradient-to-r",
                            isDarkMode
                                ? "from-indigo-600 via-purple-600 to-pink-600"
                                : "from-amber-400 via-yellow-500 to-orange-500"
                        )}
                            style={{
                                backgroundSize: "200% 100%",
                                animation: "shimmer 2s linear infinite",
                            }}
                        />
                        <div className="absolute inset-0.5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-lg font-bold">
                            HP
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Horlogerie Prestige</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <motion.ul
                    className="space-y-1"
                    variants={containerAnimation}
                    initial="hidden"
                    animate="show"
                >
                    {navItems.map((item) => (
                        <motion.li key={item.name} variants={itemAnimation}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                )}
                                onClick={handleNavClick}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <span>{item.name}</span>
                                {item.name === 'Orders' && (
                                    <span className="ml-auto bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-2 py-0.5 rounded-full">
                                        12
                                    </span>
                                )}
                            </NavLink>
                        </motion.li>
                    ))}
                </motion.ul>
            </nav>

            <div className="p-4 border-t dark:border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar; 