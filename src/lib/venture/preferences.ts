/** Privacy, brand, dashboard, and UX preference types for Live Venture OS */

export type DataCategory =
  | "customers"
  | "leads"
  | "bookings"
  | "orders"
  | "analytics"
  | "recommendations"
  | "brand"
  | "pages"
  | "services"
  | "staff";

export type RetentionDays = 1 | 7 | 30 | 90 | 365 | 0; // 0 = while shared / until revoked

export type CloudShareRule = {
  category: DataCategory;
  share: boolean;
  retentionDays: RetentionDays;
  label: string;
  description: string;
};

export type BrandIdentity = {
  displayName: string;
  tagline: string;
  logoText: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  surface: string;
  muted: string;
  fontDisplay: string;
  fontBody: string;
  radius: "sharp" | "soft" | "round";
  tone: "minimal" | "bold" | "warm" | "editorial";
  applyToAdmin: boolean;
};

export type DashboardWidgetId =
  | "metrics"
  | "health"
  | "ai"
  | "activity"
  | "bookings"
  | "leads"
  | "cloud"
  | "ux"
  | "brand_preview";

export type DashboardWidgetPref = {
  id: DashboardWidgetId;
  visible: boolean;
  order: number;
  size: "s" | "m" | "l";
};

export type InsightPref = {
  showHealth: boolean;
  showAi: boolean;
  showUxSuggestions: boolean;
  compactMetrics: boolean;
  density: "comfortable" | "compact";
};

export type UxSuggestion = {
  id: string;
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  basedOn: string;
  createdAt: string;
  dismissed?: boolean;
};

export type BehaviorHit = {
  id: string;
  ventureId: string;
  path: string;
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
};

export type VenturePreferences = {
  ventureId: string;
  cloudShare: CloudShareRule[];
  brand: BrandIdentity;
  dashboard: DashboardWidgetPref[];
  insights: InsightPref;
  uxSuggestions: UxSuggestion[];
  updatedAt: string;
};

export const DATA_CATEGORY_META: {
  category: DataCategory;
  label: string;
  description: string;
  defaultShare: boolean;
  defaultRetention: RetentionDays;
}[] = [
  {
    category: "analytics",
    label: "Analytics events",
    description: "Anonymous page views and funnel events for benchmarks.",
    defaultShare: true,
    defaultRetention: 30,
  },
  {
    category: "recommendations",
    label: "AI recommendations",
    description: "Advisor outputs (no raw customer PII).",
    defaultShare: true,
    defaultRetention: 90,
  },
  {
    category: "brand",
    label: "Brand identity",
    description: "Colors, fonts, and public brand tokens.",
    defaultShare: true,
    defaultRetention: 0,
  },
  {
    category: "pages",
    label: "Website pages",
    description: "Public copy and structure of the live site.",
    defaultShare: true,
    defaultRetention: 0,
  },
  {
    category: "services",
    label: "Services & pricing",
    description: "Catalog of offers (not customer records).",
    defaultShare: false,
    defaultRetention: 30,
  },
  {
    category: "leads",
    label: "Leads",
    description: "Lead names, emails, and pipeline status.",
    defaultShare: false,
    defaultRetention: 7,
  },
  {
    category: "customers",
    label: "Customers",
    description: "Customer PII and lifetime value.",
    defaultShare: false,
    defaultRetention: 7,
  },
  {
    category: "bookings",
    label: "Bookings",
    description: "Appointments tied to customers.",
    defaultShare: false,
    defaultRetention: 7,
  },
  {
    category: "orders",
    label: "Orders & payments",
    description: "Order amounts and payment status.",
    defaultShare: false,
    defaultRetention: 30,
  },
  {
    category: "staff",
    label: "Staff profiles",
    description: "Employee names and roles.",
    defaultShare: false,
    defaultRetention: 30,
  },
];

export function defaultBrand(name: string): BrandIdentity {
  return {
    displayName: name,
    tagline: "Built live. Improved with real data.",
    logoText: name.slice(0, 2).toUpperCase(),
    primary: "#0f766e",
    secondary: "#12202b",
    accent: "#c45c26",
    background: "#0f1c24",
    foreground: "#f3f7f6",
    surface: "rgba(255,255,255,0.05)",
    muted: "rgba(243,247,246,0.65)",
    fontDisplay: "Syne",
    fontBody: "DM Sans",
    radius: "soft",
    tone: "minimal",
    applyToAdmin: false,
  };
}

export function defaultDashboard(): DashboardWidgetPref[] {
  return [
    { id: "metrics", visible: true, order: 0, size: "l" },
    { id: "ai", visible: true, order: 1, size: "m" },
    { id: "health", visible: true, order: 2, size: "m" },
    { id: "ux", visible: true, order: 3, size: "m" },
    { id: "cloud", visible: true, order: 4, size: "m" },
    { id: "activity", visible: true, order: 5, size: "l" },
    { id: "leads", visible: false, order: 6, size: "m" },
    { id: "bookings", visible: false, order: 7, size: "m" },
    { id: "brand_preview", visible: false, order: 8, size: "s" },
  ];
}

export function defaultCloudShare(): CloudShareRule[] {
  return DATA_CATEGORY_META.map((m) => ({
    category: m.category,
    share: m.defaultShare,
    retentionDays: m.defaultRetention,
    label: m.label,
    description: m.description,
  }));
}

export function defaultPreferences(ventureId: string, name: string): VenturePreferences {
  return {
    ventureId,
    cloudShare: defaultCloudShare(),
    brand: defaultBrand(name),
    dashboard: defaultDashboard(),
    insights: {
      showHealth: true,
      showAi: true,
      showUxSuggestions: true,
      compactMetrics: false,
      density: "comfortable",
    },
    uxSuggestions: [],
    updatedAt: new Date().toISOString(),
  };
}
