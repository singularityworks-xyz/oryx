// Client-safe image utilities (no server-side dependencies)

// Generate optimized image URL with proper sizing (client-side)
export const getOptimizedImageUrl = (originalUrl: string, options: {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:best' | 'best' | 'good' | 'eco' | 'low';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'limit' | 'fill' | 'scale' | 'fit';
} = {}): string => {
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }

  const {
    width,
    height,
    quality = 'auto:best',
    format = 'auto',
    crop = 'limit'
  } = options;

  // Parse the Cloudinary URL
  const urlParts = originalUrl.split('/');
  const uploadIndex = urlParts.findIndex(part => part === 'upload');
  
  if (uploadIndex === -1) {
    return originalUrl;
  }

  // Build transformation string
  const transformations = [];
  
  if (width || height) {
    const size = [];
    if (width) size.push(`w_${width}`);
    if (height) size.push(`h_${height}`);
    if (crop) size.push(`c_${crop}`);
    transformations.push(size.join(','));
  }
  
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  const transformationString = transformations.length > 0 ? transformations.join('/') + '/' : '';
  
  // Insert transformations into URL
  urlParts.splice(uploadIndex + 1, 0, transformationString);
  
  return urlParts.join('/');
};

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (originalUrl: string): {
  sm: string;
  md: string;
  lg: string;
  xl: string;
} => {
  return {
    sm: getOptimizedImageUrl(originalUrl, { width: 400, height: 400 }),
    md: getOptimizedImageUrl(originalUrl, { width: 600, height: 600 }),
    lg: getOptimizedImageUrl(originalUrl, { width: 800, height: 800 }),
    xl: getOptimizedImageUrl(originalUrl, { width: 1200, height: 1200 }),
  };
};

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