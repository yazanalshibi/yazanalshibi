import { NextResponse } from "next/server";
import { advanceBotJob, type BotJob } from "@/lib/venture/bots";
import {
  applyColorKit,
  COLOR_KITS,
  type PlugFeatureId,
  type VrMode,
} from "@/lib/venture/build-session";
import { sessionAdvisorRecommendation } from "@/lib/venture/experts";
import { recommendInfrastructure } from "@/lib/venture/infrastructure";
import { curriculumForIndustry } from "@/lib/venture/curriculum";
import { toolsForNextProjects, type ToolId } from "@/lib/venture/tools";
import { planBotJobs } from "@/lib/venture/bots";
import {
  getLaunchPack,
  getPreferences,
  getVenture,
  saveLaunchPack,
  savePreferences,
  saveVenture,
  trackEvent,
} from "@/lib/venture/store";
import type { BrandIdentity } from "@/lib/venture/preferences";
import { defaultPlugFeatures } from "@/lib/venture/build-session";

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
    toolId,
    forNextProjects,
  } = body as {
    action?:
      | "connect"
      | "run-job"
      | "run-ready"
      | "gov-status"
      | "toggle-feature"
      | "set-color"
      | "set-vr"
      | "refresh-advisor"
      | "refresh-tools"
      | "toggle-next-tool";
    connectionId?: string;
    jobId?: string;
    govId?: string;
    govStatus?: string;
    featureId?: PlugFeatureId;
    enabled?: boolean;
    colorKitId?: string;
    vr?: Partial<VrMode>;
    toolId?: ToolId;
    forNextProjects?: boolean;
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

  if (action === "refresh-tools") {
    const connected = new Set(
      pack.connections.filter((c) => c.connected).map((c) => c.id),
    );
    const recommended = recommendInfrastructure(
      pack.mvpSpec as Parameters<typeof recommendInfrastructure>[0],
      venture.blueprint.industryId,
      venture.idea,
    );
    pack.connections = recommended.map((c) => ({
      ...c,
      connected: connected.has(c.id),
      connectedAt: pack.connections.find((x) => x.id === c.id)?.connectedAt,
    }));
    // queue bot jobs for newly recommended tools not already in jobs
    const existingTasks = new Set(pack.botJobs.map((j) => j.task));
    const extra = planBotJobs(venture.id, pack.mvpSpec as Parameters<typeof planBotJobs>[1], recommended)
      .filter((j) => j.connectionId && !existingTasks.has(j.task) && !connected.has(j.connectionId));
    pack.botJobs = [...pack.botJobs, ...extra];
    if (!pack.curriculum) {
      pack.curriculum =
        curriculumForIndustry(venture.blueprint.industryId || "", venture.idea) || undefined;
    }
    // merge plug features for new modules; auto-enable learning stack for edtech
    const moduleSet = new Set(venture.modules as string[]);
    if (venture.blueprint.industryId === "edtech") {
      for (const m of ["classes", "messaging", "video", "consent"] as const) {
        if (!moduleSet.has(m)) {
          moduleSet.add(m);
          venture.modules = [...venture.modules, m];
        }
      }
      saveVenture(venture);
    }
    if (session.features) {
      const ids = new Set(session.features.map((f) => f.id));
      for (const f of defaultPlugFeatures([...moduleSet])) {
        if (!ids.has(f.id)) session.features.push(f);
      }
      const enable = new Set(["classes", "messaging", "video", "consent"]);
      session.features = session.features.map((x) =>
        enable.has(x.id) && moduleSet.has(x.id) ? { ...x, enabled: true } : x,
      );
      pack.buildSession = session;
    }
    pack.nextProjectTools = toolsForNextProjects(pack.connections);
    trackEvent(venture.id, "tools_refreshed", {
      count: pack.connections.length,
      next: pack.nextProjectTools,
    });
  }

  if (action === "toggle-next-tool" && toolId) {
    pack.connections = pack.connections.map((c) =>
      c.id === toolId ? { ...c, forNextProjects: !!forNextProjects } : c,
    );
    pack.nextProjectTools = toolsForNextProjects(pack.connections);
    trackEvent(venture.id, "next_project_tool_toggled", {
      toolId,
      forNextProjects: !!forNextProjects,
    });
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
