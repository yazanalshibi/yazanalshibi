"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import type { VenturePreferences, UxSuggestion } from "@/lib/venture/preferences";
import type { Recommendation } from "@/lib/venture/types";

type Metrics = {
  revenue: number;
  customers: number;
  bookings: number;
  leads: number;
  conversion: number;
  averageOrder: number;
};

type Health = { dimension: string; status: string }[];

type CloudInfo = {
  activeMirrors: { category: string; expiresAt: string | null; itemCount: number }[];
  note: string;
};

const WIDGET_LABELS: Record<string, string> = {
  metrics: "Metrics",
  health: "Venture health",
  ai: "AI observation",
  activity: "Recent activity",
  bookings: "Bookings",
  leads: "Leads",
  cloud: "Cloud share",
  ux: "UX suggestions",
  brand_preview: "Brand",
};

export function FlexibleDashboard({
  slug,
  ventureName,
  live,
  prefs,
  metrics,
  health,
  recommendations,
  leads,
  bookings,
  cloud,
  sessionAdvisor,
}: {
  slug: string;
  ventureName: string;
  live: boolean;
  prefs: VenturePreferences;
  metrics: Metrics;
  health: Health;
  recommendations: Recommendation[];
  leads: { name: string; status: string }[];
  bookings: { status: string; startsAt: string }[];
  cloud: CloudInfo;
  sessionAdvisor?: { name: string; title: string; tip: string } | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const density = prefs.insights.density;
  const pad = density === "compact" ? "p-3" : "p-5";
  const gap = density === "compact" ? "gap-3" : "gap-6";

  const widgets = useMemo(
    () =>
      [...prefs.dashboard]
        .filter((w) => w.visible)
        .filter((w) => {
          if (w.id === "ai" && !prefs.insights.showAi) return false;
          if (w.id === "health" && !prefs.insights.showHealth) return false;
          if (w.id === "ux" && !prefs.insights.showUxSuggestions) return false;
          return true;
        })
        .sort((a, b) => a.order - b.order),
    [prefs],
  );

  function runUx(s: UxSuggestion) {
    startTransition(async () => {
      if (s.actionHref?.startsWith("widget:") || s.actionHref?.startsWith("pref:")) {
        await fetch(`/api/ventures/${slug}/preferences`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uxAction: s.actionHref }),
        });
        router.refresh();
        return;
      }
      if (s.actionHref === "/os-advisor") {
        router.push(`/os/${slug}/advisor`);
        return;
      }
      if (s.actionHref?.includes("settings")) {
        router.push(`/os/${slug}/settings`);
      }
    });
  }

  function dismiss(id: string) {
    startTransition(async () => {
      await fetch(`/api/ventures/${slug}/preferences`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dismissSuggestionId: id }),
      });
      router.refresh();
    });
  }

  const metricItems = prefs.insights.compactMetrics
    ? [
        ["Rev", `$${metrics.revenue}`],
        ["Leads", String(metrics.leads)],
        ["Conv", `${metrics.conversion}%`],
        ["AOV", `$${metrics.averageOrder}`],
      ]
    : [
        ["Revenue", `$${metrics.revenue}`],
        ["Customers", String(metrics.customers)],
        ["Bookings", String(metrics.bookings)],
        ["Leads", String(metrics.leads)],
        ["Conversion", `${metrics.conversion}%`],
        ["AOV", `$${metrics.averageOrder}`],
      ];

  return (
    <div className={`mx-auto max-w-5xl space-y-6`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">Dashboard</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">{ventureName}</h1>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Layout follows your preferences · {density} density
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/os/${slug}/launchpad`} className="border border-[var(--ink)]/15 px-4 py-2 text-sm">
            Launchpad
          </Link>
          <Link href={`/os/${slug}/settings`} className="border border-[var(--ink)]/15 px-4 py-2 text-sm">
            Customize
          </Link>
          <Link href={`/v/${slug}`} className="border border-[var(--ink)]/15 px-4 py-2 text-sm">
            Live site
          </Link>
          {!live && (
            <span className="bg-[var(--signal)]/15 px-3 py-2 text-xs text-[var(--signal)]">DRAFT</span>
          )}
        </div>
      </div>

      {sessionAdvisor && (
        <aside className="border border-[var(--teal)]/30 bg-[var(--mist)]/50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal-deep)]">
            Session advisor · {sessionAdvisor.name} · {sessionAdvisor.title}
          </p>
          <p className="mt-2 text-sm text-[var(--ink)]/80">{sessionAdvisor.tip}</p>
          <Link href={`/os/${slug}/launchpad`} className="mt-3 inline-block text-sm text-[var(--teal)]">
            Ask advisors on Launchpad →
          </Link>
        </aside>
      )}

      <div className={`grid ${gap}`}>
        {widgets.map((w) => {
          const wide = w.size === "l" || w.id === "metrics" || w.id === "activity";
          const className = `border border-[var(--ink)]/10 bg-white/70 ${pad} ${
            wide ? "" : ""
          }`;

          if (w.id === "metrics") {
            return (
              <section key={w.id} className={className}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">
                    {WIDGET_LABELS.metrics}
                  </h2>
                </div>
                <div
                  className={`grid gap-3 ${
                    prefs.insights.compactMetrics
                      ? "grid-cols-2 sm:grid-cols-4"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                  }`}
                >
                  {metricItems.map(([label, value]) => (
                    <div key={label} className="border border-[var(--ink)]/5 bg-white/50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink)]/45">
                        {label}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-display)] text-xl">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (w.id === "ai") {
            const rec = recommendations[0];
            return (
              <section key={w.id} className={className}>
                <h2 className="font-[family-name:var(--font-display)] text-xl">AI observation</h2>
                {rec ? (
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--signal)]">
                      {rec.priority} priority
                    </p>
                    <p className="mt-2 font-medium">{rec.title}</p>
                    <p className="mt-2 text-sm text-[var(--ink)]/70">{rec.body}</p>
                    <Link href={`/os/${slug}/advisor`} className="mt-3 inline-block text-sm text-[var(--teal)]">
                      Open AI Advisor →
                    </Link>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[var(--ink)]/60">No recommendations yet.</p>
                )}
              </section>
            );
          }

          if (w.id === "health") {
            return (
              <section key={w.id} className={className}>
                <h2 className="font-[family-name:var(--font-display)] text-xl">Venture health</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {health.map((h) => (
                    <li key={h.dimension} className="flex justify-between gap-4 border-b border-[var(--ink)]/5 py-1">
                      <span>{h.dimension}</span>
                      <span className="text-[var(--ink)]/55">{h.status}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          if (w.id === "ux") {
            const active = prefs.uxSuggestions.filter((s) => !s.dismissed);
            return (
              <section key={w.id} className={className}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-[family-name:var(--font-display)] text-xl">UX suggestions</h2>
                  <button
                    type="button"
                    disabled={pending}
                    className="text-xs text-[var(--teal)]"
                    onClick={() => {
                      startTransition(async () => {
                        await fetch(`/api/ventures/${slug}/preferences`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "refresh-ux" }),
                        });
                        router.refresh();
                      });
                    }}
                  >
                    Refresh
                  </button>
                </div>
                <ul className="mt-3 space-y-3">
                  {active.map((s) => (
                    <li key={s.id} className="border border-[var(--ink)]/8 bg-white/60 p-3 text-sm">
                      <p className="font-medium">{s.title}</p>
                      <p className="mt-1 text-[var(--ink)]/65">{s.body}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--ink)]/40">
                        Based on · {s.basedOn}
                      </p>
                      <div className="mt-2 flex gap-2">
                        {s.actionLabel && (
                          <button
                            type="button"
                            className="bg-[var(--teal)] px-3 py-1.5 text-xs text-[var(--foam)]"
                            onClick={() => runUx(s)}
                          >
                            {s.actionLabel}
                          </button>
                        )}
                        <button
                          type="button"
                          className="text-xs text-[var(--ink)]/50"
                          onClick={() => dismiss(s.id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </li>
                  ))}
                  {active.length === 0 && (
                    <li className="text-sm text-[var(--ink)]/55">
                      Keep using the OS — suggestions appear from your daily navigation patterns.
                    </li>
                  )}
                </ul>
              </section>
            );
          }

          if (w.id === "cloud") {
            return (
              <section key={w.id} className={className}>
                <h2 className="font-[family-name:var(--font-display)] text-xl">Local-first · cloud share</h2>
                <p className="mt-2 text-sm text-[var(--ink)]/65">{cloud.note}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {cloud.activeMirrors.length === 0 && (
                    <li className="text-[var(--ink)]/45">No categories shared yet.</li>
                  )}
                  {cloud.activeMirrors.map((m) => (
                    <li key={m.category} className="flex justify-between border-b border-[var(--ink)]/5 py-1">
                      <span>{m.category}</span>
                      <span className="text-[var(--ink)]/50">
                        {m.itemCount} · {m.expiresAt ? `expires ${new Date(m.expiresAt).toLocaleDateString()}` : "until revoked"}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={`/os/${slug}/settings#privacy`} className="mt-3 inline-block text-sm text-[var(--teal)]">
                  Manage share rules →
                </Link>
              </section>
            );
          }

          if (w.id === "leads") {
            return (
              <section key={w.id} className={className}>
                <h2 className="font-[family-name:var(--font-display)] text-xl">Leads</h2>
                <ul className="mt-3 space-y-1 text-sm">
                  {leads.slice(0, 6).map((l, i) => (
                    <li key={`${l.name}-${i}`}>
                      {l.name} · {l.status}
                    </li>
                  ))}
                  {leads.length === 0 && <li className="text-[var(--ink)]/45">None yet</li>}
                </ul>
              </section>
            );
          }

          if (w.id === "bookings") {
            return (
              <section key={w.id} className={className}>
                <h2 className="font-[family-name:var(--font-display)] text-xl">Bookings</h2>
                <ul className="mt-3 space-y-1 text-sm">
                  {bookings.slice(0, 6).map((b, i) => (
                    <li key={`${b.startsAt}-${i}`}>
                      {b.status} · {new Date(b.startsAt).toLocaleString()}
                    </li>
                  ))}
                  {bookings.length === 0 && <li className="text-[var(--ink)]/45">None yet</li>}
                </ul>
              </section>
            );
          }

          if (w.id === "brand_preview") {
            const b = prefs.brand;
            return (
              <section
                key={w.id}
                className={className}
                style={{ background: b.background, color: b.foreground }}
              >
                <p className="text-xs uppercase tracking-[0.16em] opacity-60">Brand</p>
                <p className="mt-2 text-2xl font-semibold" style={{ fontFamily: b.fontDisplay }}>
                  {b.displayName}
                </p>
                <p className="mt-1 text-sm opacity-70">{b.tagline}</p>
              </section>
            );
          }

          if (w.id === "activity") {
            return (
              <section key={w.id} className={className}>
                <h2 className="font-[family-name:var(--font-display)] text-xl">Recent activity</h2>
                <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">Leads</p>
                    <ul className="mt-2 space-y-1">
                      {leads.slice(0, 4).map((l, i) => (
                        <li key={`a-${i}`}>
                          {l.name} · {l.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">Bookings</p>
                    <ul className="mt-2 space-y-1">
                      {bookings.slice(0, 4).map((b, i) => (
                        <li key={`b-${i}`}>
                          {b.status} · {new Date(b.startsAt).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
