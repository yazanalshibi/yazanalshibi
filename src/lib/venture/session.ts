import type { GeoIndustryIntel, GeoRegionId } from "./geo-intel";

export type GovApplication = {
  id: string;
  title: string;
  category: "incorporation" | "tax" | "license" | "banking" | "other";
  status: "todo" | "in_progress" | "done" | "blocked";
  agency: string;
  applyUrl?: string;
  checklist: string[];
  why: string;
  typicalDays: string;
};

/** Build incorporation + government application checklist from geo intel */
export function buildGovApplications(intel: GeoIndustryIntel): GovApplication[] {
  const apps: GovApplication[] = intel.registrations.map((r) => ({
    id: r.id,
    title: r.name,
    category: r.id.includes("tax") || r.id.includes("bn") || r.id.includes("ein") || r.id.includes("utr")
      ? "tax"
      : r.id.includes("license")
        ? "license"
        : "incorporation",
    status: "todo",
    agency: r.agency,
    applyUrl: r.applyUrl,
    checklist: [
      "Confirm legal name availability",
      "Prepare address / registered office",
      "Identify directors / owners",
      "Submit online application",
      "Store confirmation PDF locally",
    ],
    why: r.why,
    typicalDays: r.typicalDays,
  }));

  for (const p of intel.paperwork) {
    apps.push({
      id: p.id,
      title: p.name,
      category: p.id.includes("license") ? "license" : "other",
      status: "todo",
      agency: p.agency,
      applyUrl: p.applyUrl,
      checklist: ["Draft required info", "Submit or save policy doc", "Mark done in Launchpad"],
      why: p.why,
      typicalDays: p.typicalDays,
    });
  }

  apps.push({
    id: "banking",
    title: "Open business bank / payments account",
    category: "banking",
    status: "todo",
    agency: "Bank or Stripe + bank",
    applyUrl: "https://dashboard.stripe.com/register",
    checklist: [
      "Entity docs ready (articles / EIN / BN)",
      "Open Stripe for MVP payments",
      "Open business bank when entity exists",
    ],
    why: "Collect revenue on day one while entity paperwork finishes.",
    typicalDays: "1–14",
  });

  return apps;
}

export function regionQuickLinks(regionId: GeoRegionId): { label: string; url: string }[] {
  switch (regionId) {
    case "ca-on":
      return [
        { label: "Ontario Business Registry", url: "https://www.ontario.ca/page/ontario-business-registry" },
        { label: "CRA Business registration", url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business.html" },
      ];
    case "us-ny":
    case "us-ca":
    case "us-tx":
      return [
        { label: "SBA — Register your business", url: "https://www.sba.gov/business-guide/launch-your-business/register-your-business" },
        { label: "IRS EIN", url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
      ];
    case "uk":
      return [
        { label: "Register a company", url: "https://www.gov.uk/limited-company-formation/register-your-company" },
      ];
    default:
      return [{ label: "Find local registry", url: "https://www.google.com/search?q=incorporate+business+" }];
  }
}
