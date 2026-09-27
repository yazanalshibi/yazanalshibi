"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { LaunchPack } from "@/lib/venture/types";

export function LaunchpadClient({
  slug,
  initial,
}: {
  slug: string;
  initial: LaunchPack;
}) {
  const router = useRouter();
  const [pack, setPack] = useState(initial);
  const [pending, startTransition] = useTransition();
  const spec = pack.mvpSpec;

  function patch(body: Record<string, unknown>) {
    startTransition(async () => {
      const res = await fetch(`/api/ventures/${slug}/launchpad`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.launchPack) setPack(data.launchPack);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">
            MVP Launchpad
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            {spec.summary}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink)]/65">{spec.coreLoop}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--signal)]">
            Focus · {spec.milestoneFocus}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/os/${slug}`} className="border border-[var(--ink)]/15 px-4 py-2 text-sm">
            Dashboard
          </Link>
          <Link href={`/v/${slug}`} className="bg-[var(--teal)] px-4 py-2 text-sm text-[var(--foam)]">
            Live site
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Monetization", spec.monetization],
          ["Fulfillment", spec.fulfillment.replace("_", " ")],
          ["Constraint", spec.constraint],
        ].map(([k, v]) => (
          <div key={k} className="border border-[var(--ink)]/10 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">{k}</p>
            <p className="mt-2 text-sm">{v}</p>
          </div>
        ))}
      </section>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              Infrastructure connections
            </h2>
            <p className="mt-1 text-sm text-[var(--ink)]/60">
              Everything you need to go live ASAP — domain, payments, commerce, Google — connect in minutes on our infra.
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-3">
          {pack.connections.map((c) => (
            <li
              key={c.id}
              className="grid gap-3 border border-[var(--ink)]/8 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{c.name}</p>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--ink)]/45">
                    {c.status} · ~{c.setupMinutes} min
                  </span>
                  {c.connected && (
                    <span className="bg-[var(--teal)]/15 px-2 py-0.5 text-[10px] uppercase text-[var(--teal-deep)]">
                      Connected
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[var(--ink)]/65">{c.why}</p>
                <p className="mt-1 text-xs text-[var(--ink)]/45">{c.docsHint}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={c.connectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[var(--ink)]/15 px-3 py-2 text-sm"
                >
                  Open provider
                </a>
                <button
                  type="button"
                  disabled={pending || c.connected}
                  onClick={() => patch({ action: "connect", connectionId: c.id })}
                  className="bg-[var(--teal)] px-3 py-2 text-sm text-[var(--foam)] disabled:opacity-40"
                >
                  {c.connected ? "Linked" : "Mark connected"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-[var(--ink)]/10 bg-[var(--ink)] p-5 text-[var(--foam)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl">LVOS Bot Terminal</h2>
            <p className="mt-1 text-sm text-[var(--sand)]/70">
              Our own bots on our terminal — scaffolding, DNS hooks, Stripe/Google wiring, smoke tests. Not third-party devices.
            </p>
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => patch({ action: "run-ready" })}
            className="bg-[var(--teal)] px-4 py-2 text-sm font-medium text-[var(--foam)]"
          >
            Run ready jobs
          </button>
        </div>
        <ul className="mt-4 space-y-3 font-mono text-xs">
          {pack.botJobs.map((j) => (
            <li key={j.id} className="border border-white/10 bg-black/25 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[var(--sand)]">{j.label}</span>
                <span className="uppercase tracking-[0.12em] text-[var(--sand)]/50">{j.status}</span>
              </div>
              {j.log.map((line, i) => (
                <div key={i} className="text-[var(--sand)]/80">
                  {line}
                </div>
              ))}
              {j.status !== "done" && (
                <button
                  type="button"
                  className="mt-2 text-[var(--teal)]"
                  disabled={pending}
                  onClick={() => patch({ action: "run-job", jobId: j.id })}
                >
                  $ run
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Recommended experts (3–5)
        </h2>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          Matched to your MVP, milestone focus, and business shape — book help without leaving the OS.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pack.experts.slice(0, 5).map((e) => (
            <li key={e.id} className="border border-[var(--ink)]/10 p-4">
              <p className="font-medium">{e.name}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--ink)]/45">
                {e.title} · {e.timezone}
              </p>
              <p className="mt-2 text-sm text-[var(--ink)]/70">{e.blurb}</p>
              <p className="mt-2 text-xs text-[var(--teal-deep)]">{e.why}</p>
              <p className="mt-3 text-xs text-[var(--ink)]/50">{e.rateHint}</p>
              <button
                type="button"
                className="mt-3 border border-[var(--ink)]/15 px-3 py-1.5 text-xs"
                onClick={() =>
                  alert(`Request sent to ${e.name} for ${spec.summary} (demo).`)
                }
              >
                Request intro
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
