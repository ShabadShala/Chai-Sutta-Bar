const CACHE_NAME = "CSB"; // Change version to force update

self.addEventListener("install", (event) => {
    console.log("Service Worker installed");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    return caches.delete(cache); // Clear old cache
                })
            );
        })
    );
    self.skipWaiting(); // Activate new service worker immediately
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated");
    event.waitUntil(clients.claim()); // Apply updates to all open tabs
});

self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url);
    event.respondWith(fetch(event.request)); // Always fetch fresh content
});
