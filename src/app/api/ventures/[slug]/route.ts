import { NextResponse } from "next/server";
import {
  getVenture,
  saveVenture,
  trackEvent,
} from "@/lib/venture/store";
import type { ModuleId } from "@/lib/venture/types";
import { generateAdvisorInsight } from "@/lib/venture/advisor";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ venture });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { modules, live, stage, pages, action } = body as {
    modules?: ModuleId[];
    live?: boolean;
    stage?: typeof venture.stage;
    pages?: typeof venture.pages;
    action?: "launch" | "advise";
  };

  if (modules) venture.modules = modules;
  if (pages) venture.pages = pages;
  if (stage) venture.stage = stage;

  if (action === "launch" || live === true) {
    venture.live = true;
    venture.stage = "live";
    trackEvent(venture.id, "venture_launched", {});
  }

  venture.updatedAt = new Date().toISOString();
  saveVenture(venture);

  if (action === "advise") {
    const recommendation = generateAdvisorInsight(venture);
    return NextResponse.json({ venture, recommendation });
  }

  return NextResponse.json({ venture });
}
