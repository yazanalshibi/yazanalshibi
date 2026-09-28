"use client";

import { useEffect } from "react";

/** Tracks admin navigation for UX intelligence (local-first behavior log) */
export function BehaviorTracker({ slug, path }: { slug: string; path: string }) {
  useEffect(() => {
    void fetch(`/api/ventures/${slug}/preferences`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ behavior: { path, action: "view" } }),
    });
  }, [slug, path]);
  return null;
}
