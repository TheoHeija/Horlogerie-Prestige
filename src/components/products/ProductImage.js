import { useState } from 'react';

/**
 * ProductImage - A component for displaying product images with error handling
 * 
 * @param {Object} props
 * @param {string} props.src - The image source URL
 * @param {string} props.alt - The image alt text
 * @param {string} props.brand - The product brand (used for fallback)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Image size (small, medium, large)
 * @param {boolean} props.rounded - Whether the image should have rounded corners
 */
const ProductImage = ({
    src,
    alt,
    brand = 'Watch',
    className = '',
    size = 'medium',
    rounded = true
}) => {
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Define size dimensions
    const sizeClasses = {
        small: 'h-24 w-24',
        medium: 'max-h-full max-w-full object-contain',
        large: 'h-64 w-full object-contain',
    };

    // Collection of high-quality fallback images for popular luxury watch brands
    const brandFallbacks = {
        'Rolex': 'https://content.rolex.com/dam/new-watches-2020/homepage/roller/all-watches/watches_0007_m126711chnr-0002-gmt-master-ii_portrait.jpg',
        'Vacheron Constantin': 'https://www.vacheron-constantin.com/dam/rcq/vac/16/19/76/0/1619760.png.transform.vacmobile_1000.png',
        'Jaeger-LeCoultre': 'https://www.jaeger-lecoultre.com/sites/default/files/styles/hero_hd_1366x910_/public/2022-07/Hero-Reverso-Classic-Medium-Small-Second-2438521-front-opened.jpg',
        'Audemars Piguet': 'https://www.audemarspiguet.com/content/dam/ap/com/products/watches/MTR00448/importer/standalones/15202ST.OO.1240ST.01.png',
        'Patek Philippe': 'https://www.patek.com/resources/img/layout/neuheiten_teaser_5711_1300.jpg',
        'Omega': 'https://www.omegawatches.com/media/catalog/product/cache/a5c37fddc1a529a1a44fea55d527b9a116f3738da3a2cc38006fcc613c37c391/o/m/omega-seamaster-diver-300m-21030422001001-l.png',
        'Cartier': 'https://www.cartier.com/dw/image/v2/BGTJ_PRD/on/demandware.static/-/Sites-cartier-master/default/dw0a5ab049/images/large/637775695546909803-2048994.png',
        'Tudor': 'https://www.tudorwatch.com/-/media/tudor/products/black-bay-fifty-eight/family-page/black-bay-fifty-eight-m79030b-0001-family-page.jpg',
        'Breitling': 'https://www.breitling.com/media/image/2/gallery_horizontal_800x600/asset-version-c7c18f8138/ab0148a11l1a1.png',
        'IWC': 'https://www.iwc.com/content/dam/rcq/iwc/19/31/34/5/1931345.png.transform.global_image_png_800_1000.png',
    };

    // Handle image load error
    const handleError = (e) => {
        console.log('Image load error:', e.target.src);
        setImageError(true);
        e.target.onerror = null; // Prevent infinite loop
    };

    // Handle image load success
    const handleLoad = () => {
        setLoading(false);
    };

    // Determine fallback URL
    const getFallbackUrl = () => {
        // First try to find a high-quality image for the brand
        const normalizedBrand = brand ? brand.trim() : '';
        for (const [brandName, url] of Object.entries(brandFallbacks)) {
            if (normalizedBrand.toLowerCase().includes(brandName.toLowerCase())) {
                return url;
            }
        }

        // If no matching brand, use a generic luxury watch placeholder
        const dimensions = size === 'small' ? '150x150' : '300x150';
        return `https://via.placeholder.com/${dimensions}/f3f4f6/334155?text=${brand.replace(/ /g, '+')}`;
    };

    // Determine correct image source
    const imageSource = imageError ? getFallbackUrl() : (src || getFallbackUrl());

    // Combine class names
    const imageClasses = `transition-transform duration-300 ${sizeClasses[size] || sizeClasses.medium
        } ${rounded ? 'rounded-md' : ''} ${className}`;

    return (
        <div className="relative">
            {/* Loading state */}
            {loading && (
                <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse ${rounded ? 'rounded-md' : ''}`}>
                    <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}

            {/* Image */}
            <img
                src={imageSource}
                alt={alt}
                className={imageClasses}
                onError={handleError}
                onLoad={handleLoad}
                loading="lazy"
            />
        </div>
    );
};

export default ProductImage;