const CACHE = "go-beyond-v2"; // bumping this forces old cached versions to be purged
const CORE_ASSETS = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.url.includes("/api/")) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Navigation requests (loading the app shell / HTML) are ALWAYS fetched
  // fresh from the network first. This is what makes updates actually show
  // up on the phone after a redeploy, instead of the old cached shell
  // being served forever. Falls back to cache only if truly offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          caches.open(CACHE).then((c) => c.put(request, networkResponse.clone()));
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (JS/CSS/images) can stay cache-first for speed — their
  // filenames change on every build anyway, so there's no staleness risk.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          caches.open(CACHE).then((c) => c.put(request, networkResponse.clone()));
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
