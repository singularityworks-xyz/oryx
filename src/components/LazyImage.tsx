'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: 'auto' | 'auto:best' | 'best' | 'good' | 'eco' | 'low';
  threshold?: number;
  rootMargin?: string;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
  quality = 'auto:best',
  threshold = 0.1,
  rootMargin = '50px',
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !hasIntersected) {
      setIsInView(true);
      setHasIntersected(true);
    }
  }, [hasIntersected]);

  useEffect(() => {
    if (priority || !imageRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [handleIntersection, priority, threshold, rootMargin]);

  // Show placeholder while not in view
  if (!isInView && !priority) {
    return (
      <div
        ref={imageRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={fill ? {} : { width: width || 400, height: height || 400 }}
      />
    );
  }

  return (
    <div ref={imageRef}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
      />
    </div>
  );
} 