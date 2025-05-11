import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AnimatedGradientText } from '../components/ui/animated-gradient-text';
import { MagicCard } from '../components/ui/magic-card';
import { formatCurrency } from '../utils/helpers';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [contentLoaded, setContentLoaded] = useState(false);

    useEffect(() => {
        // Simulating data fetch
        setTimeout(() => {
            const mockCustomers = [
                {
                    id: 1,
                    name: 'James Thompson',
                    email: 'james.thompson@example.com',
                    phone: '+1 (555) 123-4567',
                    status: 'active',
                    totalSpent: 56750,
                    lastPurchase: '2023-04-15',
                    location: 'New York, USA',
                    vipStatus: 'platinum'
                },
                {
                    id: 2,
                    name: 'Sophia Chen',
                    email: 'sophia.chen@example.com',
                    phone: '+1 (555) 987-6543',
                    status: 'active',
                    totalSpent: 32400,
                    lastPurchase: '2023-05-21',
                    location: 'San Francisco, USA',
                    vipStatus: 'gold'
                },
                {
                    id: 3,
                    name: 'Pierre Dubois',
                    email: 'pierre.dubois@example.com',
                    phone: '+33 (1) 23-45-67-89',
                    status: 'active',
                    totalSpent: 85300,
                    lastPurchase: '2023-03-08',
                    location: 'Paris, France',
                    vipStatus: 'platinum'
                },
                {
                    id: 4,
                    name: 'Elena Rodriguez',
                    email: 'elena.rodriguez@example.com',
                    phone: '+34 (6) 12-345-678',
                    status: 'inactive',
                    totalSpent: 18950,
                    lastPurchase: '2022-11-14',
                    location: 'Madrid, Spain',
                    vipStatus: 'silver'
                },
                {
                    id: 5,
                    name: 'Hiroshi Tanaka',
                    email: 'hiroshi.tanaka@example.com',
                    phone: '+81 (3) 1234-5678',
                    status: 'active',
                    totalSpent: 64800,
                    lastPurchase: '2023-06-02',
                    location: 'Tokyo, Japan',
                    vipStatus: 'gold'
                },
                {
                    id: 6,
                    name: 'Olivia Bennett',
                    email: 'olivia.bennett@example.com',
                    phone: '+44 (20) 1234-5678',
                    status: 'active',
                    totalSpent: 29750,
                    lastPurchase: '2023-05-17',
                    location: 'London, UK',
                    vipStatus: 'silver'
                },
                {
                    id: 7,
                    name: 'Sebastian Müller',
                    email: 'sebastian.mueller@example.com',
                    phone: '+49 (30) 1234-5678',
                    status: 'active',
                    totalSpent: 42300,
                    lastPurchase: '2023-04-29',
                    location: 'Berlin, Germany',
                    vipStatus: 'gold'
                },
                {
                    id: 8,
                    name: 'Anastasia Petrova',
                    email: 'anastasia.petrova@example.com',
                    phone: '+7 (495) 123-45-67',
                    status: 'inactive',
                    totalSpent: 15600,
                    lastPurchase: '2022-09-23',
                    location: 'Moscow, Russia',
                    vipStatus: 'silver'
                }
            ];

            setCustomers(mockCustomers);
            setLoading(false);
            setTimeout(() => setContentLoaded(true), 100);
        }, 1000);
    }, []);

    const filteredCustomers = customers.filter(customer => {
        const query = searchQuery.toLowerCase();
        return (
            customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query) ||
            customer.location.toLowerCase().includes(query) ||
            customer.vipStatus.toLowerCase().includes(query)
        );
    });

    const getStatusBadge = (status) => {
        return status === 'active' ? 'badge-success' : 'badge-danger';
    };

    const getVipBadge = (status) => {
        switch (status) {
            case 'platinum':
                return 'badge-luxury';
            case 'gold':
                return 'badge badge-warning';
            case 'silver':
                return 'badge badge-secondary';
            default:
                return 'badge badge-secondary';
        }
    };

    const handleEditCustomer = (customer) => {
        console.log('Edit customer:', customer);
        // Would implement edit modal or navigation
    };

    const handleDeleteCustomer = (customer) => {
        console.log('Delete customer:', customer);
        // Would implement confirmation modal
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center animate-fade-in-down">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">
                        <AnimatedGradientText
                            colorFrom="#4F46E5"
                            colorTo="#9333EA"
                            className="font-bold"
                        >
                            Customer Management
                        </AnimatedGradientText>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your VIP clients and customer relationships
                    </p>
                </div>

                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            className="form-input pl-10 py-2 text-sm rounded-md"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary">
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</h3>
                        <p className="mt-1 text-3xl font-bold">{loading ? '...' : customers.length}</p>
                        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-500">
                            <span>+12% from last month</span>
                        </div>
                    </div>
                </MagicCard>

                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">VIP Customers</h3>
                        <p className="mt-1 text-3xl font-bold">{loading ? '...' : customers.filter(c => c.vipStatus === 'platinum' || c.vipStatus === 'gold').length}</p>
                        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-500">
                            <span>+8% from last quarter</span>
                        </div>
                    </div>
                </MagicCard>

                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Lifetime Value</h3>
                        <p className="mt-1 text-3xl font-bold">
                            {loading
                                ? '...'
                                : `$${Math.round(customers.reduce((acc, curr) => acc + curr.totalSpent, 0) / customers.length).toLocaleString()}`
                            }
                        </p>
                        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-500">
                            <span>+15% year over year</span>
                        </div>
                    </div>
                </MagicCard>
            </div>

            {/* Customer Table */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Customer Directory</h2>
                    <div className="flex items-center space-x-2">
                        <button className="btn btn-sm btn-secondary">Export</button>
                        <button className="btn btn-sm btn-primary">Send Campaign</button>
                    </div>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">VIP Level</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Purchase</th>
                                    <th className="px-4 py-3 relative"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No customers found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${contentLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}
                                            style={{ animationDelay: `${customer.id * 50}ms` }}
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                                                            {customer.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`badge ${getStatusBadge(customer.status)}`}>
                                                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {customer.location}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(customer.totalSpent)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`badge ${getVipBadge(customer.vipStatus)}`}>
                                                    {customer.vipStatus.charAt(0).toUpperCase() + customer.vipStatus.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(customer.lastPurchase).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={() => handleEditCustomer(customer)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCustomer(customer)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customers; 