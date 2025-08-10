'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          // First, unregister any existing service workers
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('Unregistered old service worker');
          }

          // Then register the new one
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered successfully: ', registration);
          
          // Force update if there's an update available
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is ready, reload the page
                  window.location.reload();
                }
              });
            }
          });
        } catch (registrationError) {
          console.error('SW registration failed: ', registrationError);
        }
      });
    }
  }, []);

  return null;
} 