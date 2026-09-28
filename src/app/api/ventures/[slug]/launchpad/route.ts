import { NextResponse } from "next/server";
import { advanceBotJob, type BotJob } from "@/lib/venture/bots";
import {
  applyColorKit,
  COLOR_KITS,
  type PlugFeatureId,
  type VrMode,
} from "@/lib/venture/build-session";
import { sessionAdvisorRecommendation } from "@/lib/venture/experts";
import {
  getLaunchPack,
  getPreferences,
  getVenture,
  saveLaunchPack,
  savePreferences,
  trackEvent,
} from "@/lib/venture/store";
import type { BrandIdentity } from "@/lib/venture/preferences";

type Ctx = { params: Promise<{ slug: string }> };

type SessionShape = {
  features: { id: string; name: string; blurb: string; enabled: boolean }[];
  colorKitId: string;
  colorKits: typeof COLOR_KITS;
  brand: BrandIdentity;
  vr: VrMode;
  sessionAdvisorTip: string;
};

function asBotJob(
  j: {
    id: string;
    task: string;
    label: string;
    status: string;
    log: string[];
    connectionId?: string;
    createdAt: string;
    updatedAt: string;
  },
  ventureId: string,
): BotJob {
  return {
    ...j,
    ventureId,
    status: j.status as BotJob["status"],
  };
}

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });
  const pack = getLaunchPack(venture.id);
  if (!pack) return NextResponse.json({ error: "no launch pack — run discovery" }, { status: 404 });

  // Refresh session advisor tip each GET (daily rotation)
  if (pack.experts?.length) {
    pack.sessionAdvisor = sessionAdvisorRecommendation(
      pack.experts.map((e) => ({ ...e, specialties: [], industries: [], milestones: [] })),
      `${venture.id}:${new Date().toDateString()}`,
    );
  }
  return NextResponse.json({ venture, launchPack: pack });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });
  const pack = getLaunchPack(venture.id);
  if (!pack) return NextResponse.json({ error: "no launch pack" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const {
    action,
    connectionId,
    jobId,
    govId,
    govStatus,
    featureId,
    enabled,
    colorKitId,
    vr,
  } = body as {
    action?:
      | "connect"
      | "run-job"
      | "run-ready"
      | "gov-status"
      | "toggle-feature"
      | "set-color"
      | "set-vr"
      | "refresh-advisor";
    connectionId?: string;
    jobId?: string;
    govId?: string;
    govStatus?: string;
    featureId?: PlugFeatureId;
    enabled?: boolean;
    colorKitId?: string;
    vr?: Partial<VrMode>;
  };

  const session = (pack.buildSession || {}) as SessionShape;

  if (action === "connect" && connectionId) {
    pack.connections = pack.connections.map((c) =>
      c.id === connectionId
        ? { ...c, connected: true, connectedAt: new Date().toISOString() }
        : c,
    );
    pack.botJobs = pack.botJobs.map((j) => {
      if (j.connectionId === connectionId && (j.status === "queued" || j.status === "blocked")) {
        return advanceBotJob(asBotJob(j, venture.id), true);
      }
      return j;
    });
    trackEvent(venture.id, "infra_connected", { connectionId });
  }

  if (action === "run-job" && jobId) {
    pack.botJobs = pack.botJobs.map((j) => {
      if (j.id !== jobId) return j;
      const conn = pack.connections.find((c) => c.id === j.connectionId);
      const connected = !j.connectionId || !!conn?.connected;
      return advanceBotJob(asBotJob(j, venture.id), connected);
    });
  }

  if (action === "run-ready") {
    pack.botJobs = pack.botJobs.map((j) => {
      if (j.status === "done") return j;
      const conn = pack.connections.find((c) => c.id === j.connectionId);
      const connected = !j.connectionId || !!conn?.connected;
      if (j.connectionId && !connected) {
        return advanceBotJob(asBotJob(j, venture.id), false);
      }
      return advanceBotJob(asBotJob(j, venture.id), true);
    });
  }

  if (action === "gov-status" && govId && govStatus && pack.govApplications) {
    pack.govApplications = pack.govApplications.map((g) =>
      g.id === govId ? { ...g, status: govStatus } : g,
    );
    trackEvent(venture.id, "gov_application_updated", { govId, govStatus });
  }

  if (action === "toggle-feature" && featureId && session.features) {
    session.features = session.features.map((f) =>
      f.id === featureId ? { ...f, enabled: !!enabled } : f,
    );
    if (featureId === "vr_storefront" && enabled) {
      session.vr = {
        ...session.vr,
        enabled: true,
        target: "meta_glasses",
        largeTargets: true,
        spatialNav: true,
      };
    }
    pack.buildSession = session;
    trackEvent(venture.id, "feature_toggled", { featureId, enabled: !!enabled });
  }

  if (action === "set-color" && colorKitId) {
    const kit = COLOR_KITS.find((k) => k.id === colorKitId) || COLOR_KITS[0];
    session.colorKitId = kit.id;
    session.brand = applyColorKit(session.brand || getPreferences(venture.id).brand, kit);
    pack.buildSession = session;
    const prefs = getPreferences(venture.id);
    prefs.brand = session.brand;
    savePreferences(prefs);
    trackEvent(venture.id, "color_kit_applied", { colorKitId });
  }

  if (action === "set-vr" && vr) {
    session.vr = { ...session.vr, ...vr };
    if (session.vr.enabled) {
      session.features = session.features.map((f) =>
        f.id === "vr_storefront" ? { ...f, enabled: true } : f,
      );
    }
    pack.buildSession = session;
    trackEvent(venture.id, "vr_mode_updated", { ...session.vr });
  }

  if (action === "refresh-advisor" || !pack.sessionAdvisor) {
    pack.sessionAdvisor = sessionAdvisorRecommendation(
      pack.experts.map((e) => ({
        ...e,
        specialties: [],
        industries: [],
        milestones: [],
        sessionTip: e.sessionTip,
      })),
      `${venture.id}:${Date.now()}`,
    );
  }

  saveLaunchPack(pack);
  return NextResponse.json({ launchPack: pack });
}
