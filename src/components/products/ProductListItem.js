import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/helpers';
import { findWatchImage } from '../../utils/watch-images';

/**
 * ProductListItem - A component for displaying product information in list view
 * 
 * @param {Object} props
 * @param {Object} props.product - The product data to display
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.isLowInventory - Function to check if inventory is low
 */
const ProductListItem = ({
    product,
    onEdit,
    onDelete,
    isLowInventory
}) => {
    return (
        <div className="product-card list-view-item bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex transition-all duration-300 hover:shadow-lg">
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 mr-4 overflow-hidden rounded-lg">
                <img
                    src={findWatchImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
                    </div>

                    {isLowInventory(product) && (
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Low Stock
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                    </p>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(product)}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100"
                            aria-label="Edit product"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => onDelete(product.id)}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100"
                            aria-label="Delete product"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListItem; 