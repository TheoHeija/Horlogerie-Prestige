import { useState, useEffect, useCallback } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { supabase, createServiceRequestsTableIfNotExists } from '../utils/supabase';
import Modal from '../components/layout/Modal';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/helpers';

/**
 * Service component - Page for managing watch service/repair requests
 */
const Service = () => {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);

    // Initial form state
    const initialFormState = {
        customer_name: '',
        email: '',
        phone: '',
        watch_brand: '',
        watch_model: '',
        serial_number: '',
        service_type: 'maintenance',
        issue_description: '',
        estimated_cost: '',
        status: 'received',
        technician: '',
        received_date: new Date().toISOString().split('T')[0],
        completion_date: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch service requests wrapped in useCallback to avoid infinite loop
    const fetchServiceRequests = useCallback(async () => {
        setLoading(true);
        try {
            // First, check if the service_requests table exists
            await createServiceRequestsTableIfNotExists();

            // Try to get from Supabase first
            const { data, error } = await supabase
                .from('service_requests')
                .select('*')
                .order('received_date', { ascending: false });

            if (error) {
                console.error('Error fetching from Supabase:', error);
                // Fallback to mock data
                const mockData = getMockServiceRequests();
                setServiceRequests(mockData);
            } else {
                setServiceRequests(data || []);
            }
        } catch (error) {
            console.error('Error fetching service requests:', error);
            // Fallback to mock data
            const mockData = getMockServiceRequests();
            setServiceRequests(mockData);
        } finally {
            setLoading(false);
        }
    }, []);

    // Simulate fetching service requests (mock data for now)
    useEffect(() => {
        fetchServiceRequests();
    }, [fetchServiceRequests]);

    // Mock data if Supabase isn't set up yet
    const getMockServiceRequests = () => {
        return [
            {
                id: '1',
                customer_name: 'John Smith',
                email: 'john.smith@example.com',
                phone: '(555) 123-4567',
                watch_brand: 'Rolex',
                watch_model: 'Submariner',
                serial_number: 'RX789012345',
                service_type: 'maintenance',
                issue_description: 'Regular maintenance service',
                estimated_cost: 650,
                status: 'completed',
                technician: 'David Chen',
                received_date: '2023-05-15',
                completion_date: '2023-05-25',
            },
            {
                id: '2',
                customer_name: 'Emma Johnson',
                email: 'emma.j@example.com',
                phone: '(555) 987-6543',
                watch_brand: 'Patek Philippe',
                watch_model: 'Nautilus',
                serial_number: 'PP12345678',
                service_type: 'repair',
                issue_description: 'Watch runs fast, crystal has scratch',
                estimated_cost: 1200,
                status: 'in_progress',
                technician: 'Maria Rodriguez',
                received_date: '2023-05-18',
                completion_date: '',
            },
            {
                id: '3',
                customer_name: 'Michael Brown',
                email: 'mbrown@example.com',
                phone: '(555) 456-7890',
                watch_brand: 'Audemars Piguet',
                watch_model: 'Royal Oak',
                serial_number: 'AP567891234',
                service_type: 'overhaul',
                issue_description: 'Complete movement overhaul needed',
                estimated_cost: 2500,
                status: 'received',
                technician: '',
                received_date: '2023-05-20',
                completion_date: '',
            }
        ];
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'estimated_cost'
            ? value === '' ? '' : parseFloat(value)
            : value;

        setFormData({
            ...formData,
            [name]: parsedValue,
        });
    };

    // Open modal for adding a new service request
    const handleAddRequest = () => {
        setCurrentRequest(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    // Open modal for editing an existing service request
    const handleEditRequest = (request) => {
        setCurrentRequest(request);
        setFormData({
            customer_name: request.customer_name || '',
            email: request.email || '',
            phone: request.phone || '',
            watch_brand: request.watch_brand || '',
            watch_model: request.watch_model || '',
            serial_number: request.serial_number || '',
            service_type: request.service_type || 'maintenance',
            issue_description: request.issue_description || '',
            estimated_cost: request.estimated_cost?.toString() || '',
            status: request.status || 'received',
            technician: request.technician || '',
            received_date: request.received_date || '',
            completion_date: request.completion_date || '',
        });
        setIsModalOpen(true);
    };

    // Open confirmation modal for deleting a service request
    const handleDeleteClick = (request) => {
        setCurrentRequest(request);
        setIsDeleteModalOpen(true);
    };

    // Save service request (create or update)
    const handleSaveRequest = async () => {
        try {
            // Validate form data
            if (!formData.customer_name || !formData.watch_brand || !formData.watch_model) {
                toast.error('Customer name, watch brand, and model are required');
                return;
            }

            if (currentRequest) {
                // Update existing service request
                const { error } = await supabase
                    .from('service_requests')
                    .update(formData)
                    .eq('id', currentRequest.id);

                if (error) {
                    console.error('Error updating in Supabase:', error);
                    // Fallback to local update
                    const updatedRequests = serviceRequests.map(req =>
                        req.id === currentRequest.id ? { ...req, ...formData } : req
                    );
                    setServiceRequests(updatedRequests);
                } else {
                    await fetchServiceRequests();
                }
                toast.success('Service request updated successfully');
            } else {
                // Create new service request
                const newRequest = {
                    ...formData,
                    id: Date.now().toString(), // Fallback ID for mock
                };

                const { error } = await supabase
                    .from('service_requests')
                    .insert([formData]);

                if (error) {
                    console.error('Error inserting to Supabase:', error);
                    // Fallback to local insert
                    setServiceRequests([newRequest, ...serviceRequests]);
                } else {
                    await fetchServiceRequests();
                }
                toast.success('Service request created successfully');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving service request:', error);
            toast.error('Failed to save service request');
        }
    };

    // Delete service request
    const handleDeleteRequest = async () => {
        try {
            if (!currentRequest) return;

            const { error } = await supabase
                .from('service_requests')
                .delete()
                .eq('id', currentRequest.id);

            if (error) {
                console.error('Error deleting from Supabase:', error);
                // Fallback to local delete
                const filteredRequests = serviceRequests.filter(req => req.id !== currentRequest.id);
                setServiceRequests(filteredRequests);
            } else {
                await fetchServiceRequests();
            }

            toast.success('Service request deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting service request:', error);
            toast.error('Failed to delete service request');
        }
    };

    // Filter service requests based on search term
    const filteredRequests = serviceRequests.filter((request) => {
        const searchString = searchTerm.toLowerCase();
        return (
            request.customer_name?.toLowerCase().includes(searchString) ||
            request.watch_brand?.toLowerCase().includes(searchString) ||
            request.watch_model?.toLowerCase().includes(searchString) ||
            request.serial_number?.toLowerCase().includes(searchString)
        );
    });

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'received':
                return 'badge-info';
            case 'in_progress':
                return 'badge-warning';
            case 'completed':
                return 'badge-success';
            case 'delivered':
                return 'badge-primary';
            case 'cancelled':
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    };

    // Get status display name
    const getStatusName = (status) => {
        switch (status) {
            case 'received':
                return 'Received';
            case 'in_progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service & Repairs</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage watch service and repair requests</p>
                </div>
                <button
                    onClick={handleAddRequest}
                    className="btn btn-primary inline-flex items-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    New Service Request
                </button>
            </div>

            {/* Search and filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Search by customer, brand, model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div>
                    <select
                        className="form-input"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    >
                        <option value="">Filter by Status</option>
                        <option value="received">Received</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <select
                        className="form-input"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    >
                        <option value="">Filter by Service Type</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="repair">Repair</option>
                        <option value="overhaul">Overhaul</option>
                        <option value="restoration">Restoration</option>
                    </select>
                </div>
            </div>

            {/* Service requests table */}
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell text-left">Customer</th>
                                <th className="table-header-cell text-left">Watch</th>
                                <th className="table-header-cell text-left">Service Type</th>
                                <th className="table-header-cell text-center">Received</th>
                                <th className="table-header-cell text-center">Status</th>
                                <th className="table-header-cell text-right">Est. Cost</th>
                                <th className="table-header-cell text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                // Loading skeleton
                                [...Array(3)].map((_, index) => (
                                    <tr key={index} className="table-row animate-pulse">
                                        <td className="table-cell">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                        </td>
                                        <td className="table-cell text-center">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                                        </td>
                                        <td className="table-cell text-center">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                                        </td>
                                        <td className="table-cell text-right">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ml-auto"></div>
                                        </td>
                                        <td className="table-cell text-right">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ml-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <tr key={request.id} className="table-row hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="table-cell">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {request.customer_name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {request.email}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {request.watch_brand} {request.watch_model}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                SN: {request.serial_number || 'Not provided'}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="capitalize">{request.service_type}</span>
                                        </td>
                                        <td className="table-cell text-center">
                                            {formatDate(request.received_date)}
                                        </td>
                                        <td className="table-cell text-center">
                                            <span className={`badge ${getStatusColor(request.status)}`}>
                                                {getStatusName(request.status)}
                                            </span>
                                        </td>
                                        <td className="table-cell text-right font-medium">
                                            {formatCurrency(parseFloat(request.estimated_cost || 0))}
                                        </td>
                                        <td className="table-cell text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditRequest(request)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    title="Edit request"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(request)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    title="Delete request"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="table-cell text-center py-8">
                                        <div className="text-gray-500 dark:text-gray-400">
                                            No service requests found
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Service Request Modal */}
            <Modal
                isOpen={isModalOpen}
                title={currentRequest ? 'Edit Service Request' : 'New Service Request'}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="customer_name" className="form-label">
                                Customer Name <span className="form-required">*</span>
                            </label>
                            <input
                                type="text"
                                id="customer_name"
                                name="customer_name"
                                className="form-input"
                                value={formData.customer_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="form-input"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="watch_brand" className="form-label">
                                Watch Brand <span className="form-required">*</span>
                            </label>
                            <input
                                type="text"
                                id="watch_brand"
                                name="watch_brand"
                                className="form-input"
                                value={formData.watch_brand}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="watch_model" className="form-label">
                                Watch Model <span className="form-required">*</span>
                            </label>
                            <input
                                type="text"
                                id="watch_model"
                                name="watch_model"
                                className="form-input"
                                value={formData.watch_model}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="serial_number" className="form-label">Serial Number</label>
                        <input
                            type="text"
                            id="serial_number"
                            name="serial_number"
                            className="form-input"
                            value={formData.serial_number}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="service_type" className="form-label">Service Type</label>
                            <select
                                id="service_type"
                                name="service_type"
                                className="form-input"
                                value={formData.service_type}
                                onChange={handleInputChange}
                            >
                                <option value="maintenance">Maintenance</option>
                                <option value="repair">Repair</option>
                                <option value="overhaul">Overhaul</option>
                                <option value="restoration">Restoration</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="form-input"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="received">Received</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="issue_description" className="form-label">Issue Description</label>
                        <textarea
                            id="issue_description"
                            name="issue_description"
                            rows="3"
                            className="form-input"
                            value={formData.issue_description}
                            onChange={handleInputChange}
                            placeholder="Describe the issue or service needed..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="estimated_cost" className="form-label">Estimated Cost ($)</label>
                            <input
                                type="number"
                                id="estimated_cost"
                                name="estimated_cost"
                                className="form-input"
                                value={formData.estimated_cost}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="technician" className="form-label">Assigned Technician</label>
                            <input
                                type="text"
                                id="technician"
                                name="technician"
                                className="form-input"
                                value={formData.technician}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="received_date" className="form-label">Date Received</label>
                            <input
                                type="date"
                                id="received_date"
                                name="received_date"
                                className="form-input"
                                value={formData.received_date}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="completion_date" className="form-label">Completion Date</label>
                            <input
                                type="date"
                                id="completion_date"
                                name="completion_date"
                                className="form-input"
                                value={formData.completion_date}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            className="btn-modal-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-modal-primary"
                            onClick={handleSaveRequest}
                        >
                            {currentRequest ? 'Update Request' : 'Create Request'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                title="Delete Service Request"
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete this service request? This action cannot be undone.
                    </p>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon className="h-5 w-5 text-amber-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    This will permanently remove the service request and all associated records from the system.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            className="btn-modal-secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-modal-danger"
                            onClick={handleDeleteRequest}
                        >
                            Delete Request
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Service; 