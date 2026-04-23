"use client";

import { useEffect } from "react";

// Registers /sw.js once on mount. Silently no-ops on:
// - Server-side render
// - Browsers without service worker support
// - Dev mode (skip to avoid caching issues during hot reload)
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Swallowed — SW registration isn't critical for normal app function.
      });
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return null;
}
