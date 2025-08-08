'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  imageLoadTime: number;
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
}

export default function PerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({
    imageLoadTime: 0,
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor image loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource' && entry.name.includes('cloudinary.com')) {
          const resourceEntry = entry as PerformanceResourceTiming;
          metricsRef.current.imageLoadTime += resourceEntry.duration;
          metricsRef.current.totalImages++;
          metricsRef.current.loadedImages++;
          metricsRef.current.averageLoadTime = metricsRef.current.imageLoadTime / metricsRef.current.loadedImages;
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });

    // Monitor Core Web Vitals
    const webVitalsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          const firstInputEntry = entry as PerformanceEventTiming;
          console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime);
        }
      }
    });

    webVitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

    // Cleanup
    return () => {
      observer.disconnect();
      webVitalsObserver.disconnect();
    };
  }, []);

  // Log metrics periodically (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const metrics = metricsRef.current;
        if (metrics.totalImages > 0) {
          console.log('Image Performance Metrics:', {
            totalImages: metrics.totalImages,
            loadedImages: metrics.loadedImages,
            failedImages: metrics.failedImages,
            averageLoadTime: `${metrics.averageLoadTime.toFixed(2)}ms`,
            successRate: `${((metrics.loadedImages / metrics.totalImages) * 100).toFixed(1)}%`,
          });
        }
      }, 10000); // Log every 10 seconds

      return () => clearInterval(interval);
    }
  }, []);

  return null;
} 