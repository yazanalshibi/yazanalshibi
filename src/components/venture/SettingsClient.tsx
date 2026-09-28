"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  BrandIdentity,
  CloudShareRule,
  DashboardWidgetPref,
  InsightPref,
  RetentionDays,
  VenturePreferences,
} from "@/lib/venture/preferences";

const RETENTION_OPTIONS: { value: RetentionDays; label: string }[] = [
  { value: 1, label: "1 day" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 365, label: "1 year" },
  { value: 0, label: "Until revoked" },
];

const WIDGET_NAMES: Record<string, string> = {
  metrics: "Metrics",
  health: "Venture health",
  ai: "AI observation",
  activity: "Recent activity",
  bookings: "Bookings",
  leads: "Leads",
  cloud: "Cloud share status",
  ux: "UX suggestions",
  brand_preview: "Brand preview",
};

export function SettingsClient({
  slug,
  initial,
  cloud,
}: {
  slug: string;
  initial: VenturePreferences;
  cloud: {
    activeMirrors: { category: string; expiresAt: string | null; itemCount: number }[];
    note: string;
  };
}) {
  const router = useRouter();
  const [prefs, setPrefs] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save(patch: Partial<VenturePreferences>, extra?: Record<string, unknown>) {
    startTransition(async () => {
      const next = { ...prefs, ...patch };
      setPrefs(next);
      const res = await fetch(`/api/ventures/${slug}/preferences`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: next.brand,
          dashboard: next.dashboard,
          insights: next.insights,
          cloudShare: next.cloudShare,
          ...extra,
        }),
      });
      const data = await res.json();
      if (data.preferences) setPrefs(data.preferences);
      setMessage("Saved locally.");
      router.refresh();
    });
  }

  function updateBrand<K extends keyof BrandIdentity>(key: K, value: BrandIdentity[K]) {
    const brand = { ...prefs.brand, [key]: value };
    setPrefs({ ...prefs, brand });
  }

  function updateRule(category: string, patch: Partial<CloudShareRule>) {
    const cloudShare = prefs.cloudShare.map((r) =>
      r.category === category ? { ...r, ...patch } : r,
    );
    setPrefs({ ...prefs, cloudShare });
  }

  function moveWidget(id: string, dir: -1 | 1) {
    const sorted = [...prefs.dashboard].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((w) => w.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swap];
    const dashboard = prefs.dashboard.map((w) => {
      if (w.id === a.id) return { ...w, order: b.order };
      if (w.id === b.id) return { ...w, order: a.order };
      return w;
    });
    setPrefs({ ...prefs, dashboard });
  }

  function toggleWidget(id: string) {
    const dashboard = prefs.dashboard.map((w) =>
      w.id === id ? { ...w, visible: !w.visible } : w,
    );
    setPrefs({ ...prefs, dashboard });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-16">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">Preferences</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
          Local data · Brand · Dashboard · UX
        </h1>
        <p className="mt-2 text-sm text-[var(--ink)]/65">
          Everything saves on this machine first. You choose what may mirror to cloud storage and for how long.
        </p>
        {message && <p className="mt-2 text-sm text-[var(--teal)]">{message}</p>}
      </div>

      <section id="privacy" className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Privacy & cloud share</h2>
        <p className="mt-2 text-sm text-[var(--ink)]/65">{cloud.note}</p>
        <ul className="mt-4 space-y-3">
          {prefs.cloudShare.map((rule) => (
            <li
              key={rule.category}
              className="grid gap-2 border border-[var(--ink)]/8 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
            >
              <div>
                <p className="text-sm font-medium">{rule.label}</p>
                <p className="text-xs text-[var(--ink)]/55">{rule.description}</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rule.share}
                  onChange={(e) => updateRule(rule.category, { share: e.target.checked })}
                />
                Share
              </label>
              <select
                className="border border-[var(--ink)]/15 bg-transparent p-2 text-sm"
                value={rule.retentionDays}
                disabled={!rule.share}
                onChange={(e) =>
                  updateRule(rule.category, {
                    retentionDays: Number(e.target.value) as RetentionDays,
                  })
                }
              >
                {RETENTION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            className="bg-[var(--teal)] px-4 py-2 text-sm text-[var(--foam)]"
            onClick={() => save({ cloudShare: prefs.cloudShare }, { action: "sync-cloud" })}
          >
            Save & sync allowed categories
          </button>
          <button
            type="button"
            disabled={pending}
            className="border border-[var(--ink)]/15 px-4 py-2 text-sm"
            onClick={() => save({}, { action: "purge-cloud" })}
          >
            Clear cloud mirrors
          </button>
        </div>
        {cloud.activeMirrors.length > 0 && (
          <ul className="mt-4 space-y-1 text-xs text-[var(--ink)]/55">
            {cloud.activeMirrors.map((m) => (
              <li key={m.category}>
                Active · {m.category} · {m.itemCount} items ·{" "}
                {m.expiresAt ? `expires ${new Date(m.expiresAt).toLocaleString()}` : "until revoked"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="brand" className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Brand identity</h2>
        <p className="mt-1 text-sm text-[var(--ink)]/65">
          Flexible tokens drive the live site (and optionally admin).
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["displayName", "Display name"],
              ["tagline", "Tagline"],
              ["logoText", "Logo text"],
              ["fontDisplay", "Display font"],
              ["fontBody", "Body font"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="text-sm">
              <span className="text-xs uppercase tracking-[0.12em] text-[var(--ink)]/45">{label}</span>
              <input
                className="mt-1 w-full border border-[var(--ink)]/15 bg-transparent p-2"
                value={prefs.brand[key]}
                onChange={(e) => updateBrand(key, e.target.value)}
              />
            </label>
          ))}
          {(
            [
              ["primary", "Primary"],
              ["secondary", "Secondary"],
              ["accent", "Accent"],
              ["background", "Background"],
              ["foreground", "Foreground"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 text-sm">
              <span className="w-24 text-xs uppercase tracking-[0.12em] text-[var(--ink)]/45">
                {label}
              </span>
              <input
                type="color"
                value={prefs.brand[key]}
                onChange={(e) => updateBrand(key, e.target.value)}
              />
              <input
                className="flex-1 border border-[var(--ink)]/15 bg-transparent p-2 font-mono text-xs"
                value={prefs.brand[key]}
                onChange={(e) => updateBrand(key, e.target.value)}
              />
            </label>
          ))}
          <label className="text-sm">
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--ink)]/45">Radius</span>
            <select
              className="mt-1 w-full border border-[var(--ink)]/15 bg-transparent p-2"
              value={prefs.brand.radius}
              onChange={(e) => updateBrand("radius", e.target.value as BrandIdentity["radius"])}
            >
              <option value="sharp">Sharp</option>
              <option value="soft">Soft</option>
              <option value="round">Round</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--ink)]/45">Tone</span>
            <select
              className="mt-1 w-full border border-[var(--ink)]/15 bg-transparent p-2"
              value={prefs.brand.tone}
              onChange={(e) => updateBrand("tone", e.target.value as BrandIdentity["tone"])}
            >
              <option value="minimal">Minimal</option>
              <option value="bold">Bold</option>
              <option value="warm">Warm</option>
              <option value="editorial">Editorial</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={prefs.brand.applyToAdmin}
              onChange={(e) => updateBrand("applyToAdmin", e.target.checked)}
            />
            Apply brand colors to admin OS
          </label>
        </div>
        <div
          className="mt-4 p-5"
          style={{
            background: prefs.brand.background,
            color: prefs.brand.foreground,
            borderRadius: prefs.brand.radius === "sharp" ? 0 : prefs.brand.radius === "round" ? 18 : 8,
          }}
        >
          <p className="text-xs uppercase tracking-[0.16em] opacity-60">{prefs.brand.logoText}</p>
          <p className="mt-2 text-2xl font-semibold" style={{ fontFamily: prefs.brand.fontDisplay }}>
            {prefs.brand.displayName}
          </p>
          <p className="mt-1 text-sm opacity-75">{prefs.brand.tagline}</p>
          <button
            type="button"
            className="mt-4 px-4 py-2 text-sm"
            style={{ background: prefs.brand.primary, color: prefs.brand.foreground, borderRadius: "inherit" }}
          >
            Primary CTA
          </button>
        </div>
        <button
          type="button"
          disabled={pending}
          className="mt-4 bg-[var(--teal)] px-4 py-2 text-sm text-[var(--foam)]"
          onClick={() => save({ brand: prefs.brand })}
        >
          Save brand
        </button>
      </section>

      <section id="dashboard" className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Dashboard & insights</h2>
        <p className="mt-1 text-sm text-[var(--ink)]/65">
          Show only what you need. Reorder widgets to match your daily workflow.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.insights.showAi}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  insights: { ...prefs.insights, showAi: e.target.checked },
                })
              }
            />
            AI insights
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.insights.showHealth}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  insights: { ...prefs.insights, showHealth: e.target.checked },
                })
              }
            />
            Health panel
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.insights.showUxSuggestions}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  insights: { ...prefs.insights, showUxSuggestions: e.target.checked },
                })
              }
            />
            UX suggestions
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.insights.compactMetrics}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  insights: { ...prefs.insights, compactMetrics: e.target.checked },
                })
              }
            />
            Compact metrics
          </label>
          <label className="flex items-center gap-2">
            Density
            <select
              className="border border-[var(--ink)]/15 bg-transparent p-1"
              value={prefs.insights.density}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  insights: {
                    ...prefs.insights,
                    density: e.target.value as InsightPref["density"],
                  },
                })
              }
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>
        </div>
        <ul className="mt-4 space-y-2">
          {[...prefs.dashboard]
            .sort((a, b) => a.order - b.order)
            .map((w: DashboardWidgetPref) => (
              <li
                key={w.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-[var(--ink)]/8 p-3 text-sm"
              >
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={w.visible} onChange={() => toggleWidget(w.id)} />
                  {WIDGET_NAMES[w.id] || w.id}
                </label>
                <div className="flex gap-2">
                  <button type="button" className="border px-2 py-1 text-xs" onClick={() => moveWidget(w.id, -1)}>
                    Up
                  </button>
                  <button type="button" className="border px-2 py-1 text-xs" onClick={() => moveWidget(w.id, 1)}>
                    Down
                  </button>
                  <select
                    className="border px-2 py-1 text-xs"
                    value={w.size}
                    onChange={(e) => {
                      const dashboard = prefs.dashboard.map((x) =>
                        x.id === w.id ? { ...x, size: e.target.value as DashboardWidgetPref["size"] } : x,
                      );
                      setPrefs({ ...prefs, dashboard });
                    }}
                  >
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                  </select>
                </div>
              </li>
            ))}
        </ul>
        <button
          type="button"
          disabled={pending}
          className="mt-4 bg-[var(--teal)] px-4 py-2 text-sm text-[var(--foam)]"
          onClick={() => save({ dashboard: prefs.dashboard, insights: prefs.insights })}
        >
          Save dashboard layout
        </button>
      </section>
    </div>
  );
}
