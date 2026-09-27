import { NextResponse } from "next/server";
import { buildTrainingCorpus, listIndustries } from "@/lib/agent/industries";

/** Export industry training corpus (JSONL-friendly JSON array) for fine-tuning / evals */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "json";
  const corpus = buildTrainingCorpus();

  if (format === "jsonl") {
    const body = corpus.map((row) => JSON.stringify(row)).join("\n") + "\n";
    return new NextResponse(body, {
      headers: {
        "content-type": "application/x-ndjson; charset=utf-8",
        "content-disposition": 'attachment; filename="mvp-specialist-training.jsonl"',
      },
    });
  }

  return NextResponse.json({
    version: 1,
    industries: listIndustries().map((p) => p.id),
    count: corpus.length,
    corpus,
  });
}
