import { getOptimizedImageUrl } from './clientImageUtils';

// Preload critical images for better performance
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (urls: string[]): Promise<void> => {
  const promises = urls.map(url => preloadImage(url));
  await Promise.allSettled(promises);
};

// Generate optimized image URL with proper sizing
export const getOptimizedImageUrlWithSize = (
  originalUrl: string,
  width: number,
  height?: number,
  quality: 'auto' | 'auto:best' | 'best' | 'good' | 'eco' | 'low' = 'auto:best'
): string => {
  return getOptimizedImageUrl(originalUrl, {
    width,
    height,
    quality,
    format: 'auto',
    crop: 'limit'
  });
};

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageSet = (originalUrl: string) => {
  return {
    mobile: getOptimizedImageUrlWithSize(originalUrl, 400, 400, 'good'),
    tablet: getOptimizedImageUrlWithSize(originalUrl, 600, 600, 'good'),
    desktop: getOptimizedImageUrlWithSize(originalUrl, 800, 800, 'auto:best'),
    large: getOptimizedImageUrlWithSize(originalUrl, 1200, 1200, 'auto:best'),
  };
};

// Check if image is already loaded
export const isImageLoaded = (src: string): boolean => {
  const img = new Image();
  img.src = src;
  return img.complete;
};

// Generate blur data URL for placeholder
export const generateBlurDataURL = (width: number, height: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a simple gradient pattern
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
};

// Calculate optimal image size based on container and device
export const calculateOptimalImageSize = (
  containerWidth: number,
  devicePixelRatio: number = 1,
  maxWidth: number = 1200
): number => {
  const optimalWidth = Math.min(containerWidth * devicePixelRatio, maxWidth);
  return Math.round(optimalWidth);
};

// Generate image srcset for responsive images
export const generateSrcSet = (originalUrl: string, sizes: number[]): string => {
  return sizes
    .map(size => {
      const optimizedUrl = getOptimizedImageUrlWithSize(originalUrl, size, size);
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}; 