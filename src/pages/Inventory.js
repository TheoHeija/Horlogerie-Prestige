import { useState, useEffect } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ArrowDownIcon,
    ArrowUpIcon
} from '@heroicons/react/24/outline';
import { AnimatedGradientText } from '../components/ui/animated-gradient-text';
import { MagicCard } from '../components/ui/magic-card';
import Modal from '../components/layout/Modal';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Modal states
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            const mockInventory = [
                {
                    id: 1,
                    name: "Rolex Submariner",
                    sku: "ROL-SUB-0001",
                    stock: 3,
                    threshold: 5,
                    price: 8500,
                    lastRestocked: "2023-03-15",
                    location: "Main Vault",
                    status: "low"
                },
                {
                    id: 2,
                    name: "Omega Speedmaster Professional",
                    sku: "OMG-SPD-0001",
                    stock: 7,
                    threshold: 5,
                    price: 5200,
                    lastRestocked: "2023-04-20",
                    location: "Main Vault",
                    status: "ok"
                },
                {
                    id: 3,
                    name: "Patek Philippe Nautilus",
                    sku: "PAT-NAU-0001",
                    stock: 1,
                    threshold: 3,
                    price: 35000,
                    lastRestocked: "2023-01-05",
                    location: "High Security Vault",
                    status: "critical"
                },
                {
                    id: 4,
                    name: "Audemars Piguet Royal Oak",
                    sku: "AUD-ROY-0001",
                    stock: 2,
                    threshold: 3,
                    price: 29500,
                    lastRestocked: "2023-02-12",
                    location: "High Security Vault",
                    status: "low"
                },
                {
                    id: 5,
                    name: "Jaeger-LeCoultre Reverso",
                    sku: "JAE-REV-0001",
                    stock: 4,
                    threshold: 4,
                    price: 8200,
                    lastRestocked: "2023-05-01",
                    location: "Main Vault",
                    status: "ok"
                },
                {
                    id: 6,
                    name: "Grand Seiko Snowflake",
                    sku: "GS-SNF-0001",
                    stock: 9,
                    threshold: 5,
                    price: 5600,
                    lastRestocked: "2023-05-15",
                    location: "Main Display",
                    status: "ok"
                },
                {
                    id: 7,
                    name: "Cartier Santos",
                    sku: "CAR-SAN-0001",
                    stock: 0,
                    threshold: 3,
                    price: 6800,
                    lastRestocked: "2023-01-20",
                    location: "On Order",
                    status: "out"
                },
                {
                    id: 8,
                    name: "IWC Portugieser",
                    sku: "IWC-POR-0001",
                    stock: 5,
                    threshold: 4,
                    price: 7400,
                    lastRestocked: "2023-04-05",
                    location: "Main Vault",
                    status: "ok"
                }
            ];

            setInventory(mockInventory);
            setLoading(false);
            setTimeout(() => setContentLoaded(true), 100);
        }, 1000);
    }, []);

    const getSortedInventory = () => {
        return [...inventory]
            .filter(item => {
                const query = searchQuery.toLowerCase();
                return (
                    item.name.toLowerCase().includes(query) ||
                    item.sku.toLowerCase().includes(query) ||
                    item.location.toLowerCase().includes(query)
                );
            })
            .sort((a, b) => {
                if (sortField === 'stock' || sortField === 'price') {
                    return sortDirection === 'asc'
                        ? a[sortField] - b[sortField]
                        : b[sortField] - a[sortField];
                } else {
                    return sortDirection === 'asc'
                        ? a[sortField].localeCompare(b[sortField])
                        : b[sortField].localeCompare(a[sortField]);
                }
            });
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ok':
                return 'badge-success';
            case 'low':
                return 'badge-warning';
            case 'critical':
                return 'badge-danger';
            case 'out':
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    };

    const handleRestockModal = (item) => {
        setCurrentItem(item);
        setQuantity(1);
        setIsRestockModalOpen(true);
    };

    const handleRestock = () => {
        // Update inventory
        setInventory(
            inventory.map(item => {
                if (item.id === currentItem.id) {
                    const newStock = item.stock + parseInt(quantity);
                    return {
                        ...item,
                        stock: newStock,
                        lastRestocked: new Date().toISOString().split('T')[0],
                        status: newStock === 0
                            ? 'out'
                            : newStock <= item.threshold * 0.33
                                ? 'critical'
                                : newStock < item.threshold
                                    ? 'low'
                                    : 'ok'
                    };
                }
                return item;
            })
        );
        setIsRestockModalOpen(false);
    };

    const lowStockCount = inventory.filter(item =>
        item.status === 'low' || item.status === 'critical' || item.status === 'out'
    ).length;

    const totalValue = inventory.reduce((total, item) => total + (item.price * item.stock), 0);

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
                            Inventory Management
                        </AnimatedGradientText>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track and manage your luxury watch inventory
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
                            placeholder="Search inventory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary">
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Add Stock
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Inventory Value</h3>
                        <p className="mt-1 text-3xl font-bold">${loading ? '...' : totalValue.toLocaleString()}</p>
                        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-500">
                            <span>+8% from last month</span>
                        </div>
                    </div>
                </MagicCard>

                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Alerts</h3>
                        <p className="mt-1 text-3xl font-bold">{loading ? '...' : lowStockCount}</p>
                        <div className="mt-4 flex items-center text-sm text-amber-600 dark:text-amber-500">
                            <span>Items requiring attention</span>
                        </div>
                    </div>
                </MagicCard>

                <MagicCard className={`transition-all duration-300 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Item Value</h3>
                        <p className="mt-1 text-3xl font-bold">
                            {loading
                                ? '...'
                                : `$${Math.round(totalValue / inventory.filter(i => i.stock > 0).length).toLocaleString()}`
                            }
                        </p>
                        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-500">
                            <span>+12% year over year</span>
                        </div>
                    </div>
                </MagicCard>
            </div>

            {/* Inventory Table */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Inventory Status</h2>
                    <div className="flex items-center space-x-2">
                        <button className="btn btn-sm btn-secondary">Export</button>
                        <button className="btn btn-sm btn-primary">Stock Report</button>
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
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Product
                                            {sortField === 'name' && (
                                                sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        SKU
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('stock')}
                                    >
                                        <div className="flex items-center">
                                            Stock Level
                                            {sortField === 'stock' && (
                                                sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('price')}
                                    >
                                        <div className="flex items-center">
                                            Price
                                            {sortField === 'price' && (
                                                sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Last Restocked
                                    </th>
                                    <th className="px-4 py-3 relative"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {getSortedInventory().length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No inventory items found
                                        </td>
                                    </tr>
                                ) : (
                                    getSortedInventory().map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${contentLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}
                                            style={{ animationDelay: `${item.id * 50}ms` }}
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {item.sku}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${item.status === 'ok'
                                                            ? 'bg-green-500'
                                                            : item.status === 'low'
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                        }`}></span>
                                                    <span className="text-sm font-medium">
                                                        {item.stock}
                                                    </span>
                                                    {item.status !== 'ok' && (
                                                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 ml-2" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`badge ${getStatusBadge(item.status)}`}>
                                                    {item.status === 'ok'
                                                        ? 'In Stock'
                                                        : item.status === 'low'
                                                            ? 'Low Stock'
                                                            : item.status === 'critical'
                                                                ? 'Critical'
                                                                : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                ${item.price.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {item.location}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.lastRestocked).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleRestockModal(item)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <ArrowPathIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Restock Modal */}
            <Modal
                isOpen={isRestockModalOpen}
                onClose={() => setIsRestockModalOpen(false)}
                title="Restock Inventory"
                size="md"
                footer={
                    <>
                        <button
                            onClick={() => setIsRestockModalOpen(false)}
                            className="btn-modal-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRestock}
                            className="btn-modal-primary"
                        >
                            Confirm Restock
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {currentItem?.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Current stock: <span className="font-medium">{currentItem?.stock}</span>
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity" className="form-label">
                            Quantity to Add
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes" className="form-label">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            className="form-input"
                            rows="3"
                            placeholder="Add any notes about this restock"
                        ></textarea>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Inventory; 