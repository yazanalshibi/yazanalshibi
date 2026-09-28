import { NextResponse } from "next/server";
import { listIndustries } from "@/lib/agent/industries";

export async function GET() {
  return NextResponse.json({
    industries: listIndustries().map((p) => ({
      id: p.id,
      name: p.name,
      blurb: p.blurb,
      whyMvp: p.whyMvp,
      mvpShapes: p.mvpShapes,
      examples: p.examples,
    })),
  });
}
