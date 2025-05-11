# High-Quality Watch Images

## Overview
Horlogerie Prestige now includes a collection of high-quality watch images from official brand websites. This improves the visual appeal of the product listings and provides customers with a better shopping experience.

## Key Features

1. **Brand-Specific Images:** We've organized images by brand and model, making it easy to find the right image for each watch.

2. **Fallback Mechanism:** If a specific model doesn't have an image, the system will:
   - Use the product's own image_url if available
   - Find a similar model from the same brand
   - Use a placeholder watch image as a last resort

3. **SVG Placeholder:** We've created a custom SVG placeholder for watches that shows when no specific image is available.

## Implementation Details

### Image Structure
Images are organized in the `src/utils/watch-images.js` file and structured by brand and model:

```javascript
const watchImages = {
    "brand-name": [
        {
            id: "model-id",
            name: "Model Name",
            brand: "Brand Name",
            images: [
                "https://url-to-primary-image.jpg",
                "https://url-to-secondary-image.jpg"
            ]
        },
        // More models...
    ],
    // More brands...
};
```

### Helper Function
The `findWatchImage` function handles finding the best matching image for a watch:

```javascript
// Usage example
import { findWatchImage } from '../../utils/watch-images';

const imageUrl = findWatchImage(product);
```

### Currently Supported Brands

- Audemars Piguet (Royal Oak)
- Patek Philippe (Calatrava)
- Omega (Constellation)
- Rolex (Submariner)

## Adding More Images

To add more high-quality images:

1. Find official images from the brand's website
2. Add them to the appropriate brand section in `src/utils/watch-images.js`
3. Follow the existing structure for brand and model information

## Placeholder Image

A custom SVG placeholder image is used when no matching high-quality image is found. This placeholder is located at:

```
public/images/placeholder-watch.svg
``` 