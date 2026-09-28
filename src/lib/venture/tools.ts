/**
 * Shared tool registry — recommended for the current venture and carried
 * forward so the next project starts with a proven toolbox.
 */

import type { MvpSpec } from "./discovery";

export type ToolCategory =
  | "identity"
  | "payments"
  | "comms"
  | "learning"
  | "ops"
  | "growth"
  | "compliance"
  | "platform";

export type ToolId =
  | "domain"
  | "payments"
  | "ecommerce"
  | "google"
  | "email"
  | "analytics"
  | "hosting"
  | "calendar"
  | "video"
  | "sms"
  | "storage"
  | "parent_consent"
  | "ai_content"
  | "community"
  | "docs";

export type PlatformTool = {
  id: ToolId;
  name: string;
  category: ToolCategory;
  blurb: string;
  setupMinutes: number;
  connectUrl: string;
  docsHint: string;
  botTask: string;
  /** Industries that strongly benefit (empty = universal) */
  industries: string[];
  /** Discovery / MVP signals that pull this tool in */
  signals: string[];
  /** Carry into every next project once proven */
  defaultForNextProjects: boolean;
};

export const TOOL_REGISTRY: PlatformTool[] = [
  {
    id: "domain",
    name: "Custom domain",
    category: "identity",
    blurb: "Brand-owned URL for trust and ads.",
    setupMinutes: 5,
    connectUrl: "https://domains.google/",
    docsHint: "Point DNS A/CNAME to Live Venture OS hosting.",
    botTask: "provision_domain_dns",
    industries: [],
    signals: ["domain", "website"],
    defaultForNextProjects: true,
  },
  {
    id: "hosting",
    name: "Hosting & SSL",
    category: "platform",
    blurb: "Live venture URL with HTTPS (Cloudflare Workers / platform).",
    setupMinutes: 2,
    connectUrl: "/create",
    docsHint: "Included with Live Venture OS — auto SSL on publish.",
    botTask: "ensure_hosting",
    industries: [],
    signals: [],
    defaultForNextProjects: true,
  },
  {
    id: "payments",
    name: "Payment processing",
    category: "payments",
    blurb: "Checkout, deposits, and subscriptions (Stripe).",
    setupMinutes: 8,
    connectUrl: "https://dashboard.stripe.com/register",
    docsHint: "Connect Stripe keys; bot wires checkout + webhooks.",
    botTask: "connect_stripe",
    industries: [],
    signals: ["payments", "subscription", "booking_deposit"],
    defaultForNextProjects: true,
  },
  {
    id: "email",
    name: "Transactional email",
    category: "comms",
    blurb: "Confirmations, receipts, parent updates (Resend).",
    setupMinutes: 5,
    connectUrl: "https://resend.com/signup",
    docsHint: "Verify sending domain; templates attach to events.",
    botTask: "connect_email",
    industries: [],
    signals: ["email"],
    defaultForNextProjects: true,
  },
  {
    id: "sms",
    name: "SMS / WhatsApp alerts",
    category: "comms",
    blurb: "Class reminders and no-show nudges to parents.",
    setupMinutes: 10,
    connectUrl: "https://www.twilio.com/try-twilio",
    docsHint: "Parent opt-in required; kid numbers never collected in v1.",
    botTask: "connect_sms",
    industries: ["edtech", "local-services", "healthtech"],
    signals: ["booking", "appointment", "local_service"],
    defaultForNextProjects: true,
  },
  {
    id: "google",
    name: "Google account / Workspace",
    category: "identity",
    blurb: "Login, Calendar, Gmail, Drive for ops.",
    setupMinutes: 4,
    connectUrl: "https://console.cloud.google.com/apis/credentials",
    docsHint: "OAuth for Google sign-in + Calendar sync.",
    botTask: "connect_google_oauth",
    industries: [],
    signals: ["google"],
    defaultForNextProjects: true,
  },
  {
    id: "calendar",
    name: "Class / booking calendar",
    category: "ops",
    blurb: "Live class slots and mentor availability.",
    setupMinutes: 6,
    connectUrl: "https://calendar.google.com/",
    docsHint: "Sync trial classes and cohort sessions to Calendar.",
    botTask: "connect_calendar",
    industries: ["edtech", "local-services", "healthtech"],
    signals: ["booking", "appointment"],
    defaultForNextProjects: true,
  },
  {
    id: "video",
    name: "Live video classroom",
    category: "learning",
    blurb: "Zoom / Google Meet links for live clubs and trials.",
    setupMinutes: 7,
    connectUrl: "https://zoom.us/signup",
    docsHint: "Auto-attach meeting links to booked classes.",
    botTask: "connect_video",
    industries: ["edtech", "b2b-saas"],
    signals: ["appointment", "digital", "hybrid"],
    defaultForNextProjects: true,
  },
  {
    id: "storage",
    name: "Lesson & asset storage",
    category: "learning",
    blurb: "Curriculum PDFs, kid worksheets, mentor guides (R2 / Drive).",
    setupMinutes: 5,
    connectUrl: "https://dash.cloudflare.com/",
    docsHint: "Store lesson packs; parents download via signed links.",
    botTask: "connect_storage",
    industries: ["edtech", "ecommerce"],
    signals: ["digital", "ecommerce"],
    defaultForNextProjects: true,
  },
  {
    id: "parent_consent",
    name: "Parental consent & youth privacy",
    category: "compliance",
    blurb: "COPPA-aware consent flow — parent is the account holder.",
    setupMinutes: 12,
    connectUrl: "https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa",
    docsHint: "Wire consent checkbox + policy before any under-13 profiles.",
    botTask: "setup_parent_consent",
    industries: ["edtech"],
    signals: ["compliance", "kid", "youth"],
    defaultForNextProjects: false,
  },
  {
    id: "ai_content",
    name: "AI lesson / copy assistant",
    category: "learning",
    blurb: "Draft mini-venture prompts and parent emails faster.",
    setupMinutes: 3,
    connectUrl: "/agent",
    docsHint: "Uses Live Venture OS agent + industry playbooks.",
    botTask: "enable_ai_content",
    industries: ["edtech", "b2b-saas", "ecommerce"],
    signals: ["skills", "speed"],
    defaultForNextProjects: true,
  },
  {
    id: "docs",
    name: "Curriculum docs workspace",
    category: "ops",
    blurb: "Notion / Docs for lesson plans mentors can edit.",
    setupMinutes: 5,
    connectUrl: "https://www.notion.so/",
    docsHint: "Link cohort sprint outline; bot can mirror titles into OS.",
    botTask: "connect_docs",
    industries: ["edtech", "b2b-saas"],
    signals: [],
    defaultForNextProjects: true,
  },
  {
    id: "community",
    name: "Parent / mentor community",
    category: "growth",
    blurb: "Lightweight Discord or Slack for office hours.",
    setupMinutes: 8,
    connectUrl: "https://discord.com/",
    docsHint: "Optional after first cohort — not required for MVP.",
    botTask: "connect_community",
    industries: ["edtech", "local-services"],
    signals: ["partners", "instagram"],
    defaultForNextProjects: false,
  },
  {
    id: "analytics",
    name: "Analytics & tags",
    category: "growth",
    blurb: "Funnel events for Venture Health + AI Advisor.",
    setupMinutes: 3,
    connectUrl: "https://analytics.google.com/",
    docsHint: "Native events tracked; GA4 optional overlay.",
    botTask: "connect_analytics",
    industries: [],
    signals: [],
    defaultForNextProjects: true,
  },
  {
    id: "ecommerce",
    name: "E-commerce catalog",
    category: "payments",
    blurb: "Products, variants, cart for physical or digital goods.",
    setupMinutes: 10,
    connectUrl: "https://www.shopify.com/",
    docsHint: "Or use native Live Venture catalog.",
    botTask: "connect_commerce",
    industries: ["ecommerce"],
    signals: ["ecommerce", "shipped"],
    defaultForNextProjects: false,
  },
];

export type RecommendedTool = PlatformTool & {
  status: "required" | "recommended" | "optional";
  why: string;
  forNextProjects: boolean;
};

export function recommendTools(
  spec: MvpSpec,
  industryId?: string,
  ideaHint?: string,
): RecommendedTool[] {
  const needs = new Set(spec.mustHaves);
  const signals = new Set<string>([
    ...spec.mustHaves,
    spec.fulfillment,
    spec.constraint,
    ...spec.channels,
  ]);
  // monetization / offer cues
  if (spec.monetization.toLowerCase().includes("subscription")) signals.add("subscription");
  if (spec.monetization.toLowerCase().includes("deposit")) signals.add("booking_deposit");
  if (spec.monetization.toLowerCase().includes("pay")) signals.add("payments");
  const idea = `${ideaHint || ""} ${spec.summary}`.toLowerCase();
  if (/kid|child|youth|under-?13|coppa/.test(idea)) {
    signals.add("kid");
    signals.add("youth");
  }

  const out: RecommendedTool[] = [];
  for (const tool of TOOL_REGISTRY) {
    let score = 0;
    const reasons: string[] = [];

    if (tool.id === "hosting" || tool.id === "payments" || tool.id === "email") {
      score += 2;
    }
    if (tool.id === "domain" && (needs.has("domain") || spec.constraint === "speed")) {
      score += 4;
      reasons.push("brand URL");
    }
    if (tool.id === "payments" && (needs.has("payments") || signals.has("payments") || signals.has("subscription"))) {
      score += 5;
      reasons.push("collect revenue");
    }
    if (tool.industries.length && industryId && tool.industries.includes(industryId)) {
      score += 4;
      reasons.push(industryId);
    }
    for (const s of tool.signals) {
      if (needs.has(s) || signals.has(s)) {
        score += 3;
        reasons.push(s);
      }
    }
    if (tool.id === "parent_consent" && (signals.has("kid") || signals.has("compliance") || industryId === "edtech")) {
      score += 6;
      reasons.push("youth privacy");
    }
    if (tool.id === "video" && (industryId === "edtech" || spec.fulfillment === "appointment" || spec.fulfillment === "digital")) {
      score += 4;
      reasons.push("live sessions");
    }
    if (tool.id === "calendar" && (needs.has("booking") || spec.fulfillment === "appointment")) {
      score += 4;
      reasons.push("scheduling");
    }
    if (tool.id === "sms" && (needs.has("booking") || industryId === "edtech" || industryId === "local-services")) {
      score += 3;
      reasons.push("reminders");
    }
    if (tool.id === "storage" && industryId === "edtech") {
      score += 3;
      reasons.push("lesson packs");
    }
    if (tool.id === "ai_content") score += 2;
    if (tool.id === "analytics") score += 2;
    if (tool.id === "ecommerce" && !(needs.has("ecommerce") || spec.fulfillment === "shipped" || industryId === "ecommerce")) {
      score = 0;
    }

    if (score <= 0 && tool.id !== "hosting") continue;

    const status: RecommendedTool["status"] =
      score >= 6 || tool.id === "hosting" || (tool.id === "payments" && needs.has("payments"))
        ? "required"
        : score >= 3
          ? "recommended"
          : "optional";

    out.push({
      ...tool,
      status,
      why: reasons.length ? `Needed for ${[...new Set(reasons)].slice(0, 3).join(", ")}` : tool.blurb,
      forNextProjects: tool.defaultForNextProjects || status === "required",
    });
  }

  return out.sort((a, b) => {
    const rank = { required: 0, recommended: 1, optional: 2 };
    return rank[a.status] - rank[b.status] || a.name.localeCompare(b.name);
  });
}

/** Tools to seed onto the next project from this venture’s choices */
export function toolsForNextProjects(selected: { id: string; forNextProjects?: boolean; connected?: boolean }[]): ToolId[] {
  const ids = new Set<ToolId>();
  for (const t of TOOL_REGISTRY) {
    if (t.defaultForNextProjects) ids.add(t.id);
  }
  for (const s of selected) {
    if (s.forNextProjects || s.connected) {
      if (TOOL_REGISTRY.some((t) => t.id === s.id)) ids.add(s.id as ToolId);
    }
  }
  return [...ids];
}

export function toolById(id: string): PlatformTool | undefined {
  return TOOL_REGISTRY.find((t) => t.id === id);
}
