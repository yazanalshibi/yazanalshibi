import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent/run";
import type { ChatMessage } from "@/lib/agent/types";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages, industryId } = body as {
    messages?: ChatMessage[];
    industryId?: string | null;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const cleaned = messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-20);

  if (cleaned.length === 0) {
    return NextResponse.json({ error: "no valid messages" }, { status: 400 });
  }

  const reply = await runAgent(cleaned, industryId);
  return NextResponse.json(reply);
}
