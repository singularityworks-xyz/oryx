// This file should only be used on the server side
if (typeof window !== 'undefined') {
  throw new Error('Cloudinary utilities should only be used on the server side');
}

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Utility function to upload image to Cloudinary with optimization
export const uploadImage = async (file: Buffer, folder: string = 'oryx-products'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:best', fetch_format: 'auto' },
          { flags: 'progressive' }
        ],
        eager: [
          { width: 800, height: 800, crop: 'limit', quality: 'auto:best', fetch_format: 'auto' },
          { width: 400, height: 400, crop: 'limit', quality: 'auto:best', fetch_format: 'auto' },
          { width: 200, height: 200, crop: 'limit', quality: 'auto:best', fetch_format: 'auto' }
        ],
        eager_async: true,
        eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    );

    uploadStream.end(file);
  });
};

// Utility function to generate optimized image URLs
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

// Utility function to generate responsive image URLs
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

// Utility function to delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

// Utility function to get public ID from URL
export const getPublicIdFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  const publicId = filename.split('.')[0];
  return `oryx-products/${publicId}`;
}; 