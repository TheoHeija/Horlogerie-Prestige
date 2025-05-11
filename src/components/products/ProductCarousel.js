import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ShimmerButton } from '../ui/shimmer-button';

/**
 * ProductCarousel component - Displays watches in a luxury carousel interface
 * with animated transitions and shine effects
 */
const ProductCarousel = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const carouselRef = useRef(null);
    const productRefs = useRef([]);

    useEffect(() => {
        // Initialize refs array based on products length
        productRefs.current = productRefs.current.slice(0, products.length);
    }, [products]);

    // Get previous and next indices with circular navigation
    const getPrevIndex = useCallback((index) => {
        return index === 0 ? products.length - 1 : index - 1;
    }, [products.length]);

    const getNextIndex = useCallback((index) => {
        return index === products.length - 1 ? 0 : index + 1;
    }, [products.length]);

    // Handle slide transition
    const slideToIndex = useCallback((index) => {
        if (isAnimating) return;

        setIsAnimating(true);
        setCurrentIndex(index);

        // Release animation lock after transition completes
        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    }, [isAnimating]);

    // Navigate to previous slide
    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        slideToIndex(getPrevIndex(currentIndex));
    }, [isAnimating, currentIndex, slideToIndex, getPrevIndex]);

    // Navigate to next slide
    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        slideToIndex(getNextIndex(currentIndex));
    }, [isAnimating, currentIndex, slideToIndex, getNextIndex]);

    // Auto-advance carousel
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, 6000);

        return () => clearInterval(interval);
    }, [nextSlide, isAnimating]);

    if (!products || products.length === 0) {
        return <div className="text-center p-10">No products available</div>;
    }

    const prevIndex = getPrevIndex(currentIndex);
    const nextIndex = getNextIndex(currentIndex);

    return (
        <div
            ref={carouselRef}
            className="relative overflow-hidden h-[500px] rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl"
        >
            {/* Left (previous) watch preview */}
            <div
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-1/4 opacity-50 transition-all duration-500 hover:opacity-70 filter blur-[1px] saturate-50 cursor-pointer"
                onClick={prevSlide}
            >
                <div
                    ref={el => productRefs.current[prevIndex] = el}
                    className="transition-all duration-500 transform scale-90 hover:scale-95"
                >
                    <img
                        src={products[prevIndex].imageUrl}
                        alt={products[prevIndex].name}
                        className="w-full object-contain max-h-[300px]"
                    />
                </div>
            </div>

            {/* Main (current) watch */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-1/2 text-center">
                <div className="flex flex-col items-center">
                    <div
                        className="relative mb-6 transition-all duration-500 transform hover:scale-105"
                    >
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine-left-right pointer-events-none" />

                        {/* Soft glow under the watch */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-6 bg-gold/30 filter blur-xl rounded-full"></div>

                        <img
                            src={products[currentIndex].imageUrl}
                            alt={products[currentIndex].name}
                            className="w-full object-contain max-h-[320px] drop-shadow-2xl"
                        />
                    </div>

                    <div className="text-white space-y-2 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/5">
                        <h3 className="text-2xl font-serif">{products[currentIndex].name}</h3>
                        <p className="text-gray-300 text-sm">{products[currentIndex].brand}</p>
                        <p className="text-gold font-bold text-xl">${products[currentIndex].price.toLocaleString()}</p>

                        <div className="flex justify-center space-x-2 mt-4">
                            <ShimmerButton
                                className="bg-gold text-black font-medium"
                                shimmerColor="rgba(255, 255, 255, 0.4)"
                            >
                                View Details
                            </ShimmerButton>
                            <button
                                className="px-6 py-3 border border-white/30 text-white rounded hover:bg-white/10 transition-colors duration-300"
                            >
                                Quick Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right (next) watch preview */}
            <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-1/4 opacity-50 transition-all duration-500 hover:opacity-70 filter blur-[1px] saturate-50 cursor-pointer"
                onClick={nextSlide}
            >
                <div
                    ref={el => productRefs.current[nextIndex] = el}
                    className="transition-all duration-500 transform scale-90 hover:scale-95"
                >
                    <img
                        src={products[nextIndex].imageUrl}
                        alt={products[nextIndex].name}
                        className="w-full object-contain max-h-[300px]"
                    />
                </div>
            </div>

            {/* Navigation controls */}
            <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors duration-300"
                aria-label="Previous"
            >
                <ChevronLeftIcon className="h-8 w-8" />
            </button>

            <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors duration-300"
                aria-label="Next"
            >
                <ChevronRightIcon className="h-8 w-8" />
            </button>

            {/* Progress indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => slideToIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-gold w-8' : 'bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel; 