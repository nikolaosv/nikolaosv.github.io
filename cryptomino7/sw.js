self.addEventListener("install", evt => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open("Demo")
    .then(cache => cache.addAll([
      "index.html",
      "manifest.json",
      "style.css",
      "script.js"
    ]))
    .catch(err => console.error(err))
  );
});

self.addEventListener("activate", evt => self.clients.claim());

self.addEventListener("fetch", evt => evt.respondWith(
  fetch(evt.request).catch(() => caches.match(evt.request))
));

/* self.addEventListener("fetch", evt => evt.respondWith(
  caches.match(evt.request).then(res => res || fetch(evt.request))
)); */