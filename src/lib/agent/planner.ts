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
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "mvp-project";
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

function detectTemplate(idea: string): ScaffoldTemplateId {
  const t = idea.toLowerCase();
  if (/\b(cli|command.?line|terminal|scaffold)\b/.test(t)) return "cli-tool";
  if (/\b(api|backend|webhook|service|microservice)\b/.test(t) && !/\b(ui|frontend|dashboard|app)\b/.test(t))
    return "api-service";
  if (/\b(waitlist|landing|marketing|launch|newsletter)\b/.test(t))
    return "landing-waitlist";
  return "web-saas";
}

function stackFor(template: ScaffoldTemplateId) {
  switch (template) {
    case "landing-waitlist":
      return {
        frontend: "Next.js + Tailwind",
        backend: "Next.js Route Handlers",
        data: "SQLite or Resend + JSON store",
        hosting: "Vercel",
      };
    case "api-service":
      return {
        frontend: "Minimal docs page",
        backend: "Next.js Route Handlers / Hono",
        data: "Postgres or SQLite",
        hosting: "Fly.io or Railway",
      };
    case "cli-tool":
      return {
        frontend: "n/a",
        backend: "Node.js TypeScript CLI",
        data: "Local filesystem + JSON config",
        hosting: "npm package",
      };
    default:
      return {
        frontend: "Next.js App Router + Tailwind",
        backend: "Next.js Route Handlers",
        data: "SQLite (local) → Postgres later",
        hosting: "Vercel",
      };
  }
}

export function buildMvpPlan(messages: ChatMessage[]): MvpPlan {
  const idea = extractIdea(messages) || "a focused product for early users";
  const name = guessName(idea);
  const template = detectTemplate(idea);
  const stack = stackFor(template);
  const slug = slugify(name);

  return {
    name,
    oneLiner: `${name} helps people get value from “${idea.slice(0, 80)}${idea.length > 80 ? "…" : ""}” with the smallest useful loop.`,
    problem: `People who care about this idea currently cobble together fragile workflows. ${name} replaces that with one guided path from intent to result.`,
    targetUser: "Early adopters who will tolerate rough edges if the core job is done in under 5 minutes.",
    coreLoop: "Describe intent → get a concrete plan → take one shippable action → review outcome → iterate.",
    features: [
      "Single primary flow that completes the core job",
      "Clear empty state with one suggested first action",
      "Save/share result of the first successful run",
      "Basic auth or email capture only if required for the loop",
      "Instrumentation for activation (first success) and drop-off",
    ],
    nonGoals: [
      "Multi-tenant admin suites",
      "Complex billing before retention is proven",
      "Mobile native apps",
      "Perfect design system polish",
    ],
    stack,
    milestones: [
      {
        title: "Day 0 — Spec lock",
        outcome: "One sentence problem, one user, three must-have features, written non-goals.",
      },
      {
        title: "Day 1 — Vertical slice",
        outcome: "Happy path works end-to-end with fake or local data.",
      },
      {
        title: "Day 2 — First outsider",
        outcome: "One real user completes the core loop without you in the room.",
      },
      {
        title: "Day 3 — Instrument + cut",
        outcome: "Track activation; remove anything that does not serve the loop.",
      },
    ],
    risks: [
      "Scope creep into adjacent features before activation",
      "Building auth/billing before proving the core loop",
      "Vague positioning that makes onboarding copy weak",
    ],
    scaffoldCommand: `npx mvp-specialist scaffold "${slug}" --template ${template} --idea "${idea.replace(/"/g, "'").slice(0, 120)}"`,
  };
}

export function formatPlanMarkdown(plan: MvpPlan): string {
  return [
    `# ${plan.name}`,
    "",
    plan.oneLiner,
    "",
    "## Problem",
    plan.problem,
    "",
    "## Target user",
    plan.targetUser,
    "",
    "## Core loop",
    plan.coreLoop,
    "",
    "## Must-have features",
    ...plan.features.map((f) => `- ${f}`),
    "",
    "## Non-goals",
    ...plan.nonGoals.map((f) => `- ${f}`),
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
    "## Scaffold locally",
    "```bash",
    plan.scaffoldCommand,
    "```",
    "",
    "Want me to tighten scope, swap the stack, or rewrite this for investors vs builders?",
  ].join("\n");
}

export const SYSTEM_PROMPT = `You are MVP Specialist — an AI agent that helps founders turn raw ideas into shippable MVPs.

Your job:
1. Clarify the problem and target user in plain language.
2. Cut scope ruthlessly — prefer a vertical slice over a platform.
3. Produce concrete plans: features, non-goals, stack, milestones, risks.
4. When useful, suggest the CLI scaffold command from this product.

Style: direct, specific, no fluff. Prefer numbered steps and short bullets.
If the user is vague, ask at most two sharp questions, then still draft a provisional plan.
Never invent fake metrics or fake user research.`;
