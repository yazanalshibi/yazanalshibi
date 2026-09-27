import { NextResponse } from "next/server";
import { createVentureFromIdea } from "@/lib/venture/blueprint";
import { listVentures, saveVenture, trackEvent } from "@/lib/venture/store";
import { seedMobileDetailingDemo } from "@/lib/venture/seed";
import { randomUUID } from "node:crypto";
import { saveService } from "@/lib/venture/store";

export async function GET() {
  return NextResponse.json({ ventures: listVentures() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { idea, seedDemo } = body as { idea?: string; seedDemo?: boolean };

  if (seedDemo) {
    const venture = seedMobileDetailingDemo();
    return NextResponse.json({ venture });
  }

  if (!idea || !idea.trim()) {
    return NextResponse.json({ error: "idea required" }, { status: 400 });
  }

  let venture = createVentureFromIdea(idea.trim());
  // ensure unique slug
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

  trackEvent(venture.id, "venture_created", { idea: venture.idea });
  return NextResponse.json({ venture });
}
