// Service worker template: `pnpm build` fills in VERSION and FILES and writes it to dist/sw.js.
// Offline-first: every file is cached on install; any page navigation gets the app shell.
// A new build installs in the background and takes over on the next open.
const VERSION = "__VERSION__";
const FILES = __FILES__;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const key = req.mode === "navigate" ? "/" : req;
  e.respondWith(caches.match(key, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(req)));
});
