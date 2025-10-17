// public/service-worker.js
// Simple cache-first SW for static assets

const CACHE = "omniscope-cache-v1";
const ASSETS = [
  "/",           // app shell
  "/index.html",
  "/manifest.json",
  // Your icons (optional, helpful for offline install experience)
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only cache GET requests
  if (request.method !== "GET") return;

  // Cache-first for same-origin docs/scripts/styles/images/fonts
  const dest = request.destination;
  const isStatic =
    dest === "document" ||
    dest === "script" ||
    dest === "style" ||
    dest === "image" ||
    dest === "font";

  if (isStatic || request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached); // fallback to cache if offline
      })
    );
  }
});
