"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/hotel-ui/sw.js").catch(() => {
        // SW registration failed — non-critical for app function
      });
    }
  }, []);

  return null;
}
