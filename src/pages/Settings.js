import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserCircleIcon, BellIcon, ShieldCheckIcon, GlobeAltIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

/**
 * Settings component - Page for managing application settings and preferences
 */
const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    const [notifications, setNotifications] = useState({
        email: true,
        orderUpdates: true,
        productUpdates: false,
        newFeatures: true
    });
    const [accountInfo, setAccountInfo] = useState({
        name: user?.email?.split('@')[0] || 'Admin User',
        email: user?.email || 'admin@example.com',
        role: 'Administrator',
        companyName: 'Horlogerie Prestige',
        language: 'English',
    });

    // Keep dark mode state in sync with localStorage and system events
    useEffect(() => {
        // Function to update dark mode state from storage
        const handleStorageChange = (e) => {
            if (e && e.key === 'theme') {
                setIsDarkMode(e.newValue === 'dark');
            } else {
                setIsDarkMode(localStorage.getItem('theme') === 'dark');
            }
        };

        // Create a custom event listener for theme changes from other components
        const handleThemeChange = (e) => {
            setIsDarkMode(e.detail.isDarkMode);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('themeChanged', handleThemeChange);

        // Check system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleMediaChange = (e) => {
            // Only apply if no theme is saved in localStorage
            if (!localStorage.getItem('theme')) {
                setIsDarkMode(e.matches);
            }
        };
        mediaQuery.addEventListener('change', handleMediaChange);

        // Initial check to ensure state is in sync
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('themeChanged', handleThemeChange);
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    // Toggle dark mode
    const handleThemeToggle = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isDarkMode: newDarkMode }
        }));

        toast.success(`Theme switched to ${newDarkMode ? 'dark' : 'light'} mode`);
    };

    // Handle notification preference changes
    const handleNotificationChange = (key) => {
        setNotifications({
            ...notifications,
            [key]: !notifications[key]
        });

        toast.success('Notification preferences updated');
    };

    // Handle account info changes
    const handleAccountInfoChange = (e) => {
        const { name, value } = e.target;
        setAccountInfo({
            ...accountInfo,
            [name]: value
        });
    };

    // Save profile changes
    const handleSaveProfile = (e) => {
        e.preventDefault();
        toast.success('Profile updated successfully');
    };

    // Navigation tabs
    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserCircleIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'appearance', name: 'Appearance', icon: GlobeAltIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'info', name: 'System Info', icon: DocumentTextIcon },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account and application preferences</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Settings Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="card p-0 overflow-hidden">
                        <nav className="space-y-1" aria-label="Settings">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const Icon = tab.icon;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-l-4 border-indigo-500'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                            }`}
                                    >
                                        <Icon
                                            className={`h-5 w-5 mr-3 ${isActive
                                                ? 'text-indigo-500'
                                                : 'text-gray-400 dark:text-gray-500'
                                                }`}
                                        />
                                        <span>{tab.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                    <div className="card animate-fade-in">
                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>

                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-semibold">
                                        {accountInfo.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {accountInfo.name}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {accountInfo.email}
                                        </p>
                                    </div>

                                    <button className="btn btn-secondary btn-sm">
                                        Change Avatar
                                    </button>
                                </div>

                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="form-input"
                                                value={accountInfo.name}
                                                onChange={handleAccountInfoChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-input"
                                                value={accountInfo.email}
                                                onChange={handleAccountInfoChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="companyName" className="form-label">Company Name</label>
                                            <input
                                                type="text"
                                                id="companyName"
                                                name="companyName"
                                                className="form-input"
                                                value={accountInfo.companyName}
                                                onChange={handleAccountInfoChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="role" className="form-label">Role</label>
                                            <select
                                                id="role"
                                                name="role"
                                                className="form-input"
                                                value={accountInfo.role}
                                                onChange={handleAccountInfoChange}
                                            >
                                                <option value="Administrator">Administrator</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Staff">Staff</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>

                                <div className="space-y-4">
                                    {/* Email Notifications */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Receive email notifications for important updates
                                            </p>
                                        </div>

                                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                            <input
                                                type="checkbox"
                                                name="email"
                                                id="email"
                                                checked={notifications.email}
                                                onChange={() => handleNotificationChange('email')}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="email"
                                                className={`
                                                    block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
                                                    ${notifications.email ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
                                                `}
                                            >
                                                <span
                                                    className={`
                                                        block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                                                        ${notifications.email ? 'translate-x-6' : 'translate-x-0'}
                                                    `}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Order Updates */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Order Updates</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Get notified when order statuses change
                                            </p>
                                        </div>

                                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                            <input
                                                type="checkbox"
                                                name="orderUpdates"
                                                id="orderUpdates"
                                                checked={notifications.orderUpdates}
                                                onChange={() => handleNotificationChange('orderUpdates')}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="orderUpdates"
                                                className={`
                                                    block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
                                                    ${notifications.orderUpdates ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
                                                `}
                                            >
                                                <span
                                                    className={`
                                                        block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                                                        ${notifications.orderUpdates ? 'translate-x-6' : 'translate-x-0'}
                                                    `}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Product Updates */}
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Product Updates</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Get notified about inventory changes
                                            </p>
                                        </div>

                                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                            <input
                                                type="checkbox"
                                                name="productUpdates"
                                                id="productUpdates"
                                                checked={notifications.productUpdates}
                                                onChange={() => handleNotificationChange('productUpdates')}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="productUpdates"
                                                className={`
                                                    block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
                                                    ${notifications.productUpdates ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
                                                `}
                                            >
                                                <span
                                                    className={`
                                                        block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                                                        ${notifications.productUpdates ? 'translate-x-6' : 'translate-x-0'}
                                                    `}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* New Features */}
                                    <div className="flex justify-between items-center py-3">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">New Features</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Get updates about new features and improvements
                                            </p>
                                        </div>

                                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                            <input
                                                type="checkbox"
                                                name="newFeatures"
                                                id="newFeatures"
                                                checked={notifications.newFeatures}
                                                onChange={() => handleNotificationChange('newFeatures')}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="newFeatures"
                                                className={`
                                                    block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
                                                    ${notifications.newFeatures ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
                                                `}
                                            >
                                                <span
                                                    className={`
                                                        block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                                                        ${notifications.newFeatures ? 'translate-x-6' : 'translate-x-0'}
                                                    `}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>

                                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Toggle between light and dark themes
                                        </p>
                                    </div>

                                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                        <input
                                            type="checkbox"
                                            name="theme"
                                            id="theme"
                                            checked={isDarkMode}
                                            onChange={handleThemeToggle}
                                            className="sr-only"
                                        />
                                        <label
                                            htmlFor="theme"
                                            className={`
                                                block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out
                                                ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
                                            `}
                                        >
                                            <span
                                                className={`
                                                    block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                                                    ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}
                                                `}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Language</h3>
                                    <select
                                        name="language"
                                        className="form-input"
                                        value={accountInfo.language}
                                        onChange={handleAccountInfoChange}
                                    >
                                        <option value="English">English</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                        <option value="Spanish">Spanish</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Change Password</h3>
                                        <form className="space-y-4">
                                            <div>
                                                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                                <input type="password" id="currentPassword" className="form-input" />
                                            </div>
                                            <div>
                                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                                <input type="password" id="newPassword" className="form-input" />
                                            </div>
                                            <div>
                                                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                                <input type="password" id="confirmPassword" className="form-input" />
                                            </div>
                                            <div className="pt-2">
                                                <button type="button" className="btn btn-primary">Update Password</button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Two Factor Authentication</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            Add an extra layer of security to your account by requiring a verification code in addition to your password.
                                        </p>
                                        <button className="btn btn-secondary">Enable 2FA</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* System Information */}
                        {activeTab === 'info' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Information</h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Application Version</h3>
                                            <p className="text-gray-900 dark:text-white mt-1 font-medium">1.0.0</p>
                                        </div>

                                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                                            <p className="text-gray-900 dark:text-white mt-1 font-medium">{new Date().toLocaleDateString()}</p>
                                        </div>

                                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Database Status</h3>
                                            <p className="text-green-600 dark:text-green-400 mt-1 font-medium flex items-center">
                                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                                Connected
                                            </p>
                                        </div>

                                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</h3>
                                            <p className="text-gray-900 dark:text-white mt-1 font-medium">Production</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 rounded-lg">
                                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400">System Maintenance</h3>
                                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                            Scheduled maintenance will occur on July 15, 2023 from 2:00 AM to 4:00 AM UTC.
                                            The system may be unavailable during this time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 