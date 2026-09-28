import { NextResponse } from "next/server";
import { generateScaffold, listTemplates } from "@/lib/agent/scaffold";
import type { ScaffoldTemplateId } from "@/lib/agent/types";

export async function GET() {
  return NextResponse.json({ templates: listTemplates() });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, idea, template } = body as {
    name?: string;
    idea?: string;
    template?: ScaffoldTemplateId;
  };

  if (!name || !template) {
    return NextResponse.json(
      { error: "name and template are required" },
      { status: 400 },
    );
  }

  const valid = listTemplates().some((t) => t.id === template);
  if (!valid) {
    return NextResponse.json({ error: "unknown template" }, { status: 400 });
  }

  const files = generateScaffold({
    name,
    idea: idea || "",
    template,
  });

  return NextResponse.json({ files });
}
