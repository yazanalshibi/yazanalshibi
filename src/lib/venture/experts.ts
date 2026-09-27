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
];

export function matchExperts(
  spec: MvpSpec,
  industryId?: string,
  limit = 5,
): (Expert & { score: number; why: string })[] {
  const tags = new Set<string>([
    ...spec.mustHaves,
    spec.constraint,
    spec.fulfillment,
    ...spec.channels,
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
    if (e.milestones.some((m) => spec.milestoneFocus.includes("expert") && m.includes("Spec"))) {
      score += 1;
    }
    if (spec.constraint === "skills" && e.specialties.includes("skills")) score += 3;
    if (spec.constraint === "compliance" && e.specialties.includes("compliance")) score += 4;
    return {
      ...e,
      score,
      why: reasons.length
        ? `Matched on ${[...new Set(reasons)].slice(0, 3).join(", ")}`
        : "General launch support",
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((e, idx) =>
      e.score > 0
        ? e
        : {
            ...EXPERT_BENCH[idx % EXPERT_BENCH.length],
            score: 1,
            why: "Strong generalist for early MVP milestones",
          },
    );
}
