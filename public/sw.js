const CACHE_NAME = "pwa-cache-v1";

const CORE_ASSETS = [
  "/",               
  "/manifest.json",
  "/globals.css"
 
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of CORE_ASSETS) {
        try {
          const res = await fetch(url, { cache: "reload" });
          if (res.ok) {
            await cache.put(url, res.clone());
          } else {
            console.warn("[SW] Failed to cache:", url, res.status);
          }
        } catch (e) {
          console.warn("[SW] Fetch error:", url, e);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});
