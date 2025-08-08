'use client';

import Image from 'next/image';
import { useImageLoader } from '@/hooks/useImageLoader';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: 'auto' | 'auto:best' | 'best' | 'good' | 'eco' | 'low';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'limit' | 'fill' | 'scale' | 'fit';
  responsive?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
  quality = 'auto:best',
  format = 'auto',
  crop = 'limit',
  responsive = false,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const { src: optimizedSrc, isLoading, hasError, isLoaded, retry } = useImageLoader({
    src,
    width,
    height,
    quality,
    priority,
  });

  // Fallback image for errors
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width: width || 400, height: height || 400 }}
      >
        <div className="text-gray-400 text-center">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">Image not available</p>
          <button
            onClick={retry}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading && !priority) {
    return (
      <div
        className={`bg-gray-200 animate-pulse ${className}`}
        style={fill ? {} : { width: width || 400, height: height || 400 }}
      />
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      priority={priority}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      quality={quality === 'auto:best' ? 90 : quality === 'best' ? 100 : quality === 'good' ? 80 : quality === 'eco' ? 60 : 40}
    />
  );
} 