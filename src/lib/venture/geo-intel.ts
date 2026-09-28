/**
 * Leading market data by geolocation + industry:
 * typical startup costs, paperwork, registrations, and tech baseline.
 * Educational estimates — not legal advice.
 */

export type GeoRegionId =
  | "ca-on"
  | "ca-bc"
  | "us-ny"
  | "us-ca"
  | "us-tx"
  | "uk"
  | "ae-dubai"
  | "other";

export type CostLine = {
  item: string;
  lowUsd: number;
  highUsd: number;
  note: string;
};

export type PaperworkItem = {
  id: string;
  name: string;
  agency: string;
  why: string;
  difficulty: "easy" | "moderate" | "complex";
  typicalDays: string;
  applyUrl?: string;
};

export type GeoIndustryIntel = {
  regionId: GeoRegionId;
  regionLabel: string;
  industryId: string;
  industryLabel: string;
  currencyNote: string;
  costBands: CostLine[];
  paperwork: PaperworkItem[];
  registrations: PaperworkItem[];
  techInfrastructure: string[];
  leadingSignals: string[];
  estimatedMonthOneUsd: { low: number; high: number };
};

const REGIONS: { id: GeoRegionId; label: string; keywords: string[] }[] = [
  { id: "ca-on", label: "Canada — Ontario (Toronto)", keywords: ["toronto", "ontario", "canada", "on"] },
  { id: "ca-bc", label: "Canada — British Columbia", keywords: ["vancouver", "bc", "british columbia"] },
  { id: "us-ny", label: "USA — New York", keywords: ["new york", "nyc", "brooklyn"] },
  { id: "us-ca", label: "USA — California", keywords: ["california", "sf", "los angeles", "la "] },
  { id: "us-tx", label: "USA — Texas", keywords: ["texas", "austin", "dallas", "houston"] },
  { id: "uk", label: "United Kingdom", keywords: ["uk", "london", "manchester", "britain"] },
  { id: "ae-dubai", label: "UAE — Dubai", keywords: ["dubai", "uae", "abu dhabi"] },
  { id: "other", label: "Other / global remote", keywords: [] },
];

export function listGeoRegions() {
  return REGIONS.map((r) => ({ id: r.id, label: r.label }));
}

export function resolveGeoRegion(input?: string): GeoRegionId {
  const t = (input || "").toLowerCase();
  for (const r of REGIONS) {
    if (r.id === "other") continue;
    if (r.keywords.some((k) => t.includes(k))) return r.id;
  }
  if (REGIONS.some((r) => r.id === input)) return input as GeoRegionId;
  return "other";
}

function baseCosts(region: GeoRegionId): CostLine[] {
  const mult =
    region === "us-ca" || region === "us-ny" || region === "ae-dubai"
      ? 1.25
      : region === "uk"
        ? 1.1
        : region === "ca-on" || region === "ca-bc"
          ? 1.0
          : 0.9;
  const scale = (n: number) => Math.round(n * mult);
  return [
    {
      item: "Entity formation / filing",
      lowUsd: scale(200),
      highUsd: scale(800),
      note: "Government filing + name search; lawyer optional.",
    },
    {
      item: "Domain + email + hosting (year 1)",
      lowUsd: scale(40),
      highUsd: scale(300),
      note: "Included faster via Live Venture OS connections.",
    },
    {
      item: "Payments setup (Stripe etc.)",
      lowUsd: 0,
      highUsd: scale(100),
      note: "Usually free to open; fees on transactions.",
    },
    {
      item: "Insurance (month 1)",
      lowUsd: scale(50),
      highUsd: scale(400),
      note: "General liability / professional — industry dependent.",
    },
    {
      item: "Marketing test budget",
      lowUsd: scale(100),
      highUsd: scale(1500),
      note: "First acquisition experiments.",
    },
    {
      item: "Tools & software",
      lowUsd: scale(0),
      highUsd: scale(200),
      note: "Prefer free tiers until revenue.",
    },
  ];
}

function industryExtras(industryId: string): {
  costs: CostLine[];
  paperwork: PaperworkItem[];
  tech: string[];
  signals: string[];
  label: string;
} {
  switch (industryId) {
    case "healthtech":
      return {
        label: "HealthTech",
        costs: [
          {
            item: "Compliance review (lightweight)",
            lowUsd: 500,
            highUsd: 5000,
            note: "Privacy assessment before PHI collection.",
          },
        ],
        paperwork: [
          {
            id: "privacy_policy",
            name: "Privacy policy + data minimization plan",
            agency: "Internal / counsel",
            why: "Required before handling patient-adjacent data.",
            difficulty: "moderate",
            typicalDays: "3–14",
          },
        ],
        tech: ["Encrypted Postgres", "Audit logs", "Strict auth", "BAA path later"],
        signals: ["Clinics buy ops wedges, not EHR replacements"],
      };
    case "fintech":
      return {
        label: "FinTech",
        costs: [
          {
            item: "KYC/AML tooling (if moving money)",
            lowUsd: 0,
            highUsd: 2000,
            note: "Defer custody; start read-only / reminders.",
          },
        ],
        paperwork: [
          {
            id: "money_boundary",
            name: "Money-boundary memo (observe vs move)",
            agency: "Internal",
            why: "Locks compliance scope for MVP.",
            difficulty: "easy",
            typicalDays: "1–2",
          },
        ],
        tech: ["Stripe Connect later", "Immutable ledgers", "Confirm gates"],
        signals: ["Utility beside banks converts faster than neobank claims"],
      };
    case "local-services":
      return {
        label: "Local services",
        costs: [
          {
            item: "Vehicle / equipment / supplies float",
            lowUsd: 200,
            highUsd: 3000,
            note: "Service businesses need operating float.",
          },
          {
            item: "Local permits / home occupation (if any)",
            lowUsd: 0,
            highUsd: 500,
            note: "City-dependent.",
          },
        ],
        paperwork: [
          {
            id: "local_business_license",
            name: "Municipal business license (if required)",
            agency: "City / municipality",
            why: "Operate legally in jurisdiction.",
            difficulty: "easy",
            typicalDays: "1–21",
            applyUrl: "https://www.google.com/search?q=business+license+",
          },
        ],
        tech: ["Booking", "Payments deposits", "SMS/email confirmations", "Staff assignments"],
        signals: ["Geo concentration beats nationwide marketplace cold-start"],
      };
    case "ecommerce":
      return {
        label: "E-commerce",
        costs: [
          {
            item: "Initial inventory / samples",
            lowUsd: 200,
            highUsd: 5000,
            note: "Or dropship to defer inventory.",
          },
        ],
        paperwork: [
          {
            id: "sales_tax",
            name: "Sales tax / VAT registration (when thresholds hit)",
            agency: "Tax authority",
            why: "Collect/remit once selling goods.",
            difficulty: "moderate",
            typicalDays: "3–30",
          },
        ],
        tech: ["Catalog", "Checkout", "Shipping labels later", "Returns form"],
        signals: ["Post-purchase ops often pays before new storefronts"],
      };
    case "edtech":
      return {
        label: "EdTech / youth learning",
        costs: [
          {
            item: "First cohort mentor stipend",
            lowUsd: 200,
            highUsd: 2000,
            note: "Pay one instructor for a 4-week pilot before hiring.",
          },
          {
            item: "Parent marketing creatives",
            lowUsd: 50,
            highUsd: 800,
            note: "Short video + landing proof for trial classes.",
          },
        ],
        paperwork: [
          {
            id: "youth_privacy",
            name: "Under-13 privacy policy + parental consent flow",
            agency: "Internal / counsel",
            why: "COPPA / local youth privacy — parents are the account holders in v1.",
            difficulty: "moderate",
            typicalDays: "3–14",
          },
        ],
        tech: [
          "Parent checkout",
          "Class booking",
          "Lesson progress (kid profile via parent)",
          "Email/SMS reminders",
          "Zoom/Meet link later",
        ],
        signals: ["Parents buy trials; kids retain when they ship a real mini-venture"],
      };
    default:
      return {
        label: industryId,
        costs: [],
        paperwork: [],
        tech: ["Landing + CRM", "Payments", "Analytics events", "AI advisor"],
        signals: ["Ship one core loop before platform features"],
      };
  }
}

function regionRegistrations(region: GeoRegionId): PaperworkItem[] {
  switch (region) {
    case "ca-on":
      return [
        {
          id: "on_nuans",
          name: "NUANS / name search (if incorporating)",
          agency: "Federal / Ontario",
          why: "Clear business name before incorporation.",
          difficulty: "easy",
          typicalDays: "1–3",
          applyUrl: "https://www.ic.gc.ca/eic/site/cd-dgc.nsf/eng/h_cs03927.html",
        },
        {
          id: "on_corp",
          name: "Ontario or Federal corporation articles",
          agency: "Ontario Business Registry / Corporations Canada",
          why: "Create the legal entity.",
          difficulty: "moderate",
          typicalDays: "1–10",
          applyUrl: "https://www.ontario.ca/page/ontario-business-registry",
        },
        {
          id: "ca_bn",
          name: "Business Number / CRA program accounts",
          agency: "CRA",
          why: "Tax, payroll, GST/HST when needed.",
          difficulty: "moderate",
          typicalDays: "1–15",
          applyUrl: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business.html",
        },
      ];
    case "ca-bc":
      return [
        {
          id: "bc_reg",
          name: "BC Company Registry incorporation",
          agency: "BC Registries",
          why: "Form a BC company.",
          difficulty: "moderate",
          typicalDays: "1–7",
          applyUrl: "https://www.bcregistry.gov.bc.ca/",
        },
        {
          id: "ca_bn",
          name: "Business Number / CRA accounts",
          agency: "CRA",
          why: "Tax accounts.",
          difficulty: "moderate",
          typicalDays: "1–15",
          applyUrl: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business.html",
        },
      ];
    case "us-ny":
    case "us-ca":
    case "us-tx":
      return [
        {
          id: "us_llc",
          name: "LLC / Corp articles of organization",
          agency: "State Secretary of State",
          why: "Form the entity in your state.",
          difficulty: "moderate",
          typicalDays: "1–14",
          applyUrl: "https://www.sba.gov/business-guide/launch-your-business/register-your-business",
        },
        {
          id: "us_ein",
          name: "EIN (Employer Identification Number)",
          agency: "IRS",
          why: "Banking, payroll, tax filings.",
          difficulty: "easy",
          typicalDays: "1",
          applyUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
        },
      ];
    case "uk":
      return [
        {
          id: "uk_companies_house",
          name: "Companies House incorporation",
          agency: "Companies House",
          why: "Register a limited company.",
          difficulty: "easy",
          typicalDays: "1–3",
          applyUrl: "https://www.gov.uk/limited-company-formation/register-your-company",
        },
        {
          id: "uk_utr",
          name: "UTR / HMRC registration",
          agency: "HMRC",
          why: "Corporation tax.",
          difficulty: "moderate",
          typicalDays: "7–21",
          applyUrl: "https://www.gov.uk/limited-company-formation/set-up-your-company-for-corporation-tax",
        },
      ];
    case "ae-dubai":
      return [
        {
          id: "dubai_license",
          name: "Trade license (mainland or free zone)",
          agency: "DED / Free zone authority",
          why: "Legal right to operate.",
          difficulty: "complex",
          typicalDays: "7–30",
          applyUrl: "https://www.dubai.gov.ae/",
        },
      ];
    default:
      return [
        {
          id: "generic_entity",
          name: "Local business registration / incorporation",
          agency: "Local corporate registry",
          why: "Create a recognized entity for banking and contracts.",
          difficulty: "moderate",
          typicalDays: "1–30",
        },
      ];
  }
}

export function collectGeoIndustryIntel(
  regionInput: string | undefined,
  industryId: string,
  ideaHint?: string,
): GeoIndustryIntel {
  const regionId = resolveGeoRegion(regionInput || ideaHint);
  const regionLabel = REGIONS.find((r) => r.id === regionId)?.label || regionId;
  const extras = industryExtras(industryId);
  const costBands = [...baseCosts(regionId), ...extras.costs];
  const paperwork = [
    {
      id: "bank_account",
      name: "Business bank account",
      agency: "Bank / fintech",
      why: "Separate personal and business funds.",
      difficulty: "moderate" as const,
      typicalDays: "1–14",
    },
    ...extras.paperwork,
  ];
  const registrations = regionRegistrations(regionId);
  const low = costBands.reduce((s, c) => s + c.lowUsd, 0);
  const high = costBands.reduce((s, c) => s + c.highUsd, 0);

  return {
    regionId,
    regionLabel,
    industryId,
    industryLabel: extras.label,
    currencyNote: "USD-equivalent estimates for planning; local currency may differ.",
    costBands,
    paperwork,
    registrations,
    techInfrastructure: extras.tech,
    leadingSignals: extras.signals,
    estimatedMonthOneUsd: { low, high },
  };
}
