import type { MvpSpec } from "./discovery";

export type Expert = {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  industries: string[];
  milestones: string[];
  rateHint: string;
  timezone: string;
  blurb: string;
};

/** Curated expert bench — matched 3–5 per venture from MVP + milestone */
export const EXPERT_BENCH: Expert[] = [
  {
    id: "exp_maya",
    name: "Maya Chen",
    title: "Launch PM",
    specialties: ["mvp_scope", "speed", "landing"],
    industries: ["b2b-saas", "local-services", "ecommerce"],
    milestones: ["Day 0 — Spec lock", "Day 1 — Vertical slice", "Launch"],
    rateHint: "Session · strategy",
    timezone: "PT",
    blurb: "Cuts empire ideas into a 7-day shippable loop.",
  },
  {
    id: "exp_omar",
    name: "Omar Haddad",
    title: "Payments & checkout",
    specialties: ["payments", "subscription", "stripe"],
    industries: ["fintech", "ecommerce", "local-services"],
    milestones: ["Day 1 — Vertical slice", "Revenue Validation"],
    rateHint: "Build assist",
    timezone: "ET",
    blurb: "Wires Stripe, deposits, and membership billing without drama.",
  },
  {
    id: "exp_sofia",
    name: "Sofia Alvarez",
    title: "Local services ops",
    specialties: ["booking", "ops", "staff"],
    industries: ["local-services", "proptech", "healthtech"],
    milestones: ["Day 2 — First outsider", "Operational Stability"],
    rateHint: "Ops clinic",
    timezone: "CT",
    blurb: "Turns bookings + staff into a repeatable service day.",
  },
  {
    id: "exp_li",
    name: "Li Wei",
    title: "Growth & acquisition",
    specialties: ["google", "instagram", "partners"],
    industries: ["ecommerce", "edtech", "local-services"],
    milestones: ["Customer Acquisition", "Market Interest"],
    rateHint: "Growth sprint",
    timezone: "PT",
    blurb: "Gets the first 50 customers from one concentrated channel.",
  },
  {
    id: "exp_nina",
    name: "Nina Okonkwo",
    title: "Brand & UX",
    specialties: ["brand", "ux", "website"],
    industries: ["ecommerce", "b2b-saas", "climate"],
    milestones: ["Launch", "Conversion"],
    rateHint: "Design pass",
    timezone: "GMT",
    blurb: "Makes the live site feel on-brand in one focused pass.",
  },
  {
    id: "exp_raj",
    name: "Raj Patel",
    title: "Infra & Google Workspace",
    specialties: ["google", "domain", "email", "skills"],
    industries: ["b2b-saas", "legaltech", "edtech"],
    milestones: ["Day 0 — Spec lock", "Launch"],
    rateHint: "Setup hour",
    timezone: "IST",
    blurb: "Domains, OAuth, Workspace — live in minutes, not weeks.",
  },
  {
    id: "exp_hana",
    name: "Hana Berg",
    title: "Compliance-minded MVP",
    specialties: ["compliance", "health", "trust"],
    industries: ["healthtech", "fintech", "legaltech"],
    milestones: ["Day 0 — Spec lock", "Trust cut"],
    rateHint: "Advisory",
    timezone: "CET",
    blurb: "Keeps PHI/money scope tight while still shipping.",
  },
  {
    id: "exp_diego",
    name: "Diego Santos",
    title: "E-commerce merchandising",
    specialties: ["ecommerce", "pricing", "catalog"],
    industries: ["ecommerce", "retail"],
    milestones: ["Day 1 — Vertical slice", "Revenue Validation"],
    rateHint: "Catalog sprint",
    timezone: "BRT",
    blurb: "Packages, pricing, and checkout that convert first traffic.",
  },
  {
    id: "exp_amira",
    name: "Amira Khalil",
    title: "Incorporation & filings",
    specialties: ["incorporation", "gov", "registrations", "speed"],
    industries: ["local-services", "b2b-saas", "ecommerce", "fintech", "healthtech"],
    milestones: ["Day 0 — Spec lock", "Launch"],
    rateHint: "Filings clinic",
    timezone: "ET",
    blurb: "Makes entity, tax IDs, and license applications less painful.",
  },
  {
    id: "exp_kai",
    name: "Kai Nakamura",
    title: "Spatial / VR UX (Meta)",
    specialties: ["vr", "ux", "website", "brand"],
    industries: ["ecommerce", "local-services", "b2b-saas"],
    milestones: ["Launch", "Conversion"],
    rateHint: "Spatial pass",
    timezone: "PT",
    blurb: "Tunes plug-and-play UI for Quest and Meta glasses.",
  },
];

export function matchExperts(
  spec: MvpSpec,
  industryId?: string,
  limit = 5,
): (Expert & { score: number; why: string; sessionTip: string })[] {
  const tags = new Set<string>([
    ...spec.mustHaves,
    spec.constraint,
    spec.fulfillment,
    ...spec.channels,
    "incorporation",
    "gov",
  ]);
  if (spec.monetization.toLowerCase().includes("subscription")) tags.add("subscription");
  if (spec.monetization.toLowerCase().includes("deposit")) tags.add("payments");
  if (spec.monetization.toLowerCase().includes("membership")) tags.add("subscription");

  const scored = EXPERT_BENCH.map((e) => {
    let score = 0;
    const reasons: string[] = [];
    for (const s of e.specialties) {
      if (tags.has(s) || spec.mustHaves.includes(s) || spec.constraint === s) {
        score += 3;
        reasons.push(s);
      }
    }
    if (industryId && e.industries.includes(industryId)) {
      score += 4;
      reasons.push(industryId);
    }
    if (spec.constraint === "skills" && e.specialties.includes("skills")) score += 3;
    if (spec.constraint === "compliance" && e.specialties.includes("compliance")) score += 4;
    // Always boost incorporation help for new builds
    if (e.specialties.includes("incorporation")) score += 2;
    return {
      ...e,
      score,
      why: reasons.length
        ? `Matched on ${[...new Set(reasons)].slice(0, 3).join(", ")}`
        : "General launch support",
      sessionTip: sessionTipFor(e, spec),
    };
  });

  const top = scored.sort((a, b) => b.score - a.score);
  const picked: typeof top = [];
  for (const e of top) {
    if (picked.length >= limit) break;
    if (!picked.find((p) => p.id === e.id)) picked.push(e);
  }
  // Guarantee exactly `limit` advisors from first build
  let i = 0;
  while (picked.length < limit && i < EXPERT_BENCH.length) {
    const fallback = EXPERT_BENCH[i++];
    if (!picked.find((p) => p.id === fallback.id)) {
      picked.push({
        ...fallback,
        score: 1,
        why: "Included so every build starts with a full advisory bench",
        sessionTip: sessionTipFor(fallback, spec),
      });
    }
  }
  return picked.slice(0, limit);
}

function sessionTipFor(e: Expert, spec: MvpSpec): string {
  if (e.specialties.includes("incorporation")) {
    return `This session: start ${spec.geo || "your region"} entity filings before buying ads.`;
  }
  if (e.specialties.includes("payments")) {
    return "This session: connect payments and run one test checkout.";
  }
  if (e.specialties.includes("vr")) {
    return "This session: enable VR storefront and verify large targets on a headset browser.";
  }
  if (e.specialties.includes("booking")) {
    return "This session: publish booking + deposit on the live URL.";
  }
  return `This session: protect focus — ${spec.milestoneFocus}`;
}

/** One rotating advisor recommendation callout for the current OS session */
export function sessionAdvisorRecommendation(
  experts: (Expert & { sessionTip?: string; why: string })[],
  sessionKey?: string,
): { expertId: string; name: string; title: string; tip: string } {
  if (!experts.length) {
    return {
      expertId: "none",
      name: "Launch desk",
      title: "Advisor",
      tip: "Complete discovery to unlock your 5-advisor bench.",
    };
  }
  const idx = Math.abs(hash(sessionKey || new Date().toDateString())) % experts.length;
  const e = experts[idx];
  return {
    expertId: e.id,
    name: e.name,
    title: e.title,
    tip: e.sessionTip || e.why,
  };
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
