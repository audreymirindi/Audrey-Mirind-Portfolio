const CACHE_NAME = "site-cache-v1"; // bump version when you deploy
const urlsToCache = [
  "/", // index.html
  "/index.html",
  "/assets/css/style.css",
  "/assets/js/main.js",
  "/assets/audio/relaxing-piano-no-copyright-music-338069.mp3",
  "/assets/image/portrait-of-audrey-mirindi.jpg",
  // add any other files you want cached for offline
];

// Install: cache everything
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Precaching website assets...");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // activate new SW immediately
});

// Activate: delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache (keeps updates fresh)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Update cache with new version if fetch succeeds
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request);
      })
  );
});
