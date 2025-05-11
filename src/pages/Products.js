import { useState, useEffect, useCallback } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    Squares2X2Icon,
    ListBulletIcon,
    FunnelIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../utils/supabase';
import Modal from '../components/layout/Modal';
import ProductCard from '../components/products/ProductCard';
import ProductListItem from '../components/products/ProductListItem';
import toast from 'react-hot-toast';

/**
 * Products component - Page for managing products
 * Lists all products and provides functionality to add/edit/delete products
 */
const Products = () => {
    // Main data states
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI state
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        brand: '',
        movementType: '',
        caseMaterial: '',
        waterResistance: ''
    });
    const [activeFilters, setActiveFilters] = useState([]);

    // Form state - Single declaration
    const initialFormState = {
        name: '',
        description: '',
        price: '',
        inventory_count: '',
        image_url: '',
        brand: '',
        movement_type: '',
        case_material: '',
        water_resistance: '',
        complications: '',
        diameter: '',
        reference_number: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    // Filter options
    // Only defining the options that are actually used in the selects
    const [movementOptions, setMovementOptions] = useState([]);
    const [materialOptions, setMaterialOptions] = useState([]);
    const [waterResistanceOptions, setWaterResistanceOptions] = useState([]);

    // Load products data
    useEffect(() => {
        // Fetch products directly without setup steps
        // since our mock system is now always ready
        fetchProducts();
    }, []);

    // Fetch products from Supabase
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await getProducts();
            if (error) throw error;

            // Log data for debugging
            console.log('Received products data:', data);

            if (data && data.length > 0) {
                setProducts(data || []);

                // Define standard options for filters
                const standardMovements = ['Automatic', 'Manual', 'Quartz', 'Spring Drive', 'Tourbillon', 'Co-Axial', 'Chronograph'];
                const standardMaterials = ['Stainless Steel', 'Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Titanium', 'Ceramic', 'Carbon Fiber'];
                const standardWaterResistance = ['30m', '50m', '100m', '200m', '300m', '1000m'];

                // Extract unique filter options and combine with standard options
                const extractedBrands = [...new Set(data.map(item => item.brand).filter(Boolean))];
                const extractedMovements = [...new Set(data.map(item => item.movement_type).filter(Boolean))];
                const extractedMaterials = [...new Set(data.map(item => item.case_material).filter(Boolean))];
                const extractedWaterResistances = [...new Set(data.map(item => item.water_resistance).filter(Boolean))];

                // Combine and deduplicate
                const brands = [...new Set([...extractedBrands])].sort();
                const movements = [...new Set([...extractedMovements, ...standardMovements])].sort();
                const materials = [...new Set([...extractedMaterials, ...standardMaterials])].sort();
                const waterResistances = [...new Set([...extractedWaterResistances, ...standardWaterResistance])].sort();

                console.log('Filter options extracted:', { brands, movements, materials, waterResistances });

                setMovementOptions(movements);
                setMaterialOptions(materials);
                setWaterResistanceOptions(waterResistances);
            }
        } catch (error) {
            console.error('Error fetching products:', error.message);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'price' || name === 'inventory_count'
            ? value === '' ? '' : parseFloat(value)
            : value;

        setFormData({
            ...formData,
            [name]: parsedValue,
        });
    };

    // Open modal for adding a new product
    const handleAddProduct = () => {
        setCurrentProduct(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    // Open modal for editing an existing product
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            inventory_count: product.inventory_count?.toString() || '',
            image_url: product.image_url || '',
            brand: product.brand || '',
            movement_type: product.movement_type || '',
            case_material: product.case_material || '',
            water_resistance: product.water_resistance || '',
            complications: product.complications || '',
            diameter: product.diameter || '',
            reference_number: product.reference_number || '',
        });
        setIsModalOpen(true);
    };

    // Open confirmation modal for deleting a product
    const handleDeleteClick = (product) => {
        setCurrentProduct(product);
        setIsDeleteModalOpen(true);
    };

    // Save product (create or update)
    const handleSave = async () => {
        try {
            // Validate form data
            if (!formData.name || !formData.price) {
                toast.error('Name and price are required');
                return;
            }

            if (currentProduct) {
                // Update existing product
                const { error } = await updateProduct(currentProduct.id, formData);
                if (error) throw error;
                toast.success('Product updated successfully');
            } else {
                // Create new product
                const { error } = await createProduct(formData);
                if (error) throw error;
                toast.success('Product created successfully');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error.message);
            toast.error(error.message || 'Failed to save product');
        }
    };

    // Delete product
    const handleDelete = async () => {
        try {
            if (!currentProduct) return;

            const { error } = await deleteProduct(currentProduct.id);
            if (error) throw error;

            toast.success('Product deleted successfully');
            setIsDeleteModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error.message);
            toast.error(error.message || 'Failed to delete product');
        }
    };

    // Filter products based on search term and filters
    const getFilteredProducts = useCallback(() => {
        return products.filter((product) => {
            const searchString = searchQuery.toLowerCase();
            const matchesSearch = (
                product.name?.toLowerCase().includes(searchString) ||
                product.description?.toLowerCase().includes(searchString) ||
                product.brand?.toLowerCase().includes(searchString) ||
                product.reference_number?.toLowerCase().includes(searchString)
            );

            // Check if product matches all active filters
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (!value || value === '') return true;

                switch (key) {
                    case 'minPrice':
                        return parseFloat(product.price) >= parseFloat(value);
                    case 'maxPrice':
                        return parseFloat(product.price) <= parseFloat(value);
                    case 'brand':
                        return product.brand === value;
                    case 'movementType':
                        return product.movement_type === value;
                    case 'caseMaterial':
                        return product.case_material === value;
                    case 'waterResistance':
                        return product.water_resistance === value;
                    default:
                        return true;
                }
            });

            return matchesSearch && matchesFilters;
        });
    }, [products, searchQuery, filters]);

    // Get filtered products
    const filteredProducts = getFilteredProducts();

    // Check if inventory is low (less than 5 items)
    const isLowInventory = (count) => {
        return count !== null && count !== undefined && count < 5;
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Apply filters
    const applyFilters = () => {
        // Create an array of active filters for easier handling
        const newActiveFilters = Object.entries(filters)
            .filter(([_, value]) => value !== '')
            .map(([key, value]) => [key, value]);

        setActiveFilters(newActiveFilters);
        setIsFilterModalOpen(false);
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            brand: '',
            movementType: '',
            caseMaterial: '',
            waterResistance: ''
        });
        setActiveFilters([]);
        setIsFilterModalOpen(false);
    };

    // Remove a single filter
    const removeFilter = (filterKey) => {
        setFilters(prev => ({ ...prev, [filterKey]: '' }));

        const newActiveFilters = activeFilters.filter(([key]) => key !== filterKey);
        setActiveFilters(newActiveFilters);
    };

    const gridContainerClassName = viewMode === 'grid'
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        : "space-y-4";

    // Define a common form input class with increased padding
    const formInputClass = "form-input py-3 px-4 bg-white dark:bg-gray-700";
    const searchInputClass = "form-input pl-10 py-3 px-4 w-full bg-white dark:bg-gray-700";
    const formGroupClass = "form-group mb-4";
    const formLabelClass = "form-label mb-2";

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage products and inventory</p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="btn btn-primary inline-flex items-center px-5 py-2.5"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Product
                </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className={searchInputClass}
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter button */}
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className={`btn ${activeFilters.length > 0 ? 'btn-secondary' : 'btn-outline'} inline-flex items-center`}
                >
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    {activeFilters.length > 0 ? `Filters (${activeFilters.length})` : 'Filter'}
                </button>

                {/* View toggle */}
                <div className="view-toggle">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`view-toggle-button rounded-l-md ${viewMode === 'grid' ? 'active' : ''}`}
                        title="Grid view"
                    >
                        <Squares2X2Icon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`view-toggle-button rounded-r-md ${viewMode === 'list' ? 'active' : ''}`}
                        title="List view"
                    >
                        <ListBulletIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Active filters display */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                    {activeFilters.map(([key, value]) => {
                        if (!value) return null;

                        let label = '';
                        switch (key) {
                            case 'minPrice':
                                label = `Min Price: $${value}`;
                                break;
                            case 'maxPrice':
                                label = `Max Price: $${value}`;
                                break;
                            case 'brand':
                                label = `Brand: ${value}`;
                                break;
                            case 'movementType':
                                label = `Movement: ${value}`;
                                break;
                            case 'caseMaterial':
                                label = `Material: ${value}`;
                                break;
                            case 'waterResistance':
                                label = `Water Resistance: ${value}`;
                                break;
                            default:
                                label = `${key}: ${value}`;
                        }

                        return (
                            <div key={key} className="filter-tag">
                                {label}
                                <button
                                    onClick={() => removeFilter(key)}
                                    className="ml-1.5 text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200"
                                >
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        );
                    })}
                    <button
                        onClick={resetFilters}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 ml-2"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Product Display */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No products found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filter criteria.</p>
                    {activeFilters.length > 0 && (
                        <button
                            className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
                            onClick={() => {
                                setFilters({
                                    minPrice: '',
                                    maxPrice: '',
                                    brand: '',
                                    movementType: '',
                                    caseMaterial: '',
                                    waterResistance: ''
                                });
                                setActiveFilters([]);
                            }}
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        // Grid View
                        <div className={gridContainerClassName}>
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteClick}
                                    isLowInventory={isLowInventory}
                                />
                            ))}
                        </div>
                    ) : (
                        // List View
                        <div className="space-y-6">
                            {filteredProducts.map((product) => (
                                <ProductListItem
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteClick}
                                    isLowInventory={isLowInventory}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Product Modal */}
            <Modal
                isOpen={isModalOpen}
                title={currentProduct ? 'Edit Product' : 'Add New Product'}
                onClose={() => setIsModalOpen(false)}
                size="2xl"
                footer={
                    <>
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
                            onClick={handleSave}
                        >
                            {currentProduct ? 'Save Changes' : 'Add Product'}
                        </button>
                    </>
                }
            >
                <div className="space-y-8 px-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={formGroupClass}>
                            <label htmlFor="name" className={formLabelClass}>Name <span className="form-required">*</span></label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={formInputClass}
                                placeholder="e.g. Submariner Date"
                                required
                            />
                        </div>
                        <div className={formGroupClass}>
                            <label htmlFor="brand" className={formLabelClass}>Brand <span className="form-required">*</span></label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className={formInputClass}
                                placeholder="e.g. Rolex"
                                required
                            />
                        </div>
                    </div>

                    <div className={formGroupClass}>
                        <label htmlFor="description" className={formLabelClass}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            className={formInputClass}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Luxury sports watch with octagonal bezel..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={formGroupClass}>
                        <label htmlFor="price" className={formLabelClass}>Price ($) <span className="form-required">*</span></label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className={formInputClass}
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="25000"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className={formGroupClass}>
                        <label htmlFor="inventory_count" className={formLabelClass}>Inventory Count</label>
                        <input
                            type="number"
                            id="inventory_count"
                            name="inventory_count"
                            className={formInputClass}
                            value={formData.inventory_count}
                            onChange={handleChange}
                            placeholder="5"
                            min="0"
                            step="1"
                        />
                    </div>
                </div>

                <div className={formGroupClass}>
                    <label htmlFor="reference_number" className={formLabelClass}>Reference Number</label>
                    <input
                        type="text"
                        id="reference_number"
                        name="reference_number"
                        className={formInputClass}
                        value={formData.reference_number}
                        onChange={handleChange}
                        placeholder="15400ST.OO.1220ST.01"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={formGroupClass}>
                        <label htmlFor="diameter" className={formLabelClass}>Diameter (mm)</label>
                        <input
                            type="text"
                            id="diameter"
                            name="diameter"
                            className={formInputClass}
                            value={formData.diameter}
                            onChange={handleChange}
                            placeholder="41"
                        />
                    </div>

                    <div className={formGroupClass}>
                        <label htmlFor="complications" className={formLabelClass}>Complications</label>
                        <input
                            type="text"
                            id="complications"
                            name="complications"
                            className={formInputClass}
                            value={formData.complications}
                            onChange={handleChange}
                            placeholder="Date, Chronograph, Moon Phase"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className={formGroupClass}>
                        <label htmlFor="movement_type" className={formLabelClass}>Movement Type</label>
                        <select
                            id="movement_type"
                            name="movement_type"
                            className={formInputClass}
                            value={formData.movement_type}
                            onChange={handleChange}
                        >
                            <option value="">Select Movement</option>
                            {movementOptions.length > 0 ? (
                                movementOptions.map(movement => (
                                    <option key={movement} value={movement}>{movement}</option>
                                ))
                            ) : (
                                <>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Quartz">Quartz</option>
                                    <option value="Spring Drive">Spring Drive</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Automatic Chronograph">Automatic Chronograph</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className={formGroupClass}>
                        <label htmlFor="case_material" className={formLabelClass}>Case Material</label>
                        <select
                            id="case_material"
                            name="case_material"
                            className={formInputClass}
                            value={formData.case_material}
                            onChange={handleChange}
                        >
                            <option value="">Select Material</option>
                            {materialOptions.length > 0 ? (
                                materialOptions.map(material => (
                                    <option key={material} value={material}>{material}</option>
                                ))
                            ) : (
                                <>
                                    <option value="Stainless Steel">Stainless Steel</option>
                                    <option value="Yellow Gold">Yellow Gold</option>
                                    <option value="White Gold">White Gold</option>
                                    <option value="Rose Gold">Rose Gold</option>
                                    <option value="Platinum">Platinum</option>
                                    <option value="Titanium">Titanium</option>
                                    <option value="Ceramic">Ceramic</option>
                                    <option value="Carbon Fiber">Carbon Fiber</option>
                                    <option value="Two-Tone">Two-Tone</option>
                                    <option value="Bronze">Bronze</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className={formGroupClass}>
                        <label htmlFor="water_resistance" className={formLabelClass}>Water Resistance</label>
                        <select
                            id="water_resistance"
                            name="water_resistance"
                            className={formInputClass}
                            value={formData.water_resistance}
                            onChange={handleChange}
                        >
                            <option value="">Select Water Resistance</option>
                            {waterResistanceOptions.length > 0 ? (
                                waterResistanceOptions.map(resistance => (
                                    <option key={resistance} value={resistance}>{resistance}</option>
                                ))
                            ) : (
                                <>
                                    <option value="30m">30m</option>
                                    <option value="50m">50m</option>
                                    <option value="100m">100m</option>
                                    <option value="200m">200m</option>
                                    <option value="300m">300m</option>
                                    <option value="500m">500m</option>
                                    <option value="1000m">1000m</option>
                                    <option value="Not water resistant">Not water resistant</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div className={formGroupClass}>
                    <label htmlFor="image_url" className={formLabelClass}>Image URL</label>
                    <input
                        type="text"
                        id="image_url"
                        name="image_url"
                        className={formInputClass}
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/watch.jpg"
                    />
                    <p className="form-helper-text">Enter a URL for the watch image (HTTPS recommended)</p>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                title="Confirm Deletion"
                onClose={() => setIsDeleteModalOpen(false)}
                size="md"
                footer={
                    <>
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
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-full w-16 h-16 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>

                    <div className="text-center">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Are you sure you want to delete this product?
                        </h4>

                        {currentProduct && (
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">{currentProduct.brand}</span> {currentProduct.name}
                            </p>
                        )}

                        <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
                            This action cannot be undone. This will permanently delete the product from the database.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Filter Modal */}
            <Modal
                isOpen={isFilterModalOpen}
                title="Filter Products"
                onClose={() => setIsFilterModalOpen(false)}
                size="lg"
                footer={
                    <>
                        <button
                            type="button"
                            className="btn-modal-secondary"
                            onClick={() => {
                                setFilters({
                                    minPrice: '',
                                    maxPrice: '',
                                    brand: '',
                                    movementType: '',
                                    caseMaterial: '',
                                    waterResistance: ''
                                });
                                setActiveFilters([]);
                            }}
                        >
                            Reset Filters
                        </button>
                        <button
                            type="button"
                            className="btn-modal-primary"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Price Range</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className={formGroupClass}>
                                <label htmlFor="minPrice" className={formLabelClass}>Min Price ($)</label>
                                <input
                                    type="number"
                                    id="minPrice"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    className={formInputClass}
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                            <div className={formGroupClass}>
                                <label htmlFor="maxPrice" className={formLabelClass}>Max Price ($)</label>
                                <input
                                    type="number"
                                    id="maxPrice"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    className={formInputClass}
                                    placeholder="No limit"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Brand</h4>
                        <div className={formGroupClass}>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={filters.brand}
                                onChange={handleFilterChange}
                                className={formInputClass}
                                placeholder="Type brand name..."
                            />

                            {/* Quick brand selection buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                                {['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Vacheron Constantin', 'Jaeger-LeCoultre'].map((brand) => (
                                    <button
                                        key={brand}
                                        type="button"
                                        className={`text-xs py-1.5 px-2 rounded-md border transition-colors ${filters.brand === brand
                                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                            }`}
                                        onClick={() => {
                                            setFilters(prev => ({
                                                ...prev,
                                                brand: prev.brand === brand ? '' : brand
                                            }));
                                        }}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Technical Specifications</h4>

                        <div className={formGroupClass}>
                            <label htmlFor="movementType" className={formLabelClass}>Movement Type</label>
                            <select
                                id="movementType"
                                name="movementType"
                                value={filters.movementType}
                                onChange={handleFilterChange}
                                className={formInputClass}
                            >
                                <option value="">Any Movement Type</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                                <option value="Quartz">Quartz</option>
                                <option value="Spring Drive">Spring Drive</option>
                                <option value="Solar">Solar</option>
                                <option value="Kinetic">Kinetic</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className={formGroupClass}>
                            <label htmlFor="caseMaterial" className={formLabelClass}>Case Material</label>
                            <select
                                id="caseMaterial"
                                name="caseMaterial"
                                value={filters.caseMaterial}
                                onChange={handleFilterChange}
                                className={formInputClass}
                            >
                                <option value="">Any Case Material</option>
                                <option value="Stainless Steel">Stainless Steel</option>
                                <option value="Gold">Gold</option>
                                <option value="White Gold">White Gold</option>
                                <option value="Rose Gold">Rose Gold</option>
                                <option value="Yellow Gold">Yellow Gold</option>
                                <option value="Platinum">Platinum</option>
                                <option value="Titanium">Titanium</option>
                                <option value="Ceramic">Ceramic</option>
                                <option value="Carbon Fiber">Carbon Fiber</option>
                                <option value="Bronze">Bronze</option>
                            </select>
                        </div>

                        <div className={formGroupClass}>
                            <label htmlFor="waterResistance" className={formLabelClass}>Water Resistance</label>
                            <select
                                id="waterResistance"
                                name="waterResistance"
                                value={filters.waterResistance}
                                onChange={handleFilterChange}
                                className={formInputClass}
                            >
                                <option value="">Any Water Resistance</option>
                                <option value="30m">30m</option>
                                <option value="50m">50m</option>
                                <option value="100m">100m</option>
                                <option value="200m">200m</option>
                                <option value="300m">300m</option>
                                <option value="500m">500m</option>
                                <option value="1000m">1000m</option>
                                <option value="None">None</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Products; 