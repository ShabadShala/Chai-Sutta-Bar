const CACHE_NAME = 'my-app-cache-v2';
const urlsToCache = [
  '/', // Cache the root page
  '/index.html',  
  '/com.js',
  '/ham.js',
  '/counter.js',
  '/cheat.js',
  '/uti.js',
  '/icon-192.png',
  '/icon-256.png',
  '/icon-512.png',
  '/qrcode.png',
  '/veg.png',
  '/favicon.ico',   
];

// Install and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate and clean old caches if any
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch and serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
