"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { LaunchPack } from "@/lib/venture/types";
import type { GeoIndustryIntel } from "@/lib/venture/geo-intel";
import type { BuildSession } from "@/lib/venture/build-session";

type GeoPack = GeoIndustryIntel & { quickLinks?: { label: string; url: string }[] };

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
  const geo = pack.geoIntel as GeoPack | undefined;
  const session = pack.buildSession as BuildSession | undefined;

  const vrClass = useMemo(
    () => (session?.vr?.enabled ? "vr-friendly" : ""),
    [session?.vr?.enabled],
  );

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

  const hit = session?.vr?.largeTargets ? "min-h-12 min-w-[7rem] px-5 py-3 text-base" : "px-3 py-2 text-sm";

  return (
    <div className={`mx-auto max-w-5xl space-y-8 pb-16 ${vrClass}`}>
      {pack.sessionAdvisor && (
        <aside className="border border-[var(--teal)]/30 bg-[var(--mist)]/50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal-deep)]">
            Session advisor · {pack.sessionAdvisor.name} · {pack.sessionAdvisor.title}
          </p>
          <p className="mt-2 text-sm text-[var(--ink)]/80">{pack.sessionAdvisor.tip}</p>
          <button
            type="button"
            className={`mt-3 border border-[var(--ink)]/15 ${hit}`}
            disabled={pending}
            onClick={() => patch({ action: "refresh-advisor" })}
          >
            Ask another advisor tip
          </button>
        </aside>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">
            MVP Launchpad · local-first
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            {spec.summary}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink)]/65">{spec.coreLoop}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--signal)]">
            Focus · {spec.milestoneFocus}
            {geo ? ` · ${geo.regionLabel}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/os/${slug}/settings`} className={`border border-[var(--ink)]/15 ${hit}`}>
            Privacy / cloud
          </Link>
          <Link href={`/os/${slug}`} className={`border border-[var(--ink)]/15 ${hit}`}>
            Dashboard
          </Link>
          <Link
            href={`/v/${slug}${session?.vr?.enabled ? "?vr=1" : ""}`}
            className={`bg-[var(--teal)] text-[var(--foam)] ${hit}`}
          >
            Live site
          </Link>
        </div>
      </div>

      {geo && (
        <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Leading data · {geo.regionLabel} · {geo.industryLabel}
          </h2>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Estimated month-one costs: ${geo.estimatedMonthOneUsd.low} – $
            {geo.estimatedMonthOneUsd.high} ({geo.currencyNote})
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">Cost bands</p>
              <ul className="mt-2 space-y-2 text-sm">
                {geo.costBands.map((c) => (
                  <li key={c.item} className="border-b border-[var(--ink)]/5 py-1">
                    <span className="font-medium">{c.item}</span>
                    <span className="float-right">
                      ${c.lowUsd}–${c.highUsd}
                    </span>
                    <p className="clear-both text-xs text-[var(--ink)]/50">{c.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">
                Tech infrastructure needed
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink)]/70">
                {geo.techInfrastructure.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">
                Market signals
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--ink)]/70">
                {geo.leadingSignals.map((s) => (
                  <li key={s}>– {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {pack.govApplications && pack.govApplications.length > 0 && (
        <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Incorporation & government applications
          </h2>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Accessible inside the build — track filings while your MVP goes live. Not legal advice.
          </p>
          {geo?.quickLinks && (
            <div className="mt-3 flex flex-wrap gap-2">
              {geo.quickLinks.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`border border-[var(--ink)]/15 ${hit}`}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
          <ul className="mt-4 space-y-3">
            {pack.govApplications.map((g) => (
              <li key={g.id} className="border border-[var(--ink)]/8 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{g.title}</p>
                    <p className="text-xs text-[var(--ink)]/45">
                      {g.agency} · {g.category} · ~{g.typicalDays} days · {g.status}
                    </p>
                    <p className="mt-1 text-sm text-[var(--ink)]/65">{g.why}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.applyUrl && (
                      <a
                        href={g.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`bg-[var(--teal)] text-[var(--foam)] ${hit}`}
                      >
                        Open application
                      </a>
                    )}
                    <select
                      className="border border-[var(--ink)]/15 bg-transparent p-2 text-sm"
                      value={g.status}
                      disabled={pending}
                      onChange={(e) =>
                        patch({
                          action: "gov-status",
                          govId: g.id,
                          govStatus: e.target.value,
                        })
                      }
                    >
                      <option value="todo">To do</option>
                      <option value="in_progress">In progress</option>
                      <option value="done">Done</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <ul className="mt-2 list-disc pl-5 text-xs text-[var(--ink)]/55">
                  {g.checklist.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      {session && (
        <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Build session · plug-and-play
          </h2>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Toggle features and color kits. Enable VR for Meta Quest / glasses-friendly UI.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {session.features.map((f) => (
              <label
                key={f.id}
                className={`flex cursor-pointer items-start gap-3 border p-3 ${
                  f.enabled ? "border-[var(--teal)] bg-[var(--mist)]/40" : "border-[var(--ink)]/10"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5"
                  checked={f.enabled}
                  disabled={pending}
                  onChange={(e) =>
                    patch({
                      action: "toggle-feature",
                      featureId: f.id,
                      enabled: e.target.checked,
                    })
                  }
                />
                <span>
                  <span className="block font-medium">{f.name}</span>
                  <span className="text-xs text-[var(--ink)]/55">{f.blurb}</span>
                </span>
              </label>
            ))}
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">Colors</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {session.colorKits.map((kit) => (
              <button
                key={kit.id}
                type="button"
                disabled={pending}
                onClick={() => patch({ action: "set-color", colorKitId: kit.id })}
                className={`flex items-center gap-2 border p-2 ${
                  session.colorKitId === kit.id ? "border-[var(--teal)]" : "border-[var(--ink)]/10"
                } ${hit}`}
              >
                <span
                  className="inline-block h-6 w-6 rounded-full"
                  style={{ background: kit.primary }}
                />
                {kit.name}
              </button>
            ))}
          </div>

          <div className="mt-6 border border-[var(--ink)]/10 p-4">
            <p className="font-medium">Meta glasses / Quest VR mode</p>
            <p className="mt-1 text-sm text-[var(--ink)]/60">
              Larger hit targets, spatial nav, and a headset-friendly live storefront. Works in
              browser today; WebXR-ready for Quest / Meta glasses.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={`bg-[var(--teal)] text-[var(--foam)] ${hit}`}
                disabled={pending}
                onClick={() =>
                  patch({
                    action: "set-vr",
                    vr: {
                      enabled: true,
                      target: "meta_glasses",
                      largeTargets: true,
                      spatialNav: true,
                      voiceHints: true,
                    },
                  })
                }
              >
                Enable VR-friendly
              </button>
              <button
                type="button"
                className={`border border-[var(--ink)]/15 ${hit}`}
                disabled={pending}
                onClick={() =>
                  patch({
                    action: "set-vr",
                    vr: { enabled: false, target: "browser_fallback" },
                  })
                }
              >
                Standard UI
              </button>
              {session.vr.enabled && (
                <span className="self-center text-xs uppercase tracking-[0.14em] text-[var(--teal-deep)]">
                  VR on · {session.vr.target.replace("_", " ")}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Infrastructure connections
        </h2>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          Data stays local until you share categories in Settings. Connect rails in minutes.
        </p>
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
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={c.connectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`border border-[var(--ink)]/15 ${hit}`}
                >
                  Open provider
                </a>
                <button
                  type="button"
                  disabled={pending || c.connected}
                  onClick={() => patch({ action: "connect", connectionId: c.id })}
                  className={`bg-[var(--teal)] text-[var(--foam)] disabled:opacity-40 ${hit}`}
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
              Our bots on our terminal — scaffold, wire connections, smoke-test.
            </p>
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => patch({ action: "run-ready" })}
            className={`bg-[var(--teal)] font-medium text-[var(--foam)] ${hit}`}
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
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Your 5 advisors (from first build)
        </h2>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          Matched to expertise and opportunity. Each session surfaces a recommendation tip above.
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
              {e.sessionTip && (
                <p className="mt-2 text-xs text-[var(--ink)]/55">Tip · {e.sessionTip}</p>
              )}
              <button
                type="button"
                className={`mt-3 border border-[var(--ink)]/15 ${hit}`}
                onClick={() =>
                  alert(`Intro requested with ${e.name} for “${spec.summary}” (demo).`)
                }
              >
                Ask advisor
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
