import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    UserGroupIcon,
    ShoppingBagIcon,
    ArrowDownIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import { getUsers, getOrders, getProducts, createProductsTableIfNotExists } from '../utils/supabase';
// Import recharts components
import {
    PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { ShinyButton } from '../components/ui/shiny-button';
import { MagicCard } from '../components/ui/magic-card';
import { TextReveal } from '../components/ui/text-reveal';
import { cn, formatCurrency } from '../utils/helpers';

/**
 * Dashboard component - Main overview page displaying stats and recent activity
 */
const Dashboard = () => {
    const [statsData, setStatsData] = useState({
        users: { count: 0, loading: true },
        orders: { count: 0, loading: true },
        products: { count: 0, loading: true },
        revenue: { total: 0, loading: true }
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [timeRange, setTimeRange] = useState('month');

    // Add new state for chart data
    const [brandChartData, setBrandChartData] = useState([]);
    const [salesTrendData, setSalesTrendData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // First try to ensure products table exists
                await createProductsTableIfNotExists();

                // Fetch users data
                const { data: usersData } = await getUsers();

                // Fetch orders data
                const { data: ordersData } = await getOrders();

                // Fetch products data
                const { data: productsData } = await getProducts();

                // Calculate total revenue
                const totalRevenue = ordersData?.reduce((total, order) => {
                    return total + (order.total_price || 0);
                }, 0) || 0;

                // Set stats data
                setStatsData({
                    users: { count: usersData?.length || 0, loading: false },
                    orders: { count: ordersData?.length || 0, loading: false },
                    products: { count: productsData?.length || 0, loading: false },
                    revenue: { total: totalRevenue, loading: false }
                });

                // Set recent orders (last 5)
                setRecentOrders(ordersData?.slice(0, 5) || []);

                // Calculate top products (simplified example)
                const productCounts = {};
                ordersData?.forEach(order => {
                    if (order.product_id) {
                        productCounts[order.product_id] = (productCounts[order.product_id] || 0) + 1;
                    }
                });

                const topProductIds = Object.keys(productCounts)
                    .sort((a, b) => productCounts[b] - productCounts[a])
                    .slice(0, 3);

                const topProductsData = productsData?.filter(product =>
                    topProductIds.includes(product.id.toString())
                ) || [];

                setTopProducts(topProductsData);

                // Process data for charts
                processChartData(productsData || [], ordersData || []);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    // Process data for various charts
    const processChartData = (products, orders) => {
        // Prepare data for brand distribution chart
        const brandCounts = {};
        products.forEach(product => {
            if (product.brand) {
                brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
            }
        });

        const brandData = Object.entries(brandCounts).map(([name, value]) => ({ name, value }));
        setBrandChartData(brandData);

        // Generate sales trend data (mock data with realistic pattern)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const currentMonth = now.getMonth();

        // Create last 6 months of data
        const trendData = [];
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const month = months[monthIndex];

            // Base value with some randomness
            const baseValue = 10000 + Math.random() * 5000;
            // Add seasonal effect (higher in Dec, lower in Jan-Feb)
            const seasonalFactor = monthIndex === 11 ? 1.5 : monthIndex < 2 ? 0.8 : 1;
            // Add growth trend
            const growthFactor = 1 + (i * 0.05);

            trendData.push({
                name: month,
                value: Math.round(baseValue * seasonalFactor / growthFactor),
                orders: Math.round((baseValue * seasonalFactor / growthFactor) / 1500)
            });
        }

        setSalesTrendData(trendData);
    };

    // Handle time range change
    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        // Would typically refetch data based on selected time range
    };

    const timeRangeOptions = [
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'quarter', label: 'Quarter' },
        { value: 'year', label: 'Year' },
    ];

    // Statistic card items
    const statCards = [
        {
            title: 'Total Users',
            value: statsData.users.count,
            icon: UserGroupIcon,
            loading: statsData.users.loading,
            change: '+12%',
            changeType: 'increase',
            link: '/customers',
            iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            borderColor: 'before:from-indigo-400 before:to-indigo-600',
            subtitle: 'Active customers',
            secondaryMetric: {
                label: 'Retention rate',
                value: '94%'
            },
            trendData: [5, 6, 5, 7, 8, 8, 10, 9, 12, 14, 13, 15]
        },
        {
            title: 'Total Orders',
            value: statsData.orders.count,
            icon: ShoppingBagIcon,
            loading: statsData.orders.loading,
            change: '+8%',
            changeType: 'increase',
            link: '/orders',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            borderColor: 'before:from-blue-400 before:to-blue-600',
            subtitle: 'Total purchases',
            secondaryMetric: {
                label: 'Avg. order value',
                value: formatCurrency(15200)
            },
            trendData: [12, 14, 10, 16, 18, 15, 22, 20, 26, 25, 28, 30]
        },
        {
            title: 'Products',
            value: statsData.products.count,
            icon: CubeIcon,
            loading: statsData.products.loading,
            change: '-3%',
            changeType: 'decrease',
            link: '/products',
            iconBg: 'bg-amber-100 dark:bg-amber-900/30',
            iconColor: 'text-amber-600 dark:text-amber-400',
            borderColor: 'before:from-amber-400 before:to-amber-600',
            subtitle: 'Total watch inventory',
            secondaryMetric: {
                label: 'Low stock',
                value: '5 items'
            },
            trendData: [30, 28, 27, 24, 25, 23, 22, 20, 21, 18, 17, 16]
        },
        {
            title: 'Revenue',
            value: formatCurrency(statsData.revenue.total),
            icon: CurrencyDollarIcon,
            loading: statsData.revenue.loading,
            change: '+15%',
            changeType: 'increase',
            link: '/analytics',
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
            borderColor: 'before:from-green-400 before:to-green-600',
            subtitle: 'Total sales volume',
            secondaryMetric: {
                label: 'Profit margin',
                value: '42%'
            },
            trendData: [42000, 38000, 45000, 50000, 49000, 60000, 70000, 65000, 75000, 90000, 85000, 100000]
        }
    ];

    // Helper function to get status badge
    const StatusBadge = ({ status }) => {
        const getStatusConfig = (status) => {
            switch (status?.toLowerCase()) {
                case 'completed':
                    return {
                        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                        label: 'Completed'
                    };
                case 'pending':
                    return {
                        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                        label: 'Pending'
                    };
                case 'processing':
                    return {
                        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                        label: 'Processing'
                    };
                case 'shipped':
                    return {
                        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
                        label: 'Shipped'
                    };
                case 'cancelled':
                    return {
                        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                        label: 'Cancelled'
                    };
                default:
                    return {
                        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
                        label: status || 'Unknown'
                    };
            }
        };

        const config = getStatusConfig(status);

        return (
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    };

    // Colors for pie charts
    const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#06B6D4'];

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{`${payload[0].name}: ${payload[0].value}`}</p>
                    {payload[0].payload.percentage && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{`${payload[0].payload.percentage.toFixed(2)}%`}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    // Add this new component for custom sparklines
    const SimpleSparkline = ({ data, height = 30, color = "#10B981", spotColor = "#10B981" }) => {
        if (!data || data.length === 0) return null;
        
        const values = [...data];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;
        
        // Calculate points for the sparkline
        const points = values.map((value, index) => {
            const x = (index / (values.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');
        
        return (
            <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
                <circle
                    cx={100}
                    cy={100 - ((values[values.length - 1] - min) / range) * 100}
                    r="2"
                    fill={spotColor}
                />
            </svg>
        );
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                    <TextReveal
                        text="Dashboard Overview"
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    />
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome to Horlogerie Prestige admin dashboard
                    </p>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
                    <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2" />
                    <div className="flex rounded-md">
                        {timeRangeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleTimeRangeChange(option.value)}
                                className={cn(
                                    "px-3 py-1.5 text-sm transition-colors rounded-md",
                                    timeRange === option.value
                                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <MagicCard
                            className="h-full overflow-hidden relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/50"
                            spotlight
                            spotlightColor={card.changeType === 'increase' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}
                        >
                            <Link to={card.link} className="block p-6 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2.5 rounded-lg ${card.iconBg} transform transition-transform group-hover:scale-110`}>
                                            <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                                        </div>
                                        <div>
                                            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                                {card.title}
                                            </span>
                                            {card.subtitle && (
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    {card.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full ${card.changeType === 'increase'
                                        ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                                        : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                                        }`}>
                                        {card.changeType === 'increase' ? (
                                            <ArrowTrendingUpIcon className="h-3 w-3" />
                                        ) : (
                                            <ArrowDownIcon className="h-3 w-3" />
                                        )}
                                        <span>{card.change}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-1">
                                    {card.loading ? (
                                        <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    ) : (
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                            {card.value}
                                        </span>
                                    )}
                                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        vs previous {timeRange}
                                    </span>
                                </div>

                                {card.trendData && !card.loading && (
                                    <div className="mt-3 h-12 flex-grow">
                                        <SimpleSparkline 
                                            data={card.trendData} 
                                            height={40}
                                            color={card.changeType === 'increase' ? "#10B981" : "#EF4444"}
                                            spotColor={card.changeType === 'increase' ? "#10B981" : "#EF4444"}
                                        />
                                    </div>
                                )}

                                {card.secondaryMetric && (
                                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{card.secondaryMetric.label}</span>
                                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{card.secondaryMetric.value}</span>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </MagicCard>
                    </motion.div>
                ))}
            </motion.div>

            {/* Sales & Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Over Time Chart */}
                <motion.div
                    className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h3>
                        <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                                +23%
                            </span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={salesTrendData}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366F1"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Brand Distribution */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Brand Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={brandChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {brandChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Orders & Best Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                            <Link to="/orders">
                                <ShinyButton
                                    className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 dark:text-indigo-400"
                                >
                                    View All
                                </ShinyButton>
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Order ID</th>
                                    <th className="px-6 py-3 font-medium">Customer</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <motion.tr
                                            key={order.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                            whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.2)' }}
                                        >
                                            <td className="px-6 py-4 font-medium">#{order.id}</td>
                                            <td className="px-6 py-4">{order.customer_name || 'N/A'}</td>
                                            <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">${order.total_price?.toFixed(2) || '0.00'}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No recent orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Top Products */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Best Selling Products</h3>
                            <Link to="/products">
                                <ShinyButton
                                    className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 dark:text-indigo-400"
                                >
                                    View All
                                </ShinyButton>
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <div key={product.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`rounded-lg flex items-center justify-center w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400`}>
                                            <span className="font-medium">{index + 1}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {product.name || 'Unnamed Product'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {product.brand || 'Unknown Brand'} • {product.reference_number || 'No Ref'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(product.price || 0)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Stock: {product.inventory_count || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                No product data available
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard; 