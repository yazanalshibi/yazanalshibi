import type { IndustryPack } from "./types";

/**
 * Industry training packs — curriculum for how to cut MVPs in verticals
 * that repeatedly need fast, shippable first products.
 */
export const INDUSTRY_PACKS: IndustryPack[] = [
  {
    id: "healthtech",
    name: "HealthTech",
    blurb: "Clinics, patients, and care ops — prove workflow value before PHI sprawl.",
    whyMvp:
      "Care teams drown in scheduling, intake, and follow-up busywork. Buyers will trial a narrow workflow win; they will not buy a full EHR replacement from a newcomer.",
    buyer: "Clinic ops lead or solo practitioner who owns a painful daily workflow.",
    painPatterns: [
      "Manual intake / triage on paper or chat",
      "No-show and follow-up chaos",
      "Referral tracking across clinics",
    ],
    mvpShapes: [
      "Single-clinic intake → triage queue",
      "Appointment reminder + confirmation loop",
      "Care checklist for one condition pathway",
    ],
    mustHaves: [
      "One workflow for one clinic role end-to-end",
      "Clear audit trail of who changed what",
      "Export / CSV escape hatch (no lock-in fear)",
      "Explicit “not medical advice” + data-minimization defaults",
    ],
    nonGoals: [
      "Full EHR / billing suite",
      "Multi-state compliance theater before first clinic success",
      "Patient social network",
      "AI diagnosis claims",
    ],
    constraints: [
      "Minimize PHI in v1; prefer de-identified or ops-only data when possible",
      "Never claim clinical decision support without clinician review",
      "BAA / HIPAA path is a post-activation milestone, not day-0 scope",
    ],
    stackHints: {
      frontend: "Next.js + Tailwind (ops dashboard)",
      backend: "Next.js Route Handlers with strict auth",
      data: "Postgres + encrypted fields; audit log table",
      hosting: "Vercel + managed Postgres (region pinned)",
    },
    preferredTemplate: "web-saas",
    keywords: [
      "health",
      "clinic",
      "patient",
      "doctor",
      "medical",
      "hipaa",
      "telehealth",
      "ehr",
      "care",
      "hospital",
      "pharma",
    ],
    discoveryQuestions: [
      "Which single clinic role feels this pain every day?",
      "What is the current workaround (spreadsheet, WhatsApp, paper)?",
    ],
    risks: [
      "Scope expands into clinical claims too early",
      "Collecting unnecessary PHI before proving ops value",
      "Sales cycle stalled by compliance theater",
    ],
    milestones: [
      {
        title: "Day 0 — Workflow lock",
        outcome: "One clinic role, one job-to-be-done, written PHI minimization rules.",
      },
      {
        title: "Day 1 — Ops slice",
        outcome: "Intake → queue → done works with synthetic data.",
      },
      {
        title: "Day 2 — Shadow clinic",
        outcome: "One real ops user completes the loop beside their old process.",
      },
      {
        title: "Day 3 — Trust cut",
        outcome: "Audit log + export live; drop any clinical-claim language.",
      },
    ],
    examples: [
      {
        idea: "AI that replaces the hospital system",
        cut: "Clinic front-desk intake form → nurse triage board for one specialty.",
        why: "Hospitals do not buy platforms from unknowns; they buy a proven ops wedge.",
      },
      {
        idea: "Patient app for all chronic conditions",
        cut: "WhatsApp-style check-in + reminder for one condition at one clinic.",
        why: "Depth in one pathway beats shallow coverage across many.",
      },
    ],
  },
  {
    id: "fintech",
    name: "FinTech",
    blurb: "Money movement is slow to trust — ship risk-light utility first.",
    whyMvp:
      "Finance buyers need a clear ROI wedge without taking custody risk on day one. MVPs win when they sit beside existing banks/rails instead of replacing them.",
    buyer: "SMB owner, finance ops, or indie seller who reconciles money manually.",
    painPatterns: [
      "Reconciliation across statements",
      "Invoice → payment follow-up",
      "Expense categorization for tax time",
    ],
    mvpShapes: [
      "Read-only dashboard on exported CSVs",
      "Invoice reminder sequence",
      "Cashflow weekly digest from bank CSV",
    ],
    mustHaves: [
      "Clear money boundary (no custody in v1 unless required)",
      "One reconciliation or reminder loop that saves hours",
      "Immutable history of calculations",
      "Human-confirm step before any outbound money action",
    ],
    nonGoals: [
      "Becoming a bank / issuing cards",
      "Multi-currency treasury platform",
      "Full accounting suite",
      "Automated trading",
    ],
    constraints: [
      "Prefer read-only data imports before write/payment APIs",
      "Never auto-send money without explicit confirmation UX",
      "Flag KYC/AML as a gated milestone, not a splash-page feature",
    ],
    stackHints: {
      frontend: "Next.js dashboard + stark numbers UI",
      backend: "Route Handlers + job queue for imports",
      data: "Postgres; never store full PAN; tokenize via provider later",
      hosting: "Vercel + Postgres; secrets in vault",
    },
    preferredTemplate: "web-saas",
    keywords: [
      "finance",
      "fintech",
      "payment",
      "invoice",
      "banking",
      "ledger",
      "expense",
      "accounting",
      "crypto",
      "wallet",
      "lending",
    ],
    discoveryQuestions: [
      "Do we move money, or only observe / remind about money?",
      "What spreadsheet do they open every Monday?",
    ],
    risks: [
      "Taking payment custody before trust exists",
      "Compliance scope exploding (KYC) before activation",
      "Wrong buyer (CFOs vs operators)",
    ],
    milestones: [
      {
        title: "Day 0 — Money boundary",
        outcome: "Write whether v1 is observe / remind / move — pick one.",
      },
      {
        title: "Day 1 — CSV slice",
        outcome: "Import → insight → action draft works on sample statements.",
      },
      {
        title: "Day 2 — Operator trial",
        outcome: "One finance ops user runs weekly close using the tool.",
      },
      {
        title: "Day 3 — Confirm gate",
        outcome: "Any money-touching action requires explicit confirm + log.",
      },
    ],
    examples: [
      {
        idea: "Neobank for everyone",
        cut: "Weekly cashflow digest from bank CSV + overdue invoice nudges.",
        why: "Banking licenses kill speed; utility beside the bank ships.",
      },
    ],
  },
  {
    id: "edtech",
    name: "EdTech",
    blurb: "Teachers and learners need one completed lesson loop, not a campus OS.",
    whyMvp:
      "Schools and tutors buy outcomes (completion, retention, grading time saved). Broad LMS clones fail; narrow learning loops win pilots.",
    buyer: "Teacher, tutor, or course creator who repeats the same prep/grade grind.",
    painPatterns: [
      "Grading the same assignment type repeatedly",
      "Student progress invisible until too late",
      "Content scattered across Drive / WhatsApp",
    ],
    mvpShapes: [
      "Assignment in → rubric-assisted grade out",
      "Parent/tutor progress ping for one subject",
      "Micro-course with one quiz and certificate stub",
    ],
    mustHaves: [
      "One learner journey from start → evidence of completion",
      "Teacher can intervene with one click",
      "Export grades / progress",
      "Works on mediocre school Wi‑Fi / mobile browser",
    ],
    nonGoals: [
      "Full LMS with forums, SIS sync, SCORM everything",
      "District-wide admin console",
      "Live classroom video platform",
    ],
    constraints: [
      "COPPA/FERPA awareness if under-13; default to adult/tutor pilots when unsure",
      "Avoid dark-pattern engagement loops framed as learning",
    ],
    stackHints: {
      frontend: "Next.js + simple mobile-first lesson UI",
      backend: "Route Handlers",
      data: "Postgres or SQLite for pilot",
      hosting: "Vercel",
    },
    preferredTemplate: "web-saas",
    keywords: [
      "education",
      "edtech",
      "school",
      "teacher",
      "tutor",
      "student",
      "course",
      "learning",
      "classroom",
      "lms",
    ],
    discoveryQuestions: [
      "Is the buyer the teacher, the parent, or the institution?",
      "What is the one assignment type that wastes the most hours?",
    ],
    risks: [
      "Building for institutions before proving teacher love",
      "Content library sprawl before completion loop works",
      "Ignoring device/network constraints in schools",
    ],
    milestones: [
      {
        title: "Day 0 — Learner lock",
        outcome: "One subject, one assignment type, one success metric (time saved or completion).",
      },
      {
        title: "Day 1 — Lesson slice",
        outcome: "Assign → complete → grade assist works for 5 sample items.",
      },
      {
        title: "Day 2 — Classroom pilot",
        outcome: "One teacher runs a real assignment through the tool.",
      },
      {
        title: "Day 3 — Evidence export",
        outcome: "Grades/progress export; cut anything not on that path.",
      },
    ],
    examples: [
      {
        idea: "AI school platform",
        cut: "Rubric-assisted grading for short essays in one subject.",
        why: "Teachers feel time savings immediately; platforms feel like IT projects.",
      },
    ],
  },
  {
    id: "proptech",
    name: "PropTech / Real Estate",
    blurb: "Listings and ops are fragmented — automate one deal or one property workflow.",
    whyMvp:
      "Agents and property managers live in WhatsApp + spreadsheets. A narrow deal or maintenance loop beats another portal clone.",
    buyer: "Independent agent, small brokerage ops, or property manager of <50 units.",
    painPatterns: [
      "Lead follow-up leaks",
      "Showing schedule chaos",
      "Maintenance ticket ping-pong",
    ],
    mvpShapes: [
      "Lead → qualify → showing booked",
      "Tenant request → vendor assigned",
      "Listing brief generator from property facts",
    ],
    mustHaves: [
      "One pipeline stage view that matches how they already work",
      "WhatsApp/email-friendly sharing",
      "Status everyone trusts (no duplicate truths)",
    ],
    nonGoals: [
      "National MLS replacement",
      "Mortgage origination suite",
      "3D virtual tour platform",
    ],
    constraints: [
      "Respect listing data rights; start with user-entered or owned inventory",
      "Local regulations vary — keep legal copy generic in v1",
    ],
    stackHints: {
      frontend: "Next.js pipeline board",
      backend: "Route Handlers + file uploads",
      data: "Postgres",
      hosting: "Vercel",
    },
    preferredTemplate: "web-saas",
    keywords: [
      "real estate",
      "property",
      "proptech",
      "rental",
      "tenant",
      "landlord",
      "broker",
      "listing",
      "mls",
      "apartment",
    ],
    discoveryQuestions: [
      "Agent side (sell/lease) or ops side (manage units)?",
      "Where do deals die today — lead, showing, or paperwork?",
    ],
    risks: [
      "Scraping listings illegally for cold start",
      "Building consumer search before supply-side workflow",
      "Ignoring local market customs",
    ],
    milestones: [
      {
        title: "Day 0 — Pipeline lock",
        outcome: "Pick lead-to-showing OR ticket-to-vendor — not both.",
      },
      {
        title: "Day 1 — Board slice",
        outcome: "Create → move stage → notify works.",
      },
      {
        title: "Day 2 — Desk pilot",
        outcome: "One agent/PM runs a live week in parallel with WhatsApp.",
      },
      {
        title: "Day 3 — Single source",
        outcome: "Kill duplicate status channels; export history.",
      },
    ],
    examples: [
      {
        idea: "Airbnb killer",
        cut: "Maintenance ticket intake + vendor SMS for one building.",
        why: "Marketplace liquidity is hard; ops pain is paid today.",
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E‑commerce / Retail",
    blurb: "Merchants need conversion or ops relief on one SKU path — not another Shopify.",
    whyMvp:
      "Stores already have carts. MVPs win on discovery, bundling, post-purchase, or ops (returns, restock) around the existing storefront.",
    buyer: "DTC founder or store ops lead with a measurable leak (conversion, returns, support).",
    painPatterns: [
      "Support tickets for order status",
      "Returns chaos",
      "Merchandising experiments too slow",
    ],
    mvpShapes: [
      "Post-purchase tracking page + FAQ deflection",
      "Return request → label flow",
      "Landing + waitlist for one drop",
    ],
    mustHaves: [
      "Hooks into existing store (CSV / Shopify admin) without replatforming",
      "One metric owner (conversion, tickets deflected, return cycle time)",
      "Mobile-ready shopper path",
    ],
    nonGoals: [
      "Full commerce platform",
      "Warehouse WMS",
      "Multi-brand marketplace",
    ],
    constraints: [
      "Prefer app-extension / overlay over forcing store migration",
      "Payment stays on incumbent processor in v1",
    ],
    stackHints: {
      frontend: "Next.js storefront slice or merchant admin",
      backend: "Route Handlers + webhooks",
      data: "Postgres + object storage for labels",
      hosting: "Vercel",
    },
    preferredTemplate: "landing-waitlist",
    keywords: [
      "ecommerce",
      "e-commerce",
      "shopify",
      "store",
      "retail",
      "sku",
      "cart",
      "checkout",
      "dtc",
      "merchant",
    ],
    discoveryQuestions: [
      "Are we helping shoppers convert, or merchants operate?",
      "What is the #1 ticket or drop-off they can show in analytics?",
    ],
    risks: [
      "Rebuilding checkout unnecessarily",
      "Inventory sync rabbit hole",
      "Vanity redesign without a metric",
    ],
    milestones: [
      {
        title: "Day 0 — Metric lock",
        outcome: "One KPI and one funnel step owned by the MVP.",
      },
      {
        title: "Day 1 — Overlay slice",
        outcome: "Happy path works using sample orders/CSV.",
      },
      {
        title: "Day 2 — Live store",
        outcome: "One merchant runs real traffic or tickets through it.",
      },
      {
        title: "Day 3 — Prove lift",
        outcome: "Before/after on the locked metric; cut extras.",
      },
    ],
    examples: [
      {
        idea: "New Amazon",
        cut: "Post-purchase order hub that deflects “where is my order?” tickets.",
        why: "Marketplaces need liquidity; ticket deflection pays this week.",
      },
    ],
  },
  {
    id: "logistics",
    name: "Logistics / Supply Chain",
    blurb: "Visibility and handoffs — track one lane or one warehouse pain.",
    whyMvp:
      "Shippers pay for fewer surprises. A single lane, SKU, or dock workflow beats a control-tower fantasy.",
    buyer: "Ops manager at a mid-market shipper, 3PL coordinator, or warehouse lead.",
    painPatterns: [
      "Status only exists in email threads",
      "Exception handling too late",
      "Dock scheduling conflicts",
    ],
    mvpShapes: [
      "Shipment status board fed by manual + email updates",
      "Exception alert when ETA slips",
      "Dock appointment booking for one facility",
    ],
    mustHaves: [
      "Shared status everyone trusts",
      "Exception list sorted by money-at-risk",
      "Simple update path for non-technical staff",
    ],
    nonGoals: [
      "Global control tower",
      "Carrier rate shopping engine",
      "Autonomous routing AI",
    ],
    constraints: [
      "Start with human-updated status before EDI/API integrations",
      "Integrations are milestone 2 after board trust",
    ],
    stackHints: {
      frontend: "Next.js ops board",
      backend: "API service or Route Handlers",
      data: "Postgres + event log",
      hosting: "Fly.io / Railway",
    },
    preferredTemplate: "api-service",
    keywords: [
      "logistics",
      "shipping",
      "freight",
      "warehouse",
      "supply chain",
      "fleet",
      "delivery",
      "3pl",
      "tracking",
    ],
    discoveryQuestions: [
      "Which lane or facility loses the most money when status is wrong?",
      "Who is allowed to update status today?",
    ],
    risks: [
      "Boiling the ocean with carrier integrations first",
      "Pretty maps without exception workflows",
      "No single owner for data quality",
    ],
    milestones: [
      {
        title: "Day 0 — Lane lock",
        outcome: "One facility or lane; define statuses and owners.",
      },
      {
        title: "Day 1 — Board slice",
        outcome: "Create shipment → update status → exception flag.",
      },
      {
        title: "Day 2 — Ops shift",
        outcome: "Run one live shift with the board as source of truth.",
      },
      {
        title: "Day 3 — Alert cut",
        outcome: "ETA-slip alerts only; defer carrier API work.",
      },
    ],
    examples: [
      {
        idea: "AI for global supply chain",
        cut: "Exception board for one warehouse inbound dock.",
        why: "Global optimization needs clean local truth first.",
      },
    ],
  },
  {
    id: "b2b-saas",
    name: "B2B SaaS / Productivity",
    blurb: "Teams buy time back — one job, one seat, one weekly ritual.",
    whyMvp:
      "Generic productivity tools are crowded. MVPs win with a sharp job-to-be-done for a specific role and a measurable weekly ritual.",
    buyer: "Team lead who owns a recurring ritual (standup, report, handoff).",
    painPatterns: [
      "Status meetings that could be async",
      "Knowledge trapped in chat",
      "Handoffs drop context",
    ],
    mvpShapes: [
      "Weekly report generator from linked sources",
      "Handoff checklist between two roles",
      "Decision log for one squad",
    ],
    mustHaves: [
      "Empty state that proposes the first ritual",
      "Shareable output (link/PDF/Slack)",
      "Activation metric: first successful ritual completed",
    ],
    nonGoals: [
      "All-in-one work OS",
      "Complex permissions matrix",
      "Marketplace of integrations day one",
    ],
    constraints: [
      "Auth only when sharing or privacy requires it",
      "One primary integration max in v1",
    ],
    stackHints: {
      frontend: "Next.js App Router + Tailwind",
      backend: "Route Handlers",
      data: "SQLite → Postgres",
      hosting: "Vercel",
    },
    preferredTemplate: "web-saas",
    keywords: [
      "saas",
      "b2b",
      "productivity",
      "workflow",
      "dashboard",
      "crm",
      "hr",
      "internal tool",
      "automation",
    ],
    discoveryQuestions: [
      "Which recurring meeting or report would disappear if this worked?",
      "Who is embarrassed when the current process fails?",
    ],
    risks: [
      "Feature parity chase vs Notion/Linear/etc.",
      "Multi-player complexity before single-player value",
      "Vague ICP (“all teams”)",
    ],
    milestones: [
      {
        title: "Day 0 — Ritual lock",
        outcome: "Name the weekly ritual and the role that owns it.",
      },
      {
        title: "Day 1 — Vertical slice",
        outcome: "Input → output artifact works solo.",
      },
      {
        title: "Day 2 — Team of three",
        outcome: "Three people complete one ritual without you driving.",
      },
      {
        title: "Day 3 — Share path",
        outcome: "One share/export; cut secondary surfaces.",
      },
    ],
    examples: [
      {
        idea: "Notion killer",
        cut: "Decision log + owners for one product squad.",
        why: "Beating Notion broadly is hopeless; owning one ritual is not.",
      },
    ],
  },
  {
    id: "local-services",
    name: "Local Services / Marketplace",
    blurb: "Liquidity is hard — start supply-side ops or demand waitlist, not both sides thick.",
    whyMvp:
      "Two-sided markets die from empty nights. MVPs should pick a side, concentrate geography, and prove bookings before building reputation graphs.",
    buyer: "Service pro (supply) or busy local customer (demand) in one city niche.",
    painPatterns: [
      "Pros lose leads in Instagram DMs",
      "Customers cannot find trusted help fast",
      "No-shows and scheduling pain",
    ],
    mvpShapes: [
      "Supply CRM: lead → quote → book for one trade",
      "Demand waitlist in one neighborhood",
      "Booking page + deposit for one provider",
    ],
    mustHaves: [
      "Geographic and category concentration",
      "Booking or lead handoff that completes",
      "Manual matching OK in v1 (concierge)",
    ],
    nonGoals: [
      "National marketplace day one",
      "Complex review graph before volume",
      "In-app chat sprawl",
    ],
    constraints: [
      "Concierge/ops matching is a valid MVP",
      "Payments/deposits only if no-show is the core pain",
    ],
    stackHints: {
      frontend: "Next.js landing + simple booking",
      backend: "Route Handlers",
      data: "SQLite/Postgres",
      hosting: "Vercel",
    },
    preferredTemplate: "landing-waitlist",
    keywords: [
      "marketplace",
      "local",
      "booking",
      "on-demand",
      "home services",
      "tutor",
      "cleaner",
      "freelancer",
      "gig",
    ],
    discoveryQuestions: [
      "Which side pays first — supply or demand?",
      "What is the tightest geo + category we can dominate?",
    ],
    risks: [
      "Cold-start both sides simultaneously",
      "Expanding cities before repeat usage",
      "Building app chrome instead of booking completion",
    ],
    milestones: [
      {
        title: "Day 0 — Side + geo lock",
        outcome: "Pick supply OR demand wedge; one city niche.",
      },
      {
        title: "Day 1 — Booking slice",
        outcome: "Lead/book → confirm → done with manual ops.",
      },
      {
        title: "Day 2 — Ten real jobs",
        outcome: "Complete 10 transactions with concierge if needed.",
      },
      {
        title: "Day 3 — Automate one step",
        outcome: "Automate only the most repeated handoff.",
      },
    ],
    examples: [
      {
        idea: "Uber for X nationwide",
        cut: "Booking page + deposit for 10 vetted cleaners in one district.",
        why: "Liquidity compounds locally; nationwide is vanity.",
      },
    ],
  },
  {
    id: "legaltech",
    name: "LegalTech",
    blurb: "Lawyers bill time — automate drafting/intake for one matter type.",
    whyMvp:
      "Firms buy hours back on repetitive matters. Narrow intake → draft → review loops beat “AI lawyer” positioning.",
    buyer: "Associate or small-firm partner drowning in one repetitive matter type.",
    painPatterns: [
      "Intake questionnaires reinvented per matter",
      "First-draft documents from templates slowly",
      "Client updates scattered in email",
    ],
    mvpShapes: [
      "Guided intake → draft contract for one agreement type",
      "Matter status page for clients",
      "Clause checklist for review",
    ],
    mustHaves: [
      "Attorney-in-the-loop before anything client-facing is final",
      "Template provenance clear",
      "Export to DOCX/PDF",
    ],
    nonGoals: [
      "Autonomous legal advice to consumers",
      "Full practice management suite",
      "Multi-jurisdiction engine day one",
    ],
    constraints: [
      "Never present outputs as legal advice without attorney review UX",
      "Start with one jurisdiction and matter type",
    ],
    stackHints: {
      frontend: "Next.js document workspace",
      backend: "Route Handlers",
      data: "Postgres + object storage for docs",
      hosting: "Vercel",
    },
    preferredTemplate: "web-saas",
    keywords: [
      "legal",
      "law",
      "lawyer",
      "contract",
      "compliance",
      "attorney",
      "matter",
      "clause",
    ],
    discoveryQuestions: [
      "Which matter type is high-volume and low-variance?",
      "Who reviews before the client sees anything?",
    ],
    risks: [
      "Overclaiming autonomy / legal advice",
      "Jurisdiction sprawl",
      "Ignoring export into existing Word workflows",
    ],
    milestones: [
      {
        title: "Day 0 — Matter lock",
        outcome: "One agreement type, one jurisdiction, review gate defined.",
      },
      {
        title: "Day 1 — Draft slice",
        outcome: "Intake → draft → attorney edit → export.",
      },
      {
        title: "Day 2 — Desk pilot",
        outcome: "One attorney completes a real matter draft in the tool.",
      },
      {
        title: "Day 3 — Disclaimer cut",
        outcome: "Hard review gate + clear non-advice labeling.",
      },
    ],
    examples: [
      {
        idea: "AI lawyer for everyone",
        cut: "NDA intake → first draft → attorney review checklist.",
        why: "Liability and trust demand a human gate; speed still wins.",
      },
    ],
  },
  {
    id: "climate",
    name: "Climate / Energy",
    blurb: "Measurable ops or reporting wedges — not planetary dashboards.",
    whyMvp:
      "Climate buyers fund measurable reductions or compliance reporting. Vague “impact platforms” stall; facility-level or fleet-level wedges ship.",
    buyer: "Sustainability lead or facilities/fleet ops with a reporting burden.",
    painPatterns: [
      "Manual ESG data collection",
      "Energy bills not actionable",
      "Fleet emissions estimates in spreadsheets",
    ],
    mvpShapes: [
      "Utility bill → anomaly + one action",
      "Fleet fuel CSV → monthly emissions estimate",
      "Vendor survey → single scope-3 slice report",
    ],
    mustHaves: [
      "Methodology notes (how numbers are computed)",
      "One facility/fleet scope",
      "Export suitable for an existing report",
    ],
    nonGoals: [
      "Planetary digital twin",
      "Carbon marketplace day one",
      "Full ESG suite across all scopes",
    ],
    constraints: [
      "Show assumptions; avoid false precision",
      "Prefer operational action over vanity offsets in v1",
    ],
    stackHints: {
      frontend: "Next.js report UI",
      backend: "API + batch jobs",
      data: "Postgres",
      hosting: "Fly.io / Vercel",
    },
    preferredTemplate: "web-saas",
    keywords: [
      "climate",
      "carbon",
      "energy",
      "emissions",
      "esg",
      "sustainability",
      "solar",
      "fleet",
    ],
    discoveryQuestions: [
      "Is the buyer optimizing ops cost, or producing a report?",
      "What data already exists in CSVs/bills?",
    ],
    risks: [
      "Greenwashing claims",
      "Boiling ocean of scopes/categories",
      "No path to an operational action",
    ],
    milestones: [
      {
        title: "Day 0 — Scope lock",
        outcome: "One facility or fleet; methodology paragraph written.",
      },
      {
        title: "Day 1 — Estimate slice",
        outcome: "Import → number → recommended action.",
      },
      {
        title: "Day 2 — Operator trial",
        outcome: "One real bill/fleet CSV produces a trusted output.",
      },
      {
        title: "Day 3 — Export",
        outcome: "Report export; strip marketplace/offset features.",
      },
    ],
    examples: [
      {
        idea: "Platform to save the planet",
        cut: "Utility bill anomaly → one facilities action checklist.",
        why: "Planetary scope is un-ownable; bill action is paid work.",
      },
    ],
  },
];
