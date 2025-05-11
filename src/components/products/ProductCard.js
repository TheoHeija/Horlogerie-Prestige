import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MagicCard } from '../ui/magic-card';
import { ShimmerButton } from '../ui/shimmer-button';
import { formatCurrency } from '../../utils/helpers';
import { findWatchImage } from '../../utils/watch-images';

/**
 * ProductCard - A component for displaying product information in grid view
 * 
 * @param {Object} props
 * @param {Object} props.product - The product data to display
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.isLowInventory - Function to check if inventory is low
 */
const ProductCard = ({
    product,
    onEdit,
    onDelete,
    isLowInventory
}) => {
    return (
        <div className="product-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
            <MagicCard className="h-full">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                    <img
                        src={findWatchImage(product)}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                    {isLowInventory(product) && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Low Stock
                        </div>
                    )}
                </div>
                <div className="flex flex-col h-full">
                    <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">{product.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>
                    <p className="flex-grow text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(product.price)}
                        </p>
                        <div className="flex space-x-2">
                            <ShimmerButton
                                onClick={() => onEdit(product)}
                                aria-label="Edit product"
                                className="p-2 text-blue-600 hover:bg-blue-100"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </ShimmerButton>
                            <ShimmerButton
                                onClick={() => onDelete(product.id)}
                                aria-label="Delete product"
                                className="p-2 text-red-600 hover:bg-red-100"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </ShimmerButton>
                        </div>
                    </div>
                </div>
            </MagicCard>
        </div>
    );
};

export default ProductCard; 