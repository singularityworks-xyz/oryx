import { useState, useEffect, useCallback } from 'react';
import { preloadImage, getOptimizedImageUrlWithSize } from '@/lib/clientImageUtils';

interface UseImageLoaderOptions {
  src: string;
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:best' | 'best' | 'good' | 'eco' | 'low';
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface UseImageLoaderReturn {
  src: string;
  isLoading: boolean;
  hasError: boolean;
  isLoaded: boolean;
  retry: () => void;
}

export function useImageLoader({
  src,
  width,
  height,
  quality = 'auto:best',
  onLoad,
  onError,
}: UseImageLoaderOptions): UseImageLoaderReturn {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadImage = useCallback(async () => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      setIsLoaded(false);

      // Generate optimized URL
      let imageSrc = src;
      if (src.includes('cloudinary.com')) {
        imageSrc = getOptimizedImageUrlWithSize(src, width || 800, height, quality);
      }

      setOptimizedSrc(imageSrc);

      // Preload the image
      await preloadImage(imageSrc);
      
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    } catch (error) {
      setHasError(true);
      setIsLoading(false);
      onError?.(error as Error);
    }
  }, [src, width, height, quality, onLoad, onError]);

  const retry = useCallback(() => {
    loadImage();
  }, [loadImage]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return {
    src: optimizedSrc,
    isLoading,
    hasError,
    isLoaded,
    retry,
  };
} 