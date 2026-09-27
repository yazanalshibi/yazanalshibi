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
  | "locations";

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
};
