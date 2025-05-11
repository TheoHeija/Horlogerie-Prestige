import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    BellIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    MagnifyingGlassIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { AuroraText } from '../ui/aurora-text';

/**
 * Header component - Displays the top navigation bar
 * Contains mobile menu toggle and user profile dropdown
 * @param {Object} props - Component props
 * @param {Function} props.toggleMobileMenu - Function to toggle the mobile menu
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 * @param {Function} props.toggleDarkMode - Function to toggle dark mode
 */
const Header = ({ toggleMobileMenu, isDarkMode, toggleDarkMode }) => {
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        // Search functionality would be implemented here
        console.log('Searching for:', searchQuery);
    };

    // Mock notifications data
    const notifications = [
        {
            id: 1,
            title: 'New order received',
            message: 'Order #12345 has been placed',
            time: '2 min ago',
            read: false,
            type: 'order'
        },
        {
            id: 2,
            title: 'Payment successful',
            message: 'Payment for order #12340 confirmed',
            time: '1 hour ago',
            read: true,
            type: 'payment'
        },
        {
            id: 3,
            title: 'New user registered',
            message: 'John Doe created an account',
            time: '3 hours ago',
            read: true,
            type: 'user'
        }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md px-4 py-2 z-20 relative">
            <div className="flex items-center justify-between h-14">
                <div className="flex items-center">
                    <button
                        type="button"
                        className="md:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                        onClick={toggleMobileMenu}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    <div className="ml-2 flex items-center">
                        <AuroraText
                            className="text-lg md:text-xl font-bold"
                            colors={["#D4AF37", "#FFD700", "#FFC72C", "#FFDF00"]}
                            speed={1.5}
                        >
                            Horlogerie Prestige
                        </AuroraText>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="search"
                                className="form-input pl-10 py-1.5 text-sm placeholder-gray-400 w-full bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm"
                                placeholder="Search orders, products, users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Dark mode toggle */}
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className="p-1.5 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <SunIcon className="h-5 w-5" />
                        ) : (
                            <MoonIcon className="h-5 w-5" />
                        )}
                    </button>

                    {/* Notifications bell */}
                    <div className="relative">
                        <button
                            type="button"
                            className="p-1.5 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <BellIcon className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications dropdown */}
                        <Transition
                            show={showNotifications}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-2">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                            <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                                                Mark all as read
                                            </button>
                                        </div>
                                    </div>

                                    <div className="max-h-60 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                No notifications
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 ${!notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                                                >
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {notification.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {notification.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    {!notification.read && (
                                                        <div className="mt-1 flex items-center text-xs text-indigo-600 dark:text-indigo-400">
                                                            <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-1"></div>
                                                            New
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-2">
                                        <Link to="/notifications" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    {/* User menu */}
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors">
                            <UserCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {user?.email?.split('@')[0] || 'Admin'}
                            </span>
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center px-2 py-2">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user?.email?.split('@')[0] || 'Admin'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user?.email || 'admin@example.com'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''
                                                    } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                            >
                                                <UserCircleIcon className="h-5 w-5 mr-2" />
                                                Profile
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''
                                                    } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                            >
                                                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                                                Settings
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={logout}
                                                className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''
                                                    } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                            >
                                                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                                Sign out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    );
};

export default Header; 