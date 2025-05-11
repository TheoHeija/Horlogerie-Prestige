import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getUsers, createUser, updateUser, deleteUser } from '../utils/supabase';
import Modal from '../components/layout/Modal';
import toast from 'react-hot-toast';

/**
 * Users component - Page for managing users
 * Lists all users and provides functionality to add/edit/delete users
 */
const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Initial form state
    const initialFormState = {
        name: '',
        email: '',
        role: 'customer',
    };

    const [formData, setFormData] = useState(initialFormState);

    // Load users data
    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch users from Supabase
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await getUsers();
            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error.message);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Open modal for adding a new user
    const handleAddUser = () => {
        setCurrentUser(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    // Open modal for editing an existing user
    const handleEditUser = (user) => {
        setCurrentUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'customer',
        });
        setIsModalOpen(true);
    };

    // Open confirmation modal for deleting a user
    const handleDeleteClick = (user) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
    };

    // Save user (create or update)
    const handleSaveUser = async () => {
        try {
            if (currentUser) {
                // Update existing user
                const { error } = await updateUser(currentUser.id, formData);
                if (error) throw error;
                toast.success('User updated successfully');
            } else {
                // Create new user
                const { error } = await createUser(formData);
                if (error) throw error;
                toast.success('User created successfully');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error.message);
            toast.error(error.message || 'Failed to save user');
        }
    };

    // Delete user
    const handleDeleteUser = async () => {
        try {
            if (!currentUser) return;

            const { error } = await deleteUser(currentUser.id);
            if (error) throw error;

            toast.success('User deleted successfully');
            setIsDeleteModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error.message);
            toast.error(error.message || 'Failed to delete user');
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter((user) => {
        const searchString = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(searchString) ||
            user.email?.toLowerCase().includes(searchString) ||
            user.role?.toLowerCase().includes(searchString)
        );
    });

    // Get badge style based on user role
    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'manager':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'customer':
            default:
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage user accounts and permissions</p>
                </div>
                <button
                    onClick={handleAddUser}
                    className="btn btn-primary inline-flex items-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add User
                </button>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users list */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.name || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeStyle(user.role)}`}>
                                                {user.role || 'customer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentUser ? 'Edit User' : 'Add User'}
                footer={
                    <>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveUser}
                        >
                            {currentUser ? 'Update' : 'Save'}
                        </button>
                    </>
                }
            >
                <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="form-label">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="form-input"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="customer">Customer</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete User"
                footer={
                    <>
                        <button
                            className="btn-modal-secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-modal-danger"
                            onClick={handleDeleteUser}
                        >
                            Delete
                        </button>
                    </>
                }
            >
                <div className="py-2">
                    <div className="flex items-center justify-center mb-4 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
                        Are you sure you want to delete <span className="font-semibold">{currentUser?.name || 'this user'}</span>?
                    </p>
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default Users; 