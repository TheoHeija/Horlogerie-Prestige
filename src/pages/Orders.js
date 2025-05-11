import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
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
                    order.id.toString().includes(searchLower) ||
                    order.users?.name?.toLowerCase().includes(searchLower) ||
                    order.users?.email?.toLowerCase().includes(searchLower) ||
                    order.products?.name?.toLowerCase().includes(searchLower);

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage customer orders and track status</p>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="form-input pl-10"
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
                            className="form-input pl-10"
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
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading orders...</p>
                    </div>
                ) : filteredAndSortedOrders().length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm || statusFilter !== 'all' ? 'No orders found with the current filters.' : 'No orders found.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('id')}
                                            className="group flex items-center font-medium focus:outline-none"
                                        >
                                            Order ID
                                            {getSortIndicator('id')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('customer')}
                                            className="group flex items-center font-medium focus:outline-none"
                                        >
                                            Customer
                                            {getSortIndicator('customer')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('created_at')}
                                            className="group flex items-center font-medium focus:outline-none"
                                        >
                                            Date
                                            {getSortIndicator('created_at')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('total_price')}
                                            className="group flex items-center font-medium focus:outline-none"
                                        >
                                            Amount
                                            {getSortIndicator('total_price')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSortClick('status')}
                                            className="group flex items-center font-medium focus:outline-none"
                                        >
                                            Status
                                            {getSortIndicator('status')}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredAndSortedOrders().map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            #{order.id.toString().slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {order.users?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {order.products?.name || 'Unknown Product'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            ${order.total_price?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusClick(order)}
                                                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                                            >
                                                {order.status || 'pending'}
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
                            className="btn btn-secondary"
                            onClick={() => setIsStatusModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleStatusUpdate}
                        >
                            Update
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                        Order ID: #{currentOrder?.id.toString().slice(0, 8) || ''}
                    </p>

                    <div>
                        <label htmlFor="status" className="form-label">
                            Status
                        </label>
                        <select
                            id="status"
                            className="form-input"
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
            </Modal>
        </div>
    );
};

export default Orders; 