import { useState, useEffect, useCallback } from 'react';
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
    ClockIcon,
    PresentationChartLineIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../utils/helpers';
import { getAnalyticsData } from '../utils/supabase';
import { 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    PieChart, 
    Pie, 
    Cell, 
    Legend 
} from 'recharts';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [timeRange, setTimeRange] = useState('month');
    const [error, setError] = useState(null);

    // Data state using the same structure as our API
    const [analyticsData, setAnalyticsData] = useState({
        totalSales: 0,
        orderCount: 0,
        averageOrderValue: 0,
        topSellingProducts: [],
        monthlySales: [],
        salesByCategory: [],
        paymentMethods: [],
        orderStatus: [],
        customerRetention: {
            returning: { count: 0, percentage: 0 },
            new: { count: 0, percentage: 0 }
        }
    });

    // Colors for charts
    const COLORS = ['#4F46E5', '#9333EA', '#EC4899', '#F97316', '#EAB308', '#22C55E'];

    const fetchAnalyticsData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Pass false for debugMode in production to reduce console logs
            const { data, error } = await getAnalyticsData(timeRange, false);
            
            if (error) {
                throw error;
            }
            
            // Set the data if it exists
            if (data) {
                setAnalyticsData(data);
            }
            
            setLoading(false);
            
            // Slight delay for animation
            setTimeout(() => setContentLoaded(true), 100);
        } catch (err) {
            console.error('Error fetching analytics data:', err);
            setError('Failed to load analytics data. Please try again later.');
            setLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        fetchAnalyticsData();
    }, [fetchAnalyticsData]);

    const handleTimeRangeChange = (range) => {
        if (range !== timeRange) {
            setTimeRange(range);
            setContentLoaded(false);
        }
    };

    const handleRefresh = () => {
        setContentLoaded(false);
        fetchAnalyticsData();
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
                    <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Error display
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Failed to Load Analytics</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <ShimmerButton onClick={handleRefresh} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <ArrowPathIcon className="h-5 w-5 mr-1" />
                    Try Again
                </ShimmerButton>
            </div>
        );
    }

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
                    <ShimmerButton onClick={handleRefresh} className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
                            <p className="mt-1 text-2xl font-bold">{loading ? '...' : formatCurrency(analyticsData.totalSales)}</p>
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
                            <p className="mt-1 text-2xl font-bold">{loading ? '...' : formatCurrency(analyticsData.averageOrderValue)}</p>
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
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</h3>
                            <p className="mt-1 text-2xl font-bold">{loading ? '...' : analyticsData.orderCount}</p>
                            <div className="mt-1 flex items-center text-xs text-green-600 dark:text-green-500">
                                <ArrowUpIcon className="h-3 w-3 mr-1" />
                                <span>8% from last month</span>
                            </div>
                        </div>
                    </div>
                </MagicCard>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Sales */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Monthly Sales</h2>
                        <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30">
                            <ChartBarIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    ) : (
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={analyticsData.monthlySales}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="month" />
                                    <YAxis 
                                        tickFormatter={value => `$${(value / 1000).toFixed(0)}k`} 
                                        width={60}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar 
                                        dataKey="amount" 
                                        fill="#4F46E5" 
                                        name="Sales"
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Looking strong with continuous growth over the last months
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Sales by Brand</h2>
                        <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/30">
                            <PresentationChartLineIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    ) : (
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData.salesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="amount"
                                        nameKey="category"
                                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                                        labelLine={false}
                                        animationDuration={1500}
                                    >
                                        {analyticsData.salesByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={value => formatCurrency(value)} />
                                    <Legend 
                                        layout="horizontal" 
                                        verticalAlign="bottom" 
                                        align="center"
                                        formatter={(value) => <span className="text-xs">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        Premium brands account for the majority of our sales
                    </div>
                </div>
            </div>

            {/* Top Selling Products & Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
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
                            {analyticsData.topSellingProducts.map((product, index) => (
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
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {product.name}
                                                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{product.brand}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{product.units} units sold</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(product.sales)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payment Methods */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">Payment Methods</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Distribution by order count</p>
                    </div>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    ) : (
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData.paymentMethods.map(method => ({
                                            name: method.payment_method || 'Other',
                                            value: parseInt(method.count)
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                        animationDuration={1500}
                                    >
                                        {analyticsData.paymentMethods.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-center">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                            <div className="font-medium text-gray-700 dark:text-gray-300">Returning Customers</div>
                            <div className="mt-1 text-lg font-semibold">{analyticsData.customerRetention.returning.percentage}%</div>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                            <div className="font-medium text-gray-700 dark:text-gray-300">New Customers</div>
                            <div className="mt-1 text-lg font-semibold">{analyticsData.customerRetention.new.percentage}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">Order Status Distribution</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current status of all orders</p>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {analyticsData.orderStatus.map((status, index) => {
                            // Calculate percentage of orders with this status
                            const percentage = Math.round((parseInt(status.count) / analyticsData.orderCount) * 100);
                            
                            // Different colors for different statuses
                            let barColor;
                            switch(status.status) {
                                case 'completed':
                                    barColor = 'bg-green-500 dark:bg-green-600';
                                    break;
                                case 'processing':
                                    barColor = 'bg-blue-500 dark:bg-blue-600';
                                    break;
                                case 'shipped':
                                    barColor = 'bg-purple-500 dark:bg-purple-600';
                                    break;
                                case 'pending':
                                    barColor = 'bg-yellow-500 dark:bg-yellow-600';
                                    break;
                                case 'cancelled':
                                    barColor = 'bg-red-500 dark:bg-red-600';
                                    break;
                                default:
                                    barColor = 'bg-gray-500 dark:bg-gray-600';
                            }
                            
                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{status.status}</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{status.count} orders</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                        <div
                                            className={`${barColor} h-4 rounded-full transition-all duration-1000 ease-out`}
                                            style={{
                                                width: `${percentage}%`,
                                                opacity: contentLoaded ? 1 : 0,
                                                transitionDelay: `${index * 200}ms`
                                            }}
                                        />
                                    </div>
                                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">{percentage}% of all orders</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics; 