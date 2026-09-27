import type { MvpSpec } from "./discovery";

export type InfraConnectionId =
  | "domain"
  | "payments"
  | "ecommerce"
  | "google"
  | "email"
  | "analytics"
  | "hosting";

export type InfraConnection = {
  id: InfraConnectionId;
  name: string;
  why: string;
  setupMinutes: number;
  status: "recommended" | "optional" | "required";
  connectUrl: string;
  docsHint: string;
  botTask: string;
};

export function recommendInfrastructure(spec: MvpSpec): InfraConnection[] {
  const needs = new Set(spec.mustHaves);
  const all: InfraConnection[] = [
    {
      id: "domain",
      name: "Custom domain",
      why: "Brand-owned URL for trust and ads (e.g. yourbrand.com).",
      setupMinutes: 5,
      status: needs.has("domain") || spec.constraint === "speed" ? "required" : "recommended",
      connectUrl: "https://domains.google/",
      docsHint: "Point DNS A/CNAME to Live Venture OS hosting once issued.",
      botTask: "provision_domain_dns",
    },
    {
      id: "payments",
      name: "Payment processing",
      why: "Collect money on day one — deposits, checkout, or subscriptions.",
      setupMinutes: 8,
      status:
        needs.has("payments") || spec.monetization.toLowerCase().includes("pay")
          ? "required"
          : "recommended",
      connectUrl: "https://dashboard.stripe.com/register",
      docsHint: "Connect Stripe keys; our bot wires checkout + webhooks.",
      botTask: "connect_stripe",
    },
    {
      id: "ecommerce",
      name: "E-commerce catalog",
      why: "Products, variants, cart — when you sell goods or packages online.",
      setupMinutes: 10,
      status:
        needs.has("ecommerce") || spec.fulfillment === "shipped" ? "required" : "optional",
      connectUrl: "https://www.shopify.com/",
      docsHint: "Or use native Live Venture catalog; Shopify sync is optional.",
      botTask: "connect_commerce",
    },
    {
      id: "google",
      name: "Google account / Workspace",
      why: "Login, Calendar, Gmail, Drive — customer auth and ops in minutes.",
      setupMinutes: 4,
      status: needs.has("google") || spec.channels.includes("google") ? "required" : "recommended",
      connectUrl: "https://console.cloud.google.com/apis/credentials",
      docsHint: "OAuth client for Google sign-in + Calendar booking sync.",
      botTask: "connect_google_oauth",
    },
    {
      id: "email",
      name: "Transactional email",
      why: "Booking confirmations, receipts, review asks.",
      setupMinutes: 5,
      status: needs.has("email") ? "required" : "recommended",
      connectUrl: "https://resend.com/signup",
      docsHint: "Verify sending domain; bot attaches templates to events.",
      botTask: "connect_email",
    },
    {
      id: "analytics",
      name: "Analytics & tags",
      why: "Measure funnel from first visit — feeds Venture Health + AI Advisor.",
      setupMinutes: 3,
      status: "recommended",
      connectUrl: "https://analytics.google.com/",
      docsHint: "Native events already tracked; GA4 optional overlay.",
      botTask: "connect_analytics",
    },
    {
      id: "hosting",
      name: "Hosting & SSL",
      why: "Live venture URL with HTTPS from our infrastructure.",
      setupMinutes: 2,
      status: "required",
      connectUrl: "/create",
      docsHint: "Included with Live Venture OS — auto SSL on publish.",
      botTask: "ensure_hosting",
    },
  ];

  return all.sort((a, b) => {
    const rank = { required: 0, recommended: 1, optional: 2 };
    return rank[a.status] - rank[b.status];
  });
}
