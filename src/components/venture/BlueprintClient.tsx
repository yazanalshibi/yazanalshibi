"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ModuleId, Venture } from "@/lib/venture/types";
import { MODULE_CATALOG } from "@/lib/venture/modules";
import Link from "next/link";

export function BlueprintClient({ venture }: { venture: Venture }) {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleId[]>(venture.modules);
  const [pending, startTransition] = useTransition();
  const bp = venture.blueprint;

  function toggle(id: ModuleId) {
    setModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  function saveAndBuild() {
    startTransition(async () => {
      await fetch(`/api/ventures/${venture.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules }),
      });
      router.push(`/os/${venture.slug}/builder`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">Screen 2</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">Venture Blueprint</h1>
        <p className="mt-2 text-[var(--ink)]/65">{bp.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Industry", bp.industry],
          ["Market", bp.market],
          ["Customer", bp.customer],
          ["Problem", bp.problem],
          ["Solution", bp.solution],
          ["Revenue", bp.revenueModel],
        ].map(([k, v]) => (
          <div key={k} className="border border-[var(--ink)]/10 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">{k}</p>
            <p className="mt-2 text-sm">{v}</p>
          </div>
        ))}
      </div>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Offers</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {bp.offers.map((o) => (
            <li key={o.name} className="flex justify-between gap-4 border-b border-[var(--ink)]/5 py-2">
              <span>
                <strong>{o.name}</strong> — {o.description}
              </span>
              <span>${o.price}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Customer journey</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
          {bp.journey.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Activate modules</h2>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          Backend + admin + customer experience configure together when a module is ON.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {MODULE_CATALOG.map((m) => {
            const on = modules.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggle(m.id)}
                className={`border p-3 text-left text-sm ${
                  on
                    ? "border-[var(--teal)] bg-[var(--mist)]/50"
                    : "border-[var(--ink)]/10 bg-white/40"
                }`}
              >
                <span className="font-medium">
                  {m.name} · {on ? "ON" : "OFF"}
                </span>
                <span className="mt-1 block text-[var(--ink)]/60">{m.blurb}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveAndBuild}
          disabled={pending}
          className="bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-[var(--foam)] disabled:opacity-40"
        >
          {pending ? "Saving…" : "Build venture"}
        </button>
        <Link href={`/os/${venture.slug}`} className="border border-[var(--ink)]/15 px-5 py-3 text-sm">
          Skip to dashboard
        </Link>
      </div>
    </div>
  );
}
