import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { buildMvpSpec, type DiscoveryAnswerMap } from "@/lib/venture/discovery";
import { recommendInfrastructure } from "@/lib/venture/infrastructure";
import { matchExperts, sessionAdvisorRecommendation } from "@/lib/venture/experts";
import { planBotJobs } from "@/lib/venture/bots";
import { createVentureFromIdea } from "@/lib/venture/blueprint";
import { collectGeoIndustryIntel } from "@/lib/venture/geo-intel";
import { buildGovApplications, regionQuickLinks } from "@/lib/venture/session";
import { COLOR_KITS, createBuildSession } from "@/lib/venture/build-session";
import {
  getPreferences,
  listVentures,
  saveLaunchPack,
  savePreferences,
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
  const geoIntel = collectGeoIndustryIntel(
    String(answers.geo || ""),
    industry.id,
    String(answers.idea),
  );
  const govApplications = buildGovApplications(geoIntel);
  const connections = recommendInfrastructure(spec);
  const experts = matchExperts(spec, industry.id, 5);
  const sessionAdvisor = sessionAdvisorRecommendation(experts, new Date().toDateString());

  let venture = createVentureFromIdea(String(answers.idea));
  venture.modules = Array.from(
    new Set([
      ...venture.modules,
      ...spec.recommendedModules.filter((m) =>
        [
          "website",
          "crm",
          "booking",
          "payments",
          "membership",
          "reviews",
          "analytics",
          "staff",
          "locations",
        ].includes(m),
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

  const preferredKit =
    industry.id === "edtech" || /kid|youth|academy/i.test(venture.name)
      ? "campus_sky"
      : undefined;
  const buildSession = createBuildSession(
    venture.name,
    spec.recommendedModules,
    sessionAdvisor.tip,
    preferredKit,
  );
  // persist brand from session kit
  const prefs = getPreferences(venture.id);
  prefs.brand = buildSession.brand;
  savePreferences(prefs);

  const botJobs = planBotJobs(venture.id, spec, connections);
  const pack = saveLaunchPack({
    ventureId: venture.id,
    answers,
    mvpSpec: spec,
    connections: connections.map((c) => ({ ...c, connected: false })),
    experts,
    botJobs,
    geoIntel: {
      ...geoIntel,
      quickLinks: regionQuickLinks(geoIntel.regionId),
    },
    govApplications,
    buildSession: {
      ...buildSession,
      colorKits: COLOR_KITS,
    },
    sessionAdvisor,
    updatedAt: new Date().toISOString(),
  });

  trackEvent(venture.id, "discovery_completed", {
    modules: spec.recommendedModules,
    constraint: spec.constraint,
    geo: geoIntel.regionId,
    industry: industry.id,
  });

  return NextResponse.json({
    venture,
    launchPack: pack,
    industry: industry.id,
  });
}
