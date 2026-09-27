import { randomUUID } from "node:crypto";
import type { UxSuggestion, VenturePreferences } from "./preferences";
import { listBehavior, savePreferences } from "./store";

function countByPath(ventureId: string) {
  const hits = listBehavior(ventureId);
  const counts: Record<string, number> = {};
  for (const h of hits) {
    const key = h.path || "unknown";
    counts[key] = (counts[key] || 0) + 1;
  }
  return { counts, total: hits.length, hits };
}

/** Analyze daily admin usage and suggest UI/UX enhancements */
export function refreshUxSuggestions(prefs: VenturePreferences): VenturePreferences {
  const { counts, total, hits } = countByPath(prefs.ventureId);
  const suggestions: UxSuggestion[] = [];
  const now = new Date().toISOString();

  const dash = counts["/dashboard"] || counts[""] || 0;
  const bookings = counts["/bookings"] || 0;
  const customers = counts["/customers"] || 0;
  const advisor = counts["/advisor"] || 0;
  const performance = counts["/performance"] || 0;
  const settings = counts["/settings"] || 0;
  const builder = counts["/builder"] || 0;

  if (total >= 5 && bookings > dash * 0.4 && bookings >= 3) {
    const widget = prefs.dashboard.find((w) => w.id === "bookings");
    if (widget && !widget.visible) {
      suggestions.push({
        id: randomUUID(),
        title: "Pin Bookings on your dashboard",
        body: "You visit Bookings often. Surfacing upcoming appointments on the home dashboard will cut navigation time.",
        actionLabel: "Show bookings widget",
        actionHref: "widget:bookings",
        basedOn: `${bookings} bookings visits in recent use`,
        createdAt: now,
      });
    }
  }

  if (total >= 5 && customers >= 3) {
    const widget = prefs.dashboard.find((w) => w.id === "leads");
    if (widget && !widget.visible) {
      suggestions.push({
        id: randomUUID(),
        title: "Keep Leads visible",
        body: "CRM is part of your daily loop. A leads strip on the dashboard helps you clear new inquiries faster.",
        actionLabel: "Show leads widget",
        actionHref: "widget:leads",
        basedOn: `${customers} CRM visits recently`,
        createdAt: now,
      });
    }
  }

  if (total >= 8 && advisor === 0 && prefs.insights.showAi) {
    suggestions.push({
      id: randomUUID(),
      title: "Try the AI Advisor this week",
      body: "You’re operating the venture but haven’t opened Advisor. A weekly check can surface retention or pricing moves from live data.",
      actionLabel: "Open AI Advisor",
      actionHref: `/os-advisor`,
      basedOn: "No advisor visits in recent sessions",
      createdAt: now,
    });
  }

  if (total >= 6 && performance === 0) {
    suggestions.push({
      id: randomUUID(),
      title: "Add a compact metrics row",
      body: "You rarely open Performance. Enabling compact metrics keeps conversion and revenue in view without an extra page.",
      actionLabel: "Use compact metrics",
      actionHref: "pref:compactMetrics",
      basedOn: "Performance page unused while dashboard is active",
      createdAt: now,
    });
  }

  if (total >= 4 && settings === 0) {
    suggestions.push({
      id: randomUUID(),
      title: "Set cloud share rules once",
      body: "Data is local-first by default. Review which categories can sync to the cloud mirror and for how long.",
      actionLabel: "Open privacy settings",
      actionHref: `/os-settings`,
      basedOn: "Settings not visited yet",
      createdAt: now,
    });
  }

  if (total >= 10 && builder >= 4) {
    suggestions.push({
      id: randomUUID(),
      title: "Brand tokens may need a pass",
      body: "Frequent builder edits often mean identity still feels off. Align colors and type in Brand Identity so pages inherit one system.",
      actionLabel: "Edit brand",
      actionHref: `/os-settings#brand`,
      basedOn: `${builder} builder sessions`,
      createdAt: now,
    });
  }

  // Density suggestion from rapid navigation
  const lastHour = hits.filter(
    (h) => Date.now() - new Date(h.createdAt).getTime() < 3600000,
  ).length;
  if (lastHour >= 12 && prefs.insights.density !== "compact") {
    suggestions.push({
      id: randomUUID(),
      title: "Switch to compact density",
      body: "High-frequency navigation in the last hour suggests you want more information density and less scrolling.",
      actionLabel: "Enable compact density",
      actionHref: "pref:densityCompact",
      basedOn: `${lastHour} actions in the last hour`,
      createdAt: now,
    });
  }

  // Keep dismissed suggestions out; merge with prior dismissed ids
  const dismissed = new Set(
    prefs.uxSuggestions.filter((s) => s.dismissed).map((s) => s.title),
  );
  prefs.uxSuggestions = [
    ...suggestions.filter((s) => !dismissed.has(s.title)),
    ...prefs.uxSuggestions.filter((s) => s.dismissed),
  ].slice(0, 8);

  return savePreferences(prefs);
}

export function applyUxAction(prefs: VenturePreferences, actionHref: string): VenturePreferences {
  if (actionHref === "widget:bookings") {
    prefs.dashboard = prefs.dashboard.map((w) =>
      w.id === "bookings" ? { ...w, visible: true, order: 1 } : w,
    );
  }
  if (actionHref === "widget:leads") {
    prefs.dashboard = prefs.dashboard.map((w) =>
      w.id === "leads" ? { ...w, visible: true } : w,
    );
  }
  if (actionHref === "pref:compactMetrics") {
    prefs.insights.compactMetrics = true;
  }
  if (actionHref === "pref:densityCompact") {
    prefs.insights.density = "compact";
  }
  return savePreferences(prefs);
}
