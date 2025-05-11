import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, FunnelIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getOrders, updateOrderStatus } from '../utils/supabase';
import Modal from '../components/layout/Modal';
import toast from 'react-hot-toast';

/**
 * Orders component - Page for managing orders
 * Lists all orders with filtering, sorting, and status update capabilities
 */
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Load orders data
    useEffect(() => {
        fetchOrders();
    }, []);

    // Fetch orders from Supabase
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await getOrders();
            if (error) throw error;
            console.log("Orders fetched:", data);
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error.message);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    // Handle status update
    const handleStatusUpdate = async () => {
        try {
            if (!currentOrder || !newStatus) return;

            const { error } = await updateOrderStatus(currentOrder.id, newStatus);
            if (error) throw error;

            // Update local state to reflect the change
            setOrders(orders.map(order =>
                order.id === currentOrder.id ? { ...order, status: newStatus } : order
            ));

            toast.success('Order status updated successfully');
            setIsStatusModalOpen(false);
        } catch (error) {
            console.error('Error updating order status:', error.message);
            toast.error(error.message || 'Failed to update order status');
        }
    };

    // Open status update modal
    const handleStatusClick = (order) => {
        setCurrentOrder(order);
        setNewStatus(order.status || 'pending');
        setIsStatusModalOpen(true);
    };

    // Open order details modal
    const handleViewDetails = (order) => {
        setCurrentOrder(order);
        setIsDetailsModalOpen(true);
    };

    // Toggle sort direction or change sort field
    const handleSortClick = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Filter and sort orders
    const filteredAndSortedOrders = () => {
        return orders
            .filter(order => {
                // Apply search filter
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch =
                    order.id?.toString().includes(searchLower) ||
                    order.users?.name?.toLowerCase().includes(searchLower) ||
                    order.users?.email?.toLowerCase().includes(searchLower) ||
                    order.products?.name?.toLowerCase().includes(searchLower) ||
                    order.products?.brand?.toLowerCase().includes(searchLower);

                // Apply status filter
                const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                // Apply sorting
                let valA, valB;

                switch (sortField) {
                    case 'created_at':
                        valA = new Date(a.created_at || 0);
                        valB = new Date(b.created_at || 0);
                        break;
                    case 'total_price':
                        valA = a.total_price || 0;
                        valB = b.total_price || 0;
                        break;
                    case 'customer':
                        valA = a.users?.name || '';
                        valB = b.users?.name || '';
                        break;
                    default:
                        valA = a[sortField] || '';
                        valB = b[sortField] || '';
                }

                if (sortDirection === 'asc') {
                    return valA > valB ? 1 : -1;
                } else {
                    return valA < valB ? 1 : -1;
                }
            });
    };

    // Helper function to get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
            case 'processing':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    // Get sort indicator
    const getSortIndicator = (field) => {
        if (field !== sortField) return null;

        return sortDirection === 'asc' ? (
            <ArrowUpIcon className="h-4 w-4 ml-1 inline-block text-gray-500 dark:text-gray-400" />
        ) : (
            <ArrowDownIcon className="h-4 w-4 ml-1 inline-block text-gray-500 dark:text-gray-400" />
        );
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('de-CH', {
            style: 'currency',
            currency: 'CHF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header with statistics */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-white mb-2">Orders</h1>
                <p className="text-gray-300 mb-6">Manage customer orders and track delivery status</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wider text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-amber-300 mt-1">
                            {orders.filter(o => o.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-gray-700/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wider text-gray-400">Processing</p>
                        <p className="text-2xl font-bold text-purple-400 mt-1">
                            {orders.filter(o => o.status === 'processing').length}
                        </p>
                    </div>
                    <div className="bg-gray-700/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wider text-gray-400">Shipped</p>
                        <p className="text-2xl font-bold text-blue-400 mt-1">
                            {orders.filter(o => o.status === 'shipped').length}
                        </p>
                    </div>
                    <div className="bg-gray-700/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wider text-gray-400">Completed</p>
                        <p className="text-2xl font-bold text-green-400 mt-1">
                            {orders.filter(o => o.status === 'completed').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="form-input pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                        placeholder="Search orders, customers, products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-64">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FunnelIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            className="form-input pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders list */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-2 border-t-indigo-600 border-gray-200 dark:border-gray-700 mx-auto"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading orders...</p>
                    </div>
                ) : filteredAndSortedOrders().length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4M8 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                            {searchTerm || statusFilter !== 'all' ? 'No orders found with the current filters.' : 'No orders found.'}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 mt-2">Try changing your search criteria or check back later.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('id')}
                                            className="group flex items-center font-medium focus:outline-none transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                            Order ID
                                            {getSortIndicator('id')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('customer')}
                                            className="group flex items-center font-medium focus:outline-none transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                            Customer
                                            {getSortIndicator('customer')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('created_at')}
                                            className="group flex items-center font-medium focus:outline-none transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                            Date
                                            {getSortIndicator('created_at')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('total_price')}
                                            className="group flex items-center font-medium focus:outline-none transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                            Amount
                                            {getSortIndicator('total_price')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('status')}
                                            className="group flex items-center font-medium focus:outline-none transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                            Status
                                            {getSortIndicator('status')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredAndSortedOrders().map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                #{order.id?.toString().slice(0, 8) || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {order.payment_method || 'Standard Payment'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {order.users?.name || 'Unknown'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {order.users?.email || 'No email provided'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {order.products?.image_url ? (
                                                    <img 
                                                        src={order.products.image_url} 
                                                        alt={order.products?.name || ''} 
                                                        className="h-12 w-12 rounded-lg object-cover mr-3 border border-gray-200 dark:border-gray-600 shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{order.products?.name || 'Unknown Product'}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{order.products?.brand || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }) : 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {order.created_at ? new Date(order.created_at).toLocaleTimeString('en-GB', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(order.total_price || 0)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusClick(order)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                                            >
                                                {order.status || 'pending'}
                                            </button>
                                            {order.tracking_number && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                                    #{order.tracking_number.slice(0, 10)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs rounded-md font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-1" />
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            <Modal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                title="Update Order Status"
                footer={
                    <>
                        <button
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsStatusModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white text-sm rounded-lg font-medium transition-colors ml-3"
                            onClick={handleStatusUpdate}
                        >
                            Update Status
                        </button>
                    </>
                }
            >
                {currentOrder && (
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order #{currentOrder.id?.toString().slice(0, 8)}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {currentOrder.created_at ? new Date(currentOrder.created_at).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap gap-3 mb-3">
                                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {currentOrder.products?.name || 'Unknown Product'}
                                </div>
                                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {formatCurrency(currentOrder.total_price || 0)}
                                </div>
                                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {currentOrder.users?.name || 'Unknown Customer'}
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Update Status
                                </label>
                                <select
                                    id="status"
                                    className="form-input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-500 dark:text-gray-400">
                                Current status: <span className={`inline-block px-2.5 py-0.5 rounded-full ${getStatusColor(currentOrder.status)}`}>
                                    {currentOrder.status || 'pending'}
                                </span>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                Last updated: {currentOrder.created_at ? new Date(currentOrder.created_at).toLocaleString() : 'N/A'}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Order Details Modal */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                title="Order Details"
                footer={
                    <button
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white text-sm rounded-lg font-medium transition-colors"
                        onClick={() => setIsDetailsModalOpen(false)}
                    >
                        Close
                    </button>
                }
            >
                {currentOrder && (
                    <div className="space-y-8">
                        {/* Order header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center">
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-2">
                                        Order
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">#{currentOrder.id?.toString().slice(0, 8)}</h3>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Placed on {currentOrder.created_at ? new Date(currentOrder.created_at).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStatusColor(currentOrder.status)}`}>
                                    {currentOrder.status || 'pending'}
                                </span>
                            </div>
                        </div>

                        {/* Order timeline */}
                        <div className="border-l-2 border-indigo-200 dark:border-indigo-900 pl-5 py-2 space-y-6">
                            {currentOrder.status === 'pending' || currentOrder.status === 'processing' || currentOrder.status === 'shipped' || currentOrder.status === 'completed' ? (
                                <div className="relative">
                                    <div className="absolute -left-[26px] p-1 bg-amber-500 rounded-full border-4 border-amber-100 dark:border-gray-800"></div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Order Received</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Order has been placed and payment confirmed</p>
                                </div>
                            ) : null}
                            
                            {currentOrder.status === 'processing' || currentOrder.status === 'shipped' || currentOrder.status === 'completed' ? (
                                <div className="relative">
                                    <div className="absolute -left-[26px] p-1 bg-purple-500 rounded-full border-4 border-purple-100 dark:border-gray-800"></div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Order Processing</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your luxury timepiece is being prepared for shipment</p>
                                </div>
                            ) : null}
                            
                            {currentOrder.status === 'shipped' || currentOrder.status === 'completed' ? (
                                <div className="relative">
                                    <div className="absolute -left-[26px] p-1 bg-blue-500 rounded-full border-4 border-blue-100 dark:border-gray-800"></div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Order Shipped</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your order is on its way</p>
                                    {currentOrder.tracking_number && (
                                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">Tracking: {currentOrder.tracking_number}</p>
                                    )}
                                </div>
                            ) : null}
                            
                            {currentOrder.status === 'completed' ? (
                                <div className="relative">
                                    <div className="absolute -left-[26px] p-1 bg-green-500 rounded-full border-4 border-green-100 dark:border-gray-800"></div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Order Delivered</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your order has been delivered successfully</p>
                                </div>
                            ) : null}
                            
                            {currentOrder.status === 'cancelled' ? (
                                <div className="relative">
                                    <div className="absolute -left-[26px] p-1 bg-red-500 rounded-full border-4 border-red-100 dark:border-gray-800"></div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Order Cancelled</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This order has been cancelled</p>
                                </div>
                            ) : null}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="text-md font-semibold text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-700">
                                    Customer Information
                                </h3>
                                <div className="pt-3 space-y-3">
                                    <p className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{currentOrder.users?.name || 'Unknown'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{currentOrder.users?.email || 'N/A'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Shipping</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{currentOrder.shipping_address || 'N/A'}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="text-md font-semibold text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-700">
                                    Order Information
                                </h3>
                                <div className="pt-3 space-y-3">
                                    <p className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Order Date</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {currentOrder.created_at ? new Date(currentOrder.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{currentOrder.payment_method || 'N/A'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(currentOrder.total_price || 0)}</span>
                                    </p>
                                    {currentOrder.tracking_number && (
                                        <p className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{currentOrder.tracking_number}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-md font-semibold text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-700 mb-4">
                                Product Details
                            </h3>
                            <div className="bg-white dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    {currentOrder.products?.image_url ? (
                                        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                            <img 
                                                src={currentOrder.products.image_url} 
                                                alt={currentOrder.products?.name || ''} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="md:w-1/3 h-48 md:h-auto bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="p-5 md:w-2/3 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {currentOrder.products?.name || 'Unknown Product'}
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                                {currentOrder.products?.brand || ''}
                                            </p>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Price:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(currentOrder.products?.price || 0)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">1</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-medium mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                                <span className="text-gray-800 dark:text-gray-200">Total:</span>
                                                <span className="text-indigo-600 dark:text-indigo-400">
                                                    {formatCurrency(currentOrder.total_price || 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders; 