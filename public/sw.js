// Minimal service worker — required for PWA install prompt on Chrome/Edge.
// Does not cache anything yet; intercepting fetches for offline support is a
// separate workstream. Keeping this empty-but-valid lets the app be
// "installable" without risking stale-content bugs from overeager caching.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Intentional no-op. Browser handles the request normally.
});
