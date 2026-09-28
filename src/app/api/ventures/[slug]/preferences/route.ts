import { NextResponse } from "next/server";
import { getVenture, getPreferences, savePreferences, trackBehavior } from "@/lib/venture/store";
import { cloudStatus, syncCloudShare } from "@/lib/venture/privacy";
import { applyUxAction, refreshUxSuggestions } from "@/lib/venture/ux";
import type { CloudShareRule, DashboardWidgetPref, InsightPref, BrandIdentity } from "@/lib/venture/preferences";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });
  const preferences = getPreferences(venture.id);
  return NextResponse.json({
    preferences,
    cloud: cloudStatus(venture.id),
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  let prefs = getPreferences(venture.id);

  const {
    brand,
    dashboard,
    insights,
    cloudShare,
    action,
    behavior,
    dismissSuggestionId,
    uxAction,
  } = body as {
    brand?: BrandIdentity;
    dashboard?: DashboardWidgetPref[];
    insights?: Partial<InsightPref>;
    cloudShare?: CloudShareRule[];
    action?: "sync-cloud" | "refresh-ux" | "purge-cloud";
    behavior?: { path: string; action: string; meta?: Record<string, unknown> };
    dismissSuggestionId?: string;
    uxAction?: string;
  };

  if (behavior?.path) {
    trackBehavior(venture.id, behavior.path, behavior.action || "view", behavior.meta);
  }

  if (brand) prefs.brand = { ...prefs.brand, ...brand };
  if (dashboard) prefs.dashboard = dashboard;
  if (insights) prefs.insights = { ...prefs.insights, ...insights };
  if (cloudShare) prefs.cloudShare = cloudShare;

  prefs = savePreferences(prefs);

  if (dismissSuggestionId) {
    prefs.uxSuggestions = prefs.uxSuggestions.map((s) =>
      s.id === dismissSuggestionId ? { ...s, dismissed: true } : s,
    );
    prefs = savePreferences(prefs);
  }

  if (uxAction) {
    prefs = applyUxAction(getPreferences(venture.id), uxAction);
  }

  if (action === "refresh-ux") {
    prefs = refreshUxSuggestions(prefs);
  }

  if (action === "sync-cloud") {
    const sync = syncCloudShare(venture, prefs);
    return NextResponse.json({ preferences: prefs, sync, cloud: cloudStatus(venture.id) });
  }

  if (action === "purge-cloud") {
    const { purgeExpiredCloudMirrors, replaceCloudMirrors } = await import("@/lib/venture/store");
    replaceCloudMirrors(venture.id, []);
    purgeExpiredCloudMirrors();
    return NextResponse.json({ preferences: prefs, cloud: cloudStatus(venture.id) });
  }

  return NextResponse.json({ preferences: prefs, cloud: cloudStatus(venture.id) });
}
