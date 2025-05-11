import { useState, useEffect } from 'react';
import { AnimatedGradientText } from '../components/ui/animated-gradient-text';
import { MagicCard } from '../components/ui/magic-card';
import { ShimmerButton } from '../components/ui/shimmer-button';
import ProductCarousel from '../components/products/ProductCarousel';

// Mock luxury watch data - moved outside component to prevent recreation on every render
const mockWatches = [
    {
        id: 1,
        name: "Audemars Piguet Royal Oak",
        brand: "Audemars Piguet",
        price: 32500,
        description: "Iconic luxury sports watch with the distinctive octagonal bezel and tapisserie dial pattern.",
        imageUrl: "https://cdn.pixabay.com/photo/2022/05/23/17/34/watch-7217151_1280.jpg",
        category: "luxury"
    },
    {
        id: 2,
        name: "Patek Philippe Calatrava",
        brand: "Patek Philippe",
        price: 27850,
        description: "Elegant dress watch representing timeless design and horological excellence.",
        imageUrl: "https://cdn.pixabay.com/photo/2022/01/18/08/12/watch-6946807_1280.jpg",
        category: "classic"
    },
    {
        id: 3,
        name: "Rolex Daytona",
        brand: "Rolex",
        price: 18950,
        description: "Legendary chronograph developed for professional racing drivers.",
        imageUrl: "https://cdn.pixabay.com/photo/2022/05/15/11/48/watch-7198277_1280.jpg",
        category: "sport"
    },
    {
        id: 4,
        name: "Vacheron Constantin Patrimony",
        brand: "Vacheron Constantin",
        price: 29700,
        description: "Timepiece that exemplifies horological tradition with a contemporary sensibility.",
        imageUrl: "https://cdn.pixabay.com/photo/2018/01/07/17/12/luxury-3067421_1280.jpg",
        category: "luxury"
    },
    {
        id: 5,
        name: "Omega Speedmaster Professional",
        brand: "Omega",
        price: 6950,
        description: "The first watch worn on the moon, featuring a chronograph with tachymeter scale.",
        imageUrl: "https://cdn.pixabay.com/photo/2018/02/24/20/39/clock-3179167_1280.jpg",
        category: "sport"
    }
];

// Categories for filtering - moved outside component to prevent recreation on every render
const categories = [
    { id: 'all', name: 'All Watches' },
    { id: 'luxury', name: 'Luxury Collection' },
    { id: 'sport', name: 'Sport Watches' },
    { id: 'classic', name: 'Classic Timepieces' }
];

/**
 * ProductShowcase - A luxury display page featuring a carousel of premium watches
 */
const ProductShowcase = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        // Simulate API call with mockWatches
        const loadProducts = async () => {
            setLoading(true);

            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (selectedCategory === 'all') {
                setProducts(mockWatches);
            } else {
                setProducts(mockWatches.filter(watch => watch.category === selectedCategory));
            }

            setLoading(false);
        };

        loadProducts();
    }, [selectedCategory]); // Removed mockWatches from dependency array since it's now constant

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12 text-center">
                <AnimatedGradientText className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
                    Exceptional Timepieces
                </AnimatedGradientText>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Discover our curated collection of the world's finest watches, each representing the pinnacle of craftsmanship and design.
                </p>
            </div>

            {/* Category selector */}
            <div className="flex justify-center gap-2 mb-12 flex-wrap">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${selectedCategory === category.id
                            ? 'bg-gold text-white font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Product Carousel */}
            <MagicCard className="mb-16 max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-[500px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold"></div>
                    </div>
                ) : products.length > 0 ? (
                    <ProductCarousel products={products} />
                ) : (
                    <div className="flex justify-center items-center h-[500px]">
                        <p className="text-gray-500">No watches found in this category</p>
                    </div>
                )}
            </MagicCard>

            {/* CTA Section */}
            <div className="text-center mt-12">
                <h3 className="text-2xl font-serif mb-6">Experience Horlogerie Prestige</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Our collection represents the finest selection of timepieces from the world's most prestigious watchmakers.
                </p>

                <div className="flex justify-center gap-4 flex-wrap">
                    <ShimmerButton
                        className="font-serif"
                        shimmerColor="rgba(212, 175, 55, 0.4)"
                    >
                        Browse Collection
                    </ShimmerButton>

                    <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Book Private Viewing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductShowcase; 