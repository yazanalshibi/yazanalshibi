import { INDUSTRY_PACKS } from "./packs";
import type { IndustryId, IndustryPack } from "./types";

export type { IndustryId, IndustryPack, IndustryExample } from "./types";
export { INDUSTRY_PACKS } from "./packs";

export function listIndustries(): IndustryPack[] {
  return INDUSTRY_PACKS;
}

export function getIndustry(id: IndustryId | string | null | undefined): IndustryPack | null {
  if (!id) return null;
  return INDUSTRY_PACKS.find((p) => p.id === id) ?? null;
}

export function detectIndustry(text: string): IndustryPack {
  const t = text.toLowerCase();
  let best: IndustryPack = INDUSTRY_PACKS.find((p) => p.id === "b2b-saas")!;
  let bestScore = 0;

  for (const pack of INDUSTRY_PACKS) {
    let score = 0;
    for (const kw of pack.keywords) {
      if (t.includes(kw)) score += kw.includes(" ") ? 3 : 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = pack;
    }
  }

  return best;
}

/** Compact curriculum injected into LLM system prompts */
export function buildIndustryCurriculumPrompt(pack?: IndustryPack | null): string {
  const focus = pack
    ? [
        `Active industry: ${pack.name} (${pack.id})`,
        `Why MVPs matter here: ${pack.whyMvp}`,
        `Buyer: ${pack.buyer}`,
        `Preferred MVP shapes: ${pack.mvpShapes.join("; ")}`,
        `Must-haves: ${pack.mustHaves.join("; ")}`,
        `Non-goals: ${pack.nonGoals.join("; ")}`,
        `Constraints: ${pack.constraints.join("; ")}`,
        `Training examples:`,
        ...pack.examples.map(
          (ex) => `- Idea “${ex.idea}” → Cut to “${ex.cut}” (${ex.why})`,
        ),
      ].join("\n")
    : "Detect the industry from the user's idea, then apply the matching vertical playbook.";

  const catalog = INDUSTRY_PACKS.map(
    (p) => `- ${p.id}: ${p.name} — ${p.blurb}`,
  ).join("\n");

  return `## Industry MVP training

You are trained to cut MVPs differently by industry. Never ship generic SaaS advice when a vertical pack fits.

Industries you know:
${catalog}

Universal method (all industries):
1. Name the buyer and the weekly pain.
2. Pick one MVP shape from the industry pack — not a platform.
3. Write must-haves and non-goals from the pack, adapted to the idea.
4. Respect industry constraints (compliance, custody, liquidity, etc.).
5. Give 4-day milestones and a scaffold command.
6. If the idea is empire-sized, rewrite it using a training example pattern (idea → cut).

${focus}`;
}

/** Fine-tuning / eval style rows derived from packs */
export function buildTrainingCorpus(): {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  meta: { industry: IndustryId; kind: string };
}[] {
  const rows: {
    messages: { role: "system" | "user" | "assistant"; content: string }[];
    meta: { industry: IndustryId; kind: string };
  }[] = [];

  for (const pack of INDUSTRY_PACKS) {
    for (const ex of pack.examples) {
      rows.push({
        meta: { industry: pack.id, kind: "rewrite-cut" },
        messages: [
          {
            role: "system",
            content: `You are MVP Specialist trained on ${pack.name}. Cut empire ideas into shippable MVPs.`,
          },
          {
            role: "user",
            content: `Industry: ${pack.name}\nIdea: ${ex.idea}\nRewrite into a shippable MVP cut.`,
          },
          {
            role: "assistant",
            content: [
              `MVP cut: ${ex.cut}`,
              `Why: ${ex.why}`,
              `Buyer: ${pack.buyer}`,
              `Must-haves:`,
              ...pack.mustHaves.map((m) => `- ${m}`),
              `Non-goals:`,
              ...pack.nonGoals.map((m) => `- ${m}`),
            ].join("\n"),
          },
        ],
      });
    }

    rows.push({
      meta: { industry: pack.id, kind: "playbook" },
      messages: [
        {
          role: "system",
          content: `You are MVP Specialist. Teach how to build an MVP in ${pack.name}.`,
        },
        {
          role: "user",
          content: `How should I build an MVP in ${pack.name}?`,
        },
        {
          role: "assistant",
          content: [
            `# ${pack.name} MVP playbook`,
            pack.whyMvp,
            "",
            `## Buyer`,
            pack.buyer,
            "",
            `## Winning MVP shapes`,
            ...pack.mvpShapes.map((s) => `- ${s}`),
            "",
            `## Must-haves`,
            ...pack.mustHaves.map((s) => `- ${s}`),
            "",
            `## Non-goals`,
            ...pack.nonGoals.map((s) => `- ${s}`),
            "",
            `## Constraints`,
            ...pack.constraints.map((s) => `- ${s}`),
            "",
            `## Discovery questions`,
            ...pack.discoveryQuestions.map((s) => `- ${s}`),
          ].join("\n"),
        },
      ],
    });
  }

  return rows;
}
