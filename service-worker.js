const CACHE_NAME = 'my-app-cache-v35';
const urlsToCache = [
  '/', '/index.html', '/com.js', '/ham.js', '/counter.js', 
  '/cheat.js', '/uti.js', '/icon-192.png', '/icon-256.png', 
  '/icon-512.png', '/qrcode.png', '/veg.png', '/favicon.ico', '/uti.css', '/ham.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url => {
          return fetch(url, { cache: 'no-cache' })
            .then(response => {
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              return cache.put(url, response.clone());
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
  const requestURL = event.request.url;

  // 🚨 Skip non-HTTP(S) requests (e.g., chrome-extension://)
  if (!requestURL.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse; // Don't cache opaque responses
          }

          let responseClone = networkResponse.clone(); // Clone before caching

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => caches.match(event.request)); // Fallback to cache if offline
    })
  );
});
