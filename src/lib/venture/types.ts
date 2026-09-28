export type ModuleId =
  | "website"
  | "crm"
  | "booking"
  | "payments"
  | "membership"
  | "reviews"
  | "analytics"
  | "inventory"
  | "staff"
  | "locations"
  | "classes"
  | "messaging"
  | "video"
  | "consent";

export type VentureStage =
  | "idea"
  | "build"
  | "live"
  | "test"
  | "validate"
  | "operate"
  | "optimize"
  | "scale";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export type ModuleDef = {
  id: ModuleId;
  name: string;
  blurb: string;
  category: "experience" | "crm" | "ops" | "growth" | "intelligence";
};

export type VentureBlueprint = {
  name: string;
  industry: string;
  industryId?: string;
  description: string;
  market: string;
  customer: string;
  problem: string;
  solution: string;
  revenueModel: string;
  channels: string[];
  personas: string[];
  offers: { name: string; type: "service" | "product" | "package"; price: number; description: string }[];
  journey: string[];
  recommendedModules: ModuleId[];
};

export type VentureSitePage = {
  slug: string;
  title: string;
  headline: string;
  body: string;
  cta: string;
};

export type {
  BrandIdentity,
  CloudShareRule,
  DashboardWidgetPref,
  InsightPref,
  UxSuggestion,
  BehaviorHit,
  VenturePreferences,
  DataCategory,
} from "./preferences";

import type { BehaviorHit, BrandIdentity, VenturePreferences } from "./preferences";

export type Venture = {
  id: string;
  organizationId: string;
  slug: string;
  name: string;
  idea: string;
  stage: VentureStage;
  blueprint: VentureBlueprint;
  modules: ModuleId[];
  pages: VentureSitePage[];
  live: boolean;
  brand?: BrandIdentity;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  id: string;
  ventureId: string;
  name: string;
  email: string;
  phone?: string;
  source?: string;
  tags: string[];
  notes: string;
  ltv: number;
  createdAt: string;
};

export type Lead = {
  id: string;
  ventureId: string;
  customerId?: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source?: string;
  notes: string;
  createdAt: string;
};

export type ServiceItem = {
  id: string;
  ventureId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  active: boolean;
};

export type Booking = {
  id: string;
  ventureId: string;
  customerId: string;
  serviceId: string;
  startsAt: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
};

export type Order = {
  id: string;
  ventureId: string;
  customerId: string;
  serviceId?: string;
  bookingId?: string;
  amount: number;
  status: "pending" | "paid" | "refunded";
  source?: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  ventureId: string;
  category: string;
  amount: number;
  note: string;
  createdAt: string;
};

export type StaffMember = {
  id: string;
  ventureId: string;
  name: string;
  role: string;
  email: string;
};

export type Location = {
  id: string;
  ventureId: string;
  name: string;
  address: string;
  city: string;
};

export type VentureEvent = {
  id: string;
  ventureId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type Recommendation = {
  id: string;
  ventureId: string;
  title: string;
  body: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
};

export type CloudMirror = {
  ventureId: string;
  category: string;
  sharedAt: string;
  expiresAt: string | null;
  payload: unknown;
};

export type LaunchPack = {
  ventureId: string;
  answers: Record<string, string | string[]>;
  mvpSpec: {
    summary: string;
    customer: string;
    coreLoop: string;
    monetization: string;
    channels: string[];
    fulfillment: string;
    mustHaves: string[];
    constraint: string;
    geo?: string;
    recommendedModules: string[];
    milestoneFocus: string;
  };
  connections: {
    id: string;
    name: string;
    why: string;
    setupMinutes: number;
    status: string;
    connectUrl: string;
    docsHint: string;
    botTask: string;
    category?: string;
    forNextProjects?: boolean;
    connected?: boolean;
    connectedAt?: string;
  }[];
  /** Tool IDs carried into the next venture on this machine */
  nextProjectTools?: string[];
  curriculum?: {
    id: string;
    title: string;
    weeks: { week: number; title: string; outcome: string }[];
  };
  experts: {
    id: string;
    name: string;
    title: string;
    blurb: string;
    rateHint: string;
    timezone: string;
    why: string;
    score: number;
    sessionTip?: string;
  }[];
  botJobs: {
    id: string;
    task: string;
    label: string;
    status: string;
    log: string[];
    connectionId?: string;
    createdAt: string;
    updatedAt: string;
  }[];
  geoIntel?: unknown;
  govApplications?: {
    id: string;
    title: string;
    category: string;
    status: string;
    agency: string;
    applyUrl?: string;
    checklist: string[];
    why: string;
    typicalDays: string;
  }[];
  buildSession?: unknown;
  sessionAdvisor?: {
    expertId: string;
    name: string;
    title: string;
    tip: string;
  };
  updatedAt: string;
};

export type DbShape = {
  ventures: Venture[];
  customers: Customer[];
  leads: Lead[];
  services: ServiceItem[];
  bookings: Booking[];
  orders: Order[];
  expenses: Expense[];
  staff: StaffMember[];
  locations: Location[];
  events: VentureEvent[];
  recommendations: Recommendation[];
  preferences: VenturePreferences[];
  behavior: BehaviorHit[];
  cloudMirrors: CloudMirror[];
  launchPacks: LaunchPack[];
};
