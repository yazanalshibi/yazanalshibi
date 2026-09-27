"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Recommendation } from "@/lib/venture/types";

export function AdvisorRefresh({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await fetch(`/api/ventures/${slug}/os`, { method: "POST" });
          router.refresh();
        });
      }}
      className="bg-[var(--teal)] px-4 py-2 text-sm font-medium text-[var(--foam)] disabled:opacity-40"
    >
      {pending ? "Analyzing…" : "Generate recommendation"}
    </button>
  );
}

export function AdvisorList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <ul className="space-y-4">
      {recommendations.map((r) => (
        <li key={r.id} className="border border-[var(--ink)]/10 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--signal)]">
            {r.priority} · {new Date(r.createdAt).toLocaleString()}
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl">{r.title}</h3>
          <p className="mt-2 text-sm text-[var(--ink)]/70">{r.body}</p>
        </li>
      ))}
      {recommendations.length === 0 && (
        <li className="text-sm text-[var(--ink)]/55">No recommendations yet.</li>
      )}
    </ul>
  );
}
