const CACHE_NAME = "CSB"; // Update cache name if needed

self.addEventListener("install", (event) => {
    console.log("Service Worker installed");
    self.skipWaiting(); // Activate new service worker immediately
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((cache) => caches.delete(cache))); // Clear all old caches
        })
    );
    return self.clients.claim(); // Apply updates instantly
});

self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url);
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

// Notify when a new service worker takes control (optional)
self.addEventListener("controllerchange", () => {
    console.log("New version detected, refreshing...");
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.navigate(client.url)); // Auto-refresh all open tabs
    });
});
