import { useState, useEffect } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { AnimatedGradientText } from '../components/ui/animated-gradient-text';
import { MagicCard } from '../components/ui/magic-card';
import { ShinyButton } from '../components/ui/shiny-button';
import Modal from '../components/layout/Modal';

/**
 * Categories component - Page for managing watch categories
 */
const Categories = () => {
    // Main data states
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contentLoaded, setContentLoaded] = useState(false);

    // UI state
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    // Form state
    const initialFormState = {
        name: '',
        description: '',
        slug: '',
        image_url: '',
        featured: false,
        products_count: 0,
        parent_id: null
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        // Simulating data fetch
        setTimeout(() => {
            const mockCategories = [
                {
                    id: 1,
                    name: 'Dress Watches',
                    slug: 'dress-watches',
                    description: 'Elegant timepieces designed for formal occasions',
                    image_url: '/images/categories/dress-watches.jpg',
                    products_count: 24,
                    featured: true,
                    parent_id: null
                },
                {
                    id: 2,
                    name: 'Dive Watches',
                    slug: 'dive-watches',
                    description: 'Water-resistant watches made for underwater activities',
                    image_url: '/images/categories/dive-watches.jpg',
                    products_count: 18,
                    featured: true,
                    parent_id: null
                },
                {
                    id: 3,
                    name: 'Chronographs',
                    slug: 'chronographs',
                    description: 'Watches with stopwatch functionality',
                    image_url: '/images/categories/chronographs.jpg',
                    products_count: 30,
                    featured: true,
                    parent_id: null
                },
                {
                    id: 4,
                    name: 'Pilot Watches',
                    slug: 'pilot-watches',
                    description: 'Watches designed for aviators with special features',
                    image_url: '/images/categories/pilot-watches.jpg',
                    products_count: 15,
                    featured: false,
                    parent_id: null
                },
                {
                    id: 5,
                    name: 'Field Watches',
                    slug: 'field-watches',
                    description: 'Rugged, military-inspired timepieces',
                    image_url: '/images/categories/field-watches.jpg',
                    products_count: 12,
                    featured: false,
                    parent_id: null
                },
                {
                    id: 6,
                    name: 'Luxury Sport Watches',
                    slug: 'luxury-sport-watches',
                    description: 'High-end sport watches combining elegance and functionality',
                    image_url: '/images/categories/luxury-sport-watches.jpg',
                    products_count: 22,
                    featured: true,
                    parent_id: null
                },
                {
                    id: 7,
                    name: 'Limited Editions',
                    slug: 'limited-editions',
                    description: 'Special release timepieces with limited production',
                    image_url: '/images/categories/limited-editions.jpg',
                    products_count: 8,
                    featured: true,
                    parent_id: null
                },
                {
                    id: 8,
                    name: 'Vintage Collection',
                    slug: 'vintage-collection',
                    description: 'Classic designs inspired by historical timepieces',
                    image_url: '/images/categories/vintage-collection.jpg',
                    products_count: 14,
                    featured: false,
                    parent_id: null
                },
            ];

            setCategories(mockCategories);
            setLoading(false);
            setTimeout(() => setContentLoaded(true), 100);
        }, 1000);
    }, []);

    const filteredCategories = categories.filter(category => {
        const query = searchQuery.toLowerCase();
        return (
            category.name.toLowerCase().includes(query) ||
            category.description.toLowerCase().includes(query) ||
            category.slug.toLowerCase().includes(query)
        );
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddCategory = () => {
        setCurrentCategory(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setCurrentCategory(category);
        setFormData({
            name: category.name || '',
            description: category.description || '',
            slug: category.slug || '',
            image_url: category.image_url || '',
            featured: category.featured || false,
            parent_id: category.parent_id || null
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (category) => {
        setCurrentCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleSave = () => {
        // In a real app, this would be an API call
        if (currentCategory) {
            // Update existing category
            setCategories(
                categories.map(cat =>
                    cat.id === currentCategory.id
                        ? { ...cat, ...formData, products_count: cat.products_count }
                        : cat
                )
            );
        } else {
            // Create new category
            const newCategory = {
                ...formData,
                id: Math.max(...categories.map(c => c.id)) + 1,
                products_count: 0
            };
            setCategories([...categories, newCategory]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        // In a real app, this would be an API call
        setCategories(categories.filter(cat => cat.id !== currentCategory.id));
        setIsDeleteModalOpen(false);
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
                            Category Management
                        </AnimatedGradientText>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Organize your luxury timepieces into collections
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
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <ShinyButton onClick={handleAddCategory} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Add Category
                    </ShinyButton>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Categories</h3>
                        <p className="mt-1 text-3xl font-bold">{loading ? '...' : categories.length}</p>
                        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-500">
                            <span>+3 from last month</span>
                        </div>
                    </div>
                </MagicCard>

                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Featured Categories</h3>
                        <p className="mt-1 text-3xl font-bold">{loading ? '...' : categories.filter(c => c.featured).length}</p>
                        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-500">
                            <span>+2 from last quarter</span>
                        </div>
                    </div>
                </MagicCard>

                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Products Per Category</h3>
                        <p className="mt-1 text-3xl font-bold">
                            {loading
                                ? '...'
                                : Math.round(categories.reduce((acc, curr) => acc + curr.products_count, 0) / categories.length)
                            }
                        </p>
                        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-500">
                            <span>+5 year over year</span>
                        </div>
                    </div>
                </MagicCard>
            </div>

            {/* Category Table */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Category Directory</h2>
                    <div className="flex items-center space-x-2">
                        <button className="btn btn-sm btn-secondary">Export</button>
                        <button className="btn btn-sm btn-primary">Bulk Edit</button>
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 relative"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No categories found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <tr
                                            key={category.id}
                                            className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${contentLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}
                                            style={{ animationDelay: `${category.id * 50}ms` }}
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                                                            {category.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{category.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {category.description.length > 60
                                                    ? category.description.substring(0, 60) + '...'
                                                    : category.description}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                {category.products_count}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`badge ${category.featured ? 'badge-luxury' : 'badge-secondary'}`}>
                                                    {category.featured ? 'Featured' : 'Standard'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={() => handleEditCategory(category)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(category)}
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

            {/* Add/Edit Category Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentCategory ? `Edit Category: ${currentCategory.name}` : 'Add New Category'}
                size="lg"
                footer={
                    <>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="btn-modal-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-modal-primary"
                        >
                            {currentCategory ? 'Update Category' : 'Create Category'}
                        </button>
                    </>
                }
            >
                <div className="modal-form-grid">
                    <div className="modal-form-field">
                        <label htmlFor="name" className="form-label">
                            Category Name <span className="form-required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="modal-form-field">
                        <label htmlFor="slug" className="form-label">
                            Slug <span className="form-required">*</span>
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                        <p className="form-helper-text">URL-friendly version of the name</p>
                    </div>

                    <div className="modal-form-field modal-form-field-full">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-input"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="modal-form-field">
                        <label htmlFor="image_url" className="form-label">
                            Image URL
                        </label>
                        <input
                            type="text"
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="modal-form-field">
                        <div className="flex items-center h-full mt-8">
                            <input
                                type="checkbox"
                                id="featured"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-5 w-5"
                            />
                            <label htmlFor="featured" className="ml-2 form-label mb-0">
                                Featured Category
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Category"
                size="sm"
                footer={
                    <>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="btn-modal-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn-modal-danger"
                        >
                            Delete
                        </button>
                    </>
                }
            >
                <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete the category <span className="font-medium">{currentCategory?.name}</span>?
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                    This action will remove the category and can affect products that are associated with it.
                </p>
            </Modal>
        </div>
    );
};

export default Categories; 