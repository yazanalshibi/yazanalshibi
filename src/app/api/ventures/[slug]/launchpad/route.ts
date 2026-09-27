import { NextResponse } from "next/server";
import { advanceBotJob, type BotJob } from "@/lib/venture/bots";
import {
  getLaunchPack,
  getVenture,
  saveLaunchPack,
  trackEvent,
} from "@/lib/venture/store";

type Ctx = { params: Promise<{ slug: string }> };

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
  return NextResponse.json({ venture, launchPack: pack });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });
  const pack = getLaunchPack(venture.id);
  if (!pack) return NextResponse.json({ error: "no launch pack" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { action, connectionId, jobId } = body as {
    action?: "connect" | "run-job" | "run-ready";
    connectionId?: string;
    jobId?: string;
  };

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
    saveLaunchPack(pack);
    return NextResponse.json({ launchPack: pack });
  }

  if (action === "run-job" && jobId) {
    pack.botJobs = pack.botJobs.map((j) => {
      if (j.id !== jobId) return j;
      const conn = pack.connections.find((c) => c.id === j.connectionId);
      const connected = !j.connectionId || !!conn?.connected;
      return advanceBotJob(asBotJob(j, venture.id), connected);
    });
    saveLaunchPack(pack);
    return NextResponse.json({ launchPack: pack });
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
    saveLaunchPack(pack);
    return NextResponse.json({ launchPack: pack });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
