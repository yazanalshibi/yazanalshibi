import {
  buildIndustryCurriculumPrompt,
  detectIndustry,
  getIndustry,
  type IndustryId,
  type IndustryPack,
} from "./industries";
import type { ChatMessage, MvpPlan, ScaffoldTemplateId } from "./types";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "for",
  "to",
  "of",
  "in",
  "on",
  "with",
  "that",
  "this",
  "my",
  "our",
  "app",
  "build",
  "make",
  "create",
  "want",
  "need",
  "help",
  "me",
  "i",
  "is",
  "are",
  "be",
  "as",
  "from",
  "by",
  "it",
  "its",
  "into",
  "using",
  "like",
]);

function titleCase(words: string[]): string {
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "mvp-project"
  );
}

function extractIdea(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  return (lastUser?.content || "").trim();
}

function guessName(idea: string): string {
  const cleaned = idea
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()))
    .slice(0, 3);
  if (cleaned.length === 0) return "Signal MVP";
  return titleCase(cleaned);
}

function detectTemplate(idea: string, pack: IndustryPack): ScaffoldTemplateId {
  const t = idea.toLowerCase();
  if (/\b(cli|command.?line|terminal|scaffold)\b/.test(t)) return "cli-tool";
  if (
    /\b(api|backend|webhook|service|microservice)\b/.test(t) &&
    !/\b(ui|frontend|dashboard|app)\b/.test(t)
  )
    return "api-service";
  if (/\b(waitlist|landing|marketing|launch|newsletter)\b/.test(t))
    return "landing-waitlist";
  return pack.preferredTemplate;
}

function applyTrainingCut(idea: string, pack: IndustryPack): string {
  const lower = idea.toLowerCase();
  for (const ex of pack.examples) {
    const tokens = ex.idea
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);
    const hits = tokens.filter((tok) => lower.includes(tok)).length;
    if (hits >= Math.min(2, tokens.length)) {
      return `${ex.cut} (trained rewrite from “${ex.idea}”-style ambition)`;
    }
  }
  return pack.mvpShapes[0];
}

export function resolveIndustry(
  idea: string,
  industryId?: IndustryId | string | null,
): IndustryPack {
  return getIndustry(industryId) ?? detectIndustry(idea);
}

export function buildMvpPlan(
  messages: ChatMessage[],
  industryId?: IndustryId | string | null,
): MvpPlan {
  const idea = extractIdea(messages) || "a focused product for early users";
  const pack = resolveIndustry(idea, industryId);
  const name = guessName(idea);
  const template = detectTemplate(idea, pack);
  const stack = pack.stackHints;
  const slug = slugify(name);
  const trainedCut = applyTrainingCut(idea, pack);

  return {
    name,
    industryId: pack.id,
    industryName: pack.name,
    oneLiner: `${name} (${pack.name}) ships “${trainedCut}” for: ${idea.slice(0, 72)}${idea.length > 72 ? "…" : ""}`,
    problem: `${pack.whyMvp} Immediate pain patterns in-market: ${pack.painPatterns.slice(0, 2).join("; ")}.`,
    targetUser: pack.buyer,
    coreLoop: trainedCut,
    features: pack.mustHaves,
    nonGoals: pack.nonGoals,
    constraints: pack.constraints,
    stack,
    milestones: pack.milestones,
    risks: pack.risks,
    discoveryQuestions: [...pack.discoveryQuestions],
    scaffoldCommand: `npx mvp-specialist scaffold "${slug}" --template ${template} --industry ${pack.id} --idea "${idea.replace(/"/g, "'").slice(0, 120)}"`,
  };
}

export function formatPlanMarkdown(plan: MvpPlan): string {
  return [
    `# ${plan.name}`,
    "",
    `**Industry:** ${plan.industryName}`,
    "",
    plan.oneLiner,
    "",
    "## Problem (industry lens)",
    plan.problem,
    "",
    "## Target user",
    plan.targetUser,
    "",
    "## Core MVP cut",
    plan.coreLoop,
    "",
    "## Must-have features",
    ...plan.features.map((f) => `- ${f}`),
    "",
    "## Non-goals",
    ...plan.nonGoals.map((f) => `- ${f}`),
    "",
    "## Industry constraints",
    ...plan.constraints.map((f) => `- ${f}`),
    "",
    "## Suggested stack",
    `- Frontend: ${plan.stack.frontend}`,
    `- Backend: ${plan.stack.backend}`,
    `- Data: ${plan.stack.data}`,
    `- Hosting: ${plan.stack.hosting}`,
    "",
    "## Milestones",
    ...plan.milestones.map((m) => `- **${m.title}**: ${m.outcome}`),
    "",
    "## Risks",
    ...plan.risks.map((r) => `- ${r}`),
    "",
    "## Still unclear? Ask",
    ...plan.discoveryQuestions.map((q) => `- ${q}`),
    "",
    "## Scaffold locally",
    "```bash",
    plan.scaffoldCommand,
    "```",
    "",
    "Want a tighter cut for a sub-niche, or switch industry playbook?",
  ].join("\n");
}

export function buildSystemPrompt(pack?: IndustryPack | null): string {
  return `You are MVP Specialist — an AI agent trained to build shippable MVPs by industry.

Your job:
1. Detect or accept the industry playbook.
2. Clarify buyer + weekly pain in plain language.
3. Cut empire ideas into the industry's winning MVP shapes.
4. Produce features, non-goals, constraints, stack, milestones, risks.
5. Suggest the CLI scaffold command with --industry when useful.

Style: direct, specific, no fluff. Prefer numbered steps and short bullets.
If the user is vague, ask at most two sharp questions from the industry pack, then still draft a provisional plan.
Never invent fake metrics or fake user research.
Never ignore industry constraints (PHI, money custody, legal advice, marketplace liquidity, etc.).

${buildIndustryCurriculumPrompt(pack)}`;
}

/** @deprecated use buildSystemPrompt */
export const SYSTEM_PROMPT = buildSystemPrompt();
