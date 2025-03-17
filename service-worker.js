const CACHE_NAME = 'my-app-cache-v7';
const urlsToCache = [
  '/', '/index.html', '/com.js', '/ham.js', '/counter.js', 
  '/cheat.js', '/uti.js', '/icon-192.png', '/icon-256.png', 
  '/icon-512.png', '/qrcode.png', '/veg.png', '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Fetch each resource without relying on HTTP cache
      return Promise.all(
        urlsToCache.map(url => {
          return fetch(url, { cache: 'no-cache' })
            .then(response => {
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              return cache.put(url, response);
            })
            .catch(err => console.error('Failed to cache:', url, err));
        })
      );
    }).then(() => self.skipWaiting()) // Activate new SW immediately
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    ).then(() => self.clients.claim()) // Control existing clients
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Attempt to fetch from network
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Update cache with new response
          caches.open(CACHE_NAME).then(cache => 
            cache.put(event.request, networkResponse.clone())
          );
          return networkResponse;
        })
        .catch(() => cachedResponse); // Fallback to cache if offline

      // Return cached response if available, otherwise network response
      return cachedResponse || fetchPromise;
    })
  );
});