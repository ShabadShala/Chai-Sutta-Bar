const CACHE_NAME = "CSB-v2"; // Updated version to force cache refresh
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-256.png',
  '/icon-512.png',
  // Add other static assets (CSS, JS, images) here
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching assets...");
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache); // Clear old caches
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim()); // Take control of all clients
});

self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Cache new responses for future use
            if (event.request.method === 'GET') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          });
      })
  );
});

// Add message listener for caching URLs dynamically
self.addEventListener('message', (event) => {
  if (event.data.action === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});