// Image optimization configuration
export const IMAGE_CONFIG = {
  // Quality settings
  qualities: {
    low: 40,
    eco: 60,
    good: 80,
    best: 100,
    auto: 90,
  },

  // Sizes for responsive images
  sizes: {
    thumbnail: 200,
    small: 400,
    medium: 600,
    large: 800,
    xlarge: 1200,
  },

  // Breakpoints for responsive images
  breakpoints: {
    mobile: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
  },

  // Cache settings
  cache: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    staleWhileRevalidate: 24 * 60 * 60, // 1 day
  },

  // Lazy loading settings
  lazy: {
    threshold: 0.1,
    rootMargin: '50px',
  },

  // Cloudinary settings
  cloudinary: {
    folder: 'oryx-products',
    transformations: {
      default: {
        quality: 'auto:best',
        format: 'auto',
        crop: 'limit',
      },
      thumbnail: {
        width: 200,
        height: 200,
        quality: 'good',
        crop: 'fill',
      },
      product: {
        width: 800,
        height: 800,
        quality: 'auto:best',
        crop: 'limit',
      },
      hero: {
        width: 1200,
        height: 600,
        quality: 'auto:best',
        crop: 'fill',
      },
    },
  },
} as const;

// Generate responsive image sizes
export const getResponsiveSizes = (containerWidth: number): string => {
  if (containerWidth <= IMAGE_CONFIG.breakpoints.mobile) {
    return '100vw';
  } else if (containerWidth <= IMAGE_CONFIG.breakpoints.tablet) {
    return '50vw';
  } else if (containerWidth <= IMAGE_CONFIG.breakpoints.laptop) {
    return '33vw';
  } else if (containerWidth <= IMAGE_CONFIG.breakpoints.desktop) {
    return '25vw';
  } else {
    return '20vw';
  }
};

// Get optimal image size based on container and device
export const getOptimalImageSize = (
  containerWidth: number,
  devicePixelRatio: number = 1
): number => {
  const optimalWidth = Math.min(
    containerWidth * devicePixelRatio,
    IMAGE_CONFIG.sizes.xlarge
  );
  return Math.round(optimalWidth);
};

// Generate srcset for responsive images
export const generateSrcSet = (baseUrl: string, sizes: number[]): string => {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}; 