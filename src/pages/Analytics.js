import { useState, useEffect } from 'react';
import { AnimatedGradientText } from '../components/ui/animated-gradient-text';
import { MagicCard } from '../components/ui/magic-card';
import { ShimmerButton } from '../components/ui/shimmer-button';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowPathIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    UserIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../utils/helpers';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [timeRange, setTimeRange] = useState('month');

    // Sample data
    const [salesData, setSalesData] = useState({
        totalSales: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        topSellingProducts: [],
        monthlySales: [],
        customerAcquisition: [],
        salesByCategory: []
    });

    useEffect(() => {
        // Simulate data loading
        setTimeout(() => {
            const mockData = {
                totalSales: 287500,
                averageOrderValue: 12500,
                conversionRate: 3.2,
                topSellingProducts: [
                    { id: 1, name: "Rolex Submariner", sales: 42500, units: 5 },
                    { id: 2, name: "Omega Speedmaster", sales: 26000, units: 5 },
                    { id: 3, name: "Patek Philippe Nautilus", sales: 35000, units: 1 },
                    { id: 4, name: "Audemars Piguet Royal Oak", sales: 29500, units: 1 },
                    { id: 5, name: "Jaeger-LeCoultre Reverso", sales: 24600, units: 3 }
                ],
                monthlySales: [
                    { month: "Jan", amount: 45200 },
                    { month: "Feb", amount: 38900 },
                    { month: "Mar", amount: 52600 },
                    { month: "Apr", amount: 41800 },
                    { month: "May", amount: 67500 },
                    { month: "Jun", amount: 41500 },
                ],
                customerAcquisition: [
                    { source: "Direct", count: 35, percentage: 35 },
                    { source: "Organic Search", count: 22, percentage: 22 },
                    { source: "Social Media", count: 18, percentage: 18 },
                    { source: "Email", count: 15, percentage: 15 },
                    { source: "Referral", count: 10, percentage: 10 }
                ],
                salesByCategory: [
                    { category: "Dive Watches", amount: 87500, percentage: 30.4 },
                    { category: "Dress Watches", amount: 65300, percentage: 22.7 },
                    { category: "Chronographs", amount: 58200, percentage: 20.2 },
                    { category: "Pilot Watches", amount: 42800, percentage: 14.9 },
                    { category: "Field Watches", amount: 33700, percentage: 11.8 }
                ]
            };

            setSalesData(mockData);
            setLoading(false);
            setTimeout(() => setContentLoaded(true), 100);
        }, 1000);
    }, []);

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        // In a real app, this would fetch new data for the time range
    };

    // Function to create a simple bar chart using divs
    const renderBarChart = (data, valueKey = 'amount', labelKey = 'month') => {
        if (!data || data.length === 0) return null;

        const maxValue = Math.max(...data.map(item => item[valueKey]));

        return (
            <div className="flex items-end h-40 space-x-2 mt-4">
                {data.map((item, index) => {
                    const heightPercent = (item[valueKey] / maxValue) * 100;

                    return (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div
                                className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t transition-all duration-500 ease-out"
                                style={{
                                    height: `${heightPercent}%`,
                                    transitionDelay: `${index * 100}ms`,
                                    opacity: contentLoaded ? 1 : 0,
                                    transform: contentLoaded ? 'scaleY(1)' : 'scaleY(0)',
                                    transformOrigin: 'bottom'
                                }}
                            />
                            <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">{item[labelKey]}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Function to create a horizontal bar chart
    const renderHorizontalBarChart = (data, valueKey = 'percentage', labelKey = 'category') => {
        if (!data || data.length === 0) return null;

        return (
            <div className="space-y-3 mt-4">
                {data.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{item[labelKey]}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                                {typeof item.amount === 'number' ? formatCurrency(item.amount) : ''}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-indigo-500 dark:bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${item[valueKey]}%`,
                                    transitionDelay: `${index * 100}ms`,
                                    opacity: contentLoaded ? 1 : 0
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
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
                            Sales Analytics
                        </AnimatedGradientText>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track performance metrics and sales insights
                    </p>
                </div>

                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm flex p-1">
                        <button
                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${timeRange === 'week'
                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                            onClick={() => handleTimeRangeChange('week')}
                        >
                            Week
                        </button>
                        <button
                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${timeRange === 'month'
                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                            onClick={() => handleTimeRangeChange('month')}
                        >
                            Month
                        </button>
                        <button
                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${timeRange === 'quarter'
                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                            onClick={() => handleTimeRangeChange('quarter')}
                        >
                            Quarter
                        </button>
                        <button
                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${timeRange === 'year'
                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}
                            onClick={() => handleTimeRangeChange('year')}
                        >
                            Year
                        </button>
                    </div>
                    <ShimmerButton onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <ArrowPathIcon className="h-5 w-5 mr-1" />
                        Refresh Data
                    </ShimmerButton>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                            <CurrencyDollarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</h3>
                            <p className="mt-1 text-2xl font-bold">{loading ? '...' : formatCurrency(salesData.totalSales)}</p>
                            <div className="mt-1 flex items-center text-xs text-green-600 dark:text-green-500">
                                <ArrowUpIcon className="h-3 w-3 mr-1" />
                                <span>12% from last month</span>
                            </div>
                        </div>
                    </div>
                </MagicCard>

                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <ShoppingBagIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Order Value</h3>
                            <p className="mt-1 text-2xl font-bold">${loading ? '...' : salesData.averageOrderValue.toLocaleString()}</p>
                            <div className="mt-1 flex items-center text-xs text-green-600 dark:text-green-500">
                                <ArrowUpIcon className="h-3 w-3 mr-1" />
                                <span>5% from last month</span>
                            </div>
                        </div>
                    </div>
                </MagicCard>

                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <UserIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</h3>
                            <p className="mt-1 text-2xl font-bold">{loading ? '...' : `${salesData.conversionRate}%`}</p>
                            <div className="mt-1 flex items-center text-xs text-red-600 dark:text-red-500">
                                <ArrowDownIcon className="h-3 w-3 mr-1" />
                                <span>0.5% from last month</span>
                            </div>
                        </div>
                    </div>
                </MagicCard>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Sales */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Monthly Sales</h2>
                        <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30">
                            <ChartBarIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    ) : (
                        renderBarChart(salesData.monthlySales)
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Looking strong with {timeRange === 'month' ? 'May' : 'Q2'} being the highest performing period
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Sales by Category</h2>
                        <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/30">
                            <ClockIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    ) : (
                        renderHorizontalBarChart(salesData.salesByCategory)
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Dive watches remain our most popular category
                    </div>
                </div>
            </div>

            {/* Top Selling Products & Customer Acquisition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="card">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">Top Selling Products</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">By revenue</p>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {salesData.topSellingProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-all duration-300 ${contentLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                        }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-xs font-medium text-indigo-800 dark:text-indigo-300">
                                            {index + 1}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{product.units} units sold</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${product.sales.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Customer Acquisition */}
                <div className="card">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">Customer Acquisition</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">By source</p>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    ) : (
                        renderHorizontalBarChart(salesData.customerAcquisition, 'percentage', 'source')
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-center">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                            <div className="font-medium text-gray-700 dark:text-gray-300">Returning Customers</div>
                            <div className="mt-1 text-lg font-semibold">68%</div>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                            <div className="font-medium text-gray-700 dark:text-gray-300">New Customers</div>
                            <div className="mt-1 text-lg font-semibold">32%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Annual Performance */}
            <div className="card">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">Annual Performance</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Year-to-date performance against targets</p>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Revenue</span>
                                <span className="text-gray-900 dark:text-white font-medium">$1.45M / $2.5M</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-indigo-500 dark:bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: '58%',
                                        opacity: contentLoaded ? 1 : 0
                                    }}
                                />
                            </div>
                            <div className="text-right text-xs text-gray-500 dark:text-gray-400">58% of annual target</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Units Sold</span>
                                <span className="text-gray-900 dark:text-white font-medium">124 / 200</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-purple-500 dark:bg-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: '62%',
                                        opacity: contentLoaded ? 1 : 0,
                                        transitionDelay: '200ms'
                                    }}
                                />
                            </div>
                            <div className="text-right text-xs text-gray-500 dark:text-gray-400">62% of annual target</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">New Customers</span>
                                <span className="text-gray-900 dark:text-white font-medium">58 / 100</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-amber-500 dark:bg-amber-600 h-4 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: '58%',
                                        opacity: contentLoaded ? 1 : 0,
                                        transitionDelay: '400ms'
                                    }}
                                />
                            </div>
                            <div className="text-right text-xs text-gray-500 dark:text-gray-400">58% of annual target</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics; 