export type DiscoveryAnswerMap = Record<string, string | string[]>;

export type DiscoveryQuestion = {
  id: string;
  prompt: string;
  help?: string;
  type: "single" | "multi" | "text";
  options?: { value: string; label: string }[];
  required?: boolean;
};

/** 9 focused questions — lock MVP + geo for costs/paperwork */
export const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  {
    id: "idea",
    prompt: "In one sentence, what business are you launching?",
    help: "Be concrete: who + what outcome.",
    type: "text",
    required: true,
  },
  {
    id: "geo",
    prompt: "Where will you incorporate and operate first?",
    help: "We use this for leading cost, paperwork, and registration data.",
    type: "single",
    required: true,
    options: [
      { value: "ca-on", label: "Canada — Ontario (Toronto)" },
      { value: "ca-bc", label: "Canada — British Columbia" },
      { value: "us-ny", label: "USA — New York" },
      { value: "us-ca", label: "USA — California" },
      { value: "us-tx", label: "USA — Texas" },
      { value: "uk", label: "United Kingdom" },
      { value: "ae-dubai", label: "UAE — Dubai" },
      { value: "other", label: "Other / global remote" },
    ],
  },
  {
    id: "customer",
    prompt: "Who is the first paying customer?",
    type: "single",
    required: true,
    options: [
      { value: "consumer", label: "Individual consumers" },
      { value: "smb", label: "Small / local businesses" },
      { value: "midmarket", label: "Mid-market teams" },
      { value: "enterprise", label: "Enterprise buyers" },
    ],
  },
  {
    id: "pain",
    prompt: "What painful job must the MVP finish end-to-end?",
    type: "text",
    required: true,
  },
  {
    id: "offer",
    prompt: "How will someone pay you in the first 14 days?",
    type: "single",
    required: true,
    options: [
      { value: "one_time", label: "One-time purchase / service" },
      { value: "subscription", label: "Subscription / membership" },
      { value: "booking_deposit", label: "Booking with deposit" },
      { value: "lead_fee", label: "Lead / quote → offline close" },
      { value: "freemium", label: "Free first, paid upgrade later" },
    ],
  },
  {
    id: "channels",
    prompt: "Where will the first 50 customers come from?",
    type: "multi",
    required: true,
    options: [
      { value: "instagram", label: "Instagram / TikTok" },
      { value: "google", label: "Google search / ads" },
      { value: "partners", label: "Partners / buildings / referrals" },
      { value: "marketplace", label: "Existing marketplaces" },
      { value: "outbound", label: "Outbound sales / email" },
      { value: "walkin", label: "Local / walk-in" },
    ],
  },
  {
    id: "fulfillment",
    prompt: "How is the product or service delivered?",
    type: "single",
    required: true,
    options: [
      { value: "digital", label: "Digital / software" },
      { value: "local_service", label: "Local service (on-site)" },
      { value: "shipped", label: "Shipped physical goods" },
      { value: "appointment", label: "Appointments / bookings" },
      { value: "hybrid", label: "Hybrid (online + offline)" },
    ],
  },
  {
    id: "must_haves",
    prompt: "Which capabilities must exist on day one?",
    type: "multi",
    required: true,
    options: [
      { value: "website", label: "Public website / landing" },
      { value: "payments", label: "Payments" },
      { value: "booking", label: "Booking calendar" },
      { value: "ecommerce", label: "Product catalog / cart" },
      { value: "crm", label: "CRM / leads" },
      { value: "google", label: "Google login / Workspace" },
      { value: "domain", label: "Custom domain" },
      { value: "email", label: "Transactional email" },
    ],
  },
  {
    id: "constraint",
    prompt: "What is the hardest constraint right now?",
    type: "single",
    required: true,
    options: [
      { value: "speed", label: "Need to launch this week" },
      { value: "budget", label: "Very limited budget" },
      { value: "skills", label: "Missing technical skills" },
      { value: "compliance", label: "Compliance / trust concerns" },
      { value: "ops", label: "Operations capacity" },
    ],
  },
];

export type MvpSpec = {
  summary: string;
  customer: string;
  coreLoop: string;
  monetization: string;
  channels: string[];
  fulfillment: string;
  mustHaves: string[];
  constraint: string;
  geo: string;
  recommendedModules: string[];
  milestoneFocus: string;
};

export function buildMvpSpec(answers: DiscoveryAnswerMap): MvpSpec {
  const idea = String(answers.idea || "").trim();
  const geo = String(answers.geo || "other");
  const customer = String(answers.customer || "smb");
  const pain = String(answers.pain || "").trim();
  const offer = String(answers.offer || "one_time");
  const channels = Array.isArray(answers.channels) ? answers.channels : [];
  const fulfillment = String(answers.fulfillment || "digital");
  const mustHaves = Array.isArray(answers.must_haves) ? answers.must_haves : [];
  const constraint = String(answers.constraint || "speed");

  const monetization =
    offer === "subscription"
      ? "Recurring membership with optional one-time add-ons"
      : offer === "booking_deposit"
        ? "Bookable service with deposit at checkout"
        : offer === "lead_fee"
          ? "Lead capture → sales follow-up → offline payment"
          : offer === "freemium"
            ? "Free activation → paid upgrade after value"
            : "One-time paid offer on the happy path";

  const coreLoop = pain
    ? `Customer arrives → ${pain.toLowerCase()} → pays (${offer.replace("_", " ")}) → delivery (${fulfillment.replace("_", " ")}) → follow-up`
    : "Arrive → convert → pay → deliver → retain";

  const modules = new Set<string>(["website", "crm", "analytics"]);
  if (mustHaves.includes("payments") || offer !== "lead_fee") modules.add("payments");
  if (mustHaves.includes("booking") || fulfillment === "appointment" || offer === "booking_deposit")
    modules.add("booking");
  if (mustHaves.includes("ecommerce") || fulfillment === "shipped") modules.add("ecommerce");
  if (offer === "subscription") modules.add("membership");
  if (mustHaves.includes("domain")) modules.add("domain");
  if (mustHaves.includes("google")) modules.add("google");
  modules.add("reviews");

  const milestoneFocus =
    constraint === "skills"
      ? "Pair with an expert for the first vertical slice"
      : constraint === "compliance"
        ? "Ship a narrow trusted loop before expanding data scope"
        : constraint === "budget"
          ? "Use free tiers + one paid rail (payments or domain)"
          : "Launch live experience within days, then instrument";

  return {
    summary: idea || "Untitled MVP",
    customer,
    coreLoop,
    monetization,
    channels,
    fulfillment,
    mustHaves,
    constraint,
    geo,
    recommendedModules: [...modules],
    milestoneFocus,
  };
}
