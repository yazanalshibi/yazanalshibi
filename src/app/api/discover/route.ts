import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { buildMvpSpec, type DiscoveryAnswerMap } from "@/lib/venture/discovery";
import { recommendInfrastructure } from "@/lib/venture/infrastructure";
import { matchExperts } from "@/lib/venture/experts";
import { planBotJobs } from "@/lib/venture/bots";
import { createVentureFromIdea } from "@/lib/venture/blueprint";
import {
  listVentures,
  saveLaunchPack,
  saveService,
  saveVenture,
  trackEvent,
} from "@/lib/venture/store";
import { detectIndustry } from "@/lib/agent/industries";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const answers = (body as { answers?: DiscoveryAnswerMap }).answers;
  if (!answers || !answers.idea) {
    return NextResponse.json({ error: "answers.idea required" }, { status: 400 });
  }

  const spec = buildMvpSpec(answers);
  const industry = detectIndustry(String(answers.idea));
  const connections = recommendInfrastructure(spec);
  const experts = matchExperts(spec, industry.id, 5);

  let venture = createVentureFromIdea(String(answers.idea));
  // align modules with discovery
  venture.modules = Array.from(
    new Set([
      ...venture.modules,
      ...spec.recommendedModules.filter((m) =>
        ["website", "crm", "booking", "payments", "membership", "reviews", "analytics", "staff", "locations"].includes(m),
      ),
    ]),
  ) as typeof venture.modules;

  const existing = listVentures().map((v) => v.slug);
  if (existing.includes(venture.slug)) {
    venture.slug = `${venture.slug}-${venture.id.slice(0, 6)}`;
  }
  venture = saveVenture(venture);

  for (const offer of venture.blueprint.offers) {
    saveService({
      id: randomUUID(),
      ventureId: venture.id,
      name: offer.name,
      description: offer.description,
      price: offer.price,
      durationMinutes: 60,
      active: true,
    });
  }

  const botJobs = planBotJobs(venture.id, spec, connections);
  const pack = saveLaunchPack({
    ventureId: venture.id,
    answers,
    mvpSpec: spec,
    connections: connections.map((c) => ({ ...c, connected: false })),
    experts,
    botJobs,
    updatedAt: new Date().toISOString(),
  });

  trackEvent(venture.id, "discovery_completed", {
    modules: spec.recommendedModules,
    constraint: spec.constraint,
  });

  return NextResponse.json({ venture, launchPack: pack, industry: industry.id });
}
