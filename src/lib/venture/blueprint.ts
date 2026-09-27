import { randomUUID } from "node:crypto";
import { detectIndustry } from "@/lib/agent/industries";
import type { ModuleId, Venture, VentureBlueprint, VentureSitePage } from "./types";

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || `venture-${Date.now().toString(36)}`
  );
}

function titleFromIdea(idea: string): string {
  const cleaned = idea
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return cleaned || "New Venture";
}

export function buildBlueprint(idea: string): VentureBlueprint {
  const industry = detectIndustry(idea);
  const name = titleFromIdea(idea);
  const lower = idea.toLowerCase();

  const isDetailing =
    /detail|car wash|auto|vehicle|mobile detailing/.test(lower) ||
    industry.id === "proptech" && /condo|apartment/.test(lower);

  const detailing = isDetailing || /toronto|condo/.test(lower);

  const offers = detailing
    ? [
        {
          name: "Express Exterior",
          type: "service" as const,
          price: 79,
          description: "Wash, dry, tire shine — driveway ready in 45 minutes.",
        },
        {
          name: "Full Detail",
          type: "package" as const,
          price: 159,
          description: "Interior + exterior detail for weekly drivers.",
        },
        {
          name: "Condo Membership",
          type: "package" as const,
          price: 129,
          description: "Monthly exterior detail at your building.",
        },
      ]
    : [
        {
          name: "Starter Offer",
          type: "service" as const,
          price: 49,
          description: "Core paid offer that proves demand.",
        },
        {
          name: "Growth Package",
          type: "package" as const,
          price: 99,
          description: "Higher-touch package for serious buyers.",
        },
        {
          name: "Membership",
          type: "package" as const,
          price: 79,
          description: "Recurring plan to lock retention early.",
        },
      ];

  const recommendedModules: ModuleId[] = [
    "website",
    "crm",
    "booking",
    "payments",
    "analytics",
    ...(detailing ? (["membership", "reviews", "staff", "locations"] as ModuleId[]) : []),
  ];

  return {
    name: detailing ? "ShineOn Mobile Detailing" : name,
    industry: detailing ? "Automotive services" : industry.name,
    industryId: detailing ? "local-services" : industry.id,
    description: idea.trim(),
    market: detailing ? "Toronto condo residents" : "Early adopters in the stated market",
    customer: detailing
      ? "Busy condo residents who want car care without leaving home"
      : industry.buyer,
    problem: detailing
      ? "No convenient, trustworthy detailing at the building"
      : industry.painPatterns[0] || "Customers lack a simple path to the outcome",
    solution: detailing
      ? "Mobile detailing membership + on-demand packages for condo residents"
      : industry.mvpShapes[0],
    revenueModel: detailing
      ? "Subscription membership + one-time detailing services"
      : "Primary paid offer + optional recurring plan",
    channels: detailing
      ? ["Condo partnerships", "Building lobby posters", "Instagram geo ads"]
      : ["Direct outreach", "Landing page", "Partner referrals"],
    personas: detailing
      ? ["Condo professionals", "Family drivers in high-rises"]
      : ["Primary buyer persona", "Secondary influencer"],
    offers,
    journey: [
      "Advertisement / condo partner",
      "Landing page",
      "Service selection",
      "Booking",
      "Payment",
      "CRM record",
      "Service delivery",
      "Review request",
      "Membership offer",
    ],
    recommendedModules,
  };
}

export function generatePages(blueprint: VentureBlueprint): VentureSitePage[] {
  return [
    {
      slug: "home",
      title: "Home",
      headline: blueprint.name,
      body: `${blueprint.solution}. Built for ${blueprint.customer}.`,
      cta: "Book now",
    },
    {
      slug: "services",
      title: "Services",
      headline: "Services & packages",
      body: blueprint.offers.map((o) => `${o.name} — $${o.price}: ${o.description}`).join("\n"),
      cta: "Choose a service",
    },
    {
      slug: "pricing",
      title: "Pricing",
      headline: "Simple pricing",
      body: "Transparent prices. No surprise fees. Memberships save more over time.",
      cta: "See packages",
    },
    {
      slug: "contact",
      title: "Contact",
      headline: "Talk to us",
      body: "Tell us your building and preferred time. We reply fast.",
      cta: "Send message",
    },
  ];
}

export function createVentureFromIdea(idea: string, organizationId = "org_demo"): Venture {
  const blueprint = buildBlueprint(idea);
  const now = new Date().toISOString();
  const baseSlug = slugify(blueprint.name);
  return {
    id: randomUUID(),
    organizationId,
    slug: baseSlug,
    name: blueprint.name,
    idea: idea.trim(),
    stage: "build",
    blueprint,
    modules: [...blueprint.recommendedModules],
    pages: generatePages(blueprint),
    live: false,
    createdAt: now,
    updatedAt: now,
  };
}
