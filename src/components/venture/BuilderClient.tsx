"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Venture, VentureSitePage } from "@/lib/venture/types";
import { LaunchButton } from "@/components/venture/LaunchButton";

export function BuilderClient({ venture }: { venture: Venture }) {
  const router = useRouter();
  const [pages, setPages] = useState<VentureSitePage[]>(venture.pages);
  const [pending, startTransition] = useTransition();

  function updatePage(idx: number, patch: Partial<VentureSitePage>) {
    setPages((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }

  function save() {
    startTransition(async () => {
      await fetch(`/api/ventures/${venture.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      });
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">Screen 3</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">Builder</h1>
          <p className="mt-2 text-sm text-[var(--ink)]/65">
            Edit customer pages. Speed over unlimited customization.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="border border-[var(--ink)]/15 px-4 py-2 text-sm disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save pages"}
          </button>
          {!venture.live && <LaunchButton slug={venture.slug} />}
          <Link href={`/v/${venture.slug}`} className="bg-[var(--teal)] px-4 py-2 text-sm text-[var(--foam)]">
            Preview live
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {pages.map((page, idx) => (
          <div key={page.slug} className="border border-[var(--ink)]/10 bg-white/70 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">
              /{page.slug}
            </p>
            <input
              className="mt-3 w-full border border-[var(--ink)]/10 bg-transparent p-2 text-lg font-medium outline-none"
              value={page.headline}
              onChange={(e) => updatePage(idx, { headline: e.target.value })}
            />
            <textarea
              className="mt-2 w-full border border-[var(--ink)]/10 bg-transparent p-2 text-sm outline-none"
              rows={3}
              value={page.body}
              onChange={(e) => updatePage(idx, { body: e.target.value })}
            />
            <input
              className="mt-2 w-full border border-[var(--ink)]/10 bg-transparent p-2 text-sm outline-none"
              value={page.cta}
              onChange={(e) => updatePage(idx, { cta: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
