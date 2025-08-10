const CACHE_NAME = 'oryx-image-cache-v2';
const IMAGE_CACHE_NAME = 'oryx-images-v2';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/products',
        '/cart',
        // Add other static assets here
      ]);
    })
  );
});

// Fetch event - handle image caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Only handle same-origin requests and image requests
  if (url.origin !== self.location.origin && !url.pathname.includes('cloudinary.com')) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Handle image requests
        if (request.destination === 'image' || url.pathname.includes('cloudinary.com')) {
          const cache = await caches.open(IMAGE_CACHE_NAME);
          const cachedResponse = await cache.match(request);
          
          if (cachedResponse) {
            console.log('Serving cached image:', url.pathname);
            return cachedResponse;
          }

          // Fetch and cache the image
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log('Cached new image:', url.pathname);
          }
          return networkResponse;
        }

        // Handle other requests
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log('Serving cached response:', url.pathname);
          return cachedResponse;
        }

        // Fetch from network
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          // Cache successful responses
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.error('Service Worker fetch error:', error);
        
        // Return a placeholder image if it's an image request
        if (request.destination === 'image' || url.pathname.includes('cloudinary.com')) {
          return new Response(
            `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f3f4f6"/>
              <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">Image not available</text>
            </svg>`,
            {
              headers: { 'Content-Type': 'image/svg+xml' }
            }
          );
        }
        
        // For non-image requests, return a basic error response
        return new Response('Network error', { status: 503 });
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 