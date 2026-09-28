import type { BrandIdentity } from "./preferences";
import { defaultBrand } from "./preferences";

export type PlugFeatureId =
  | "website"
  | "crm"
  | "booking"
  | "payments"
  | "membership"
  | "reviews"
  | "ecommerce"
  | "analytics"
  | "vr_storefront";

export type PlugFeature = {
  id: PlugFeatureId;
  name: string;
  blurb: string;
  enabled: boolean;
};

export type ColorKit = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
};

export type VrMode = {
  enabled: boolean;
  target: "meta_quest" | "meta_glasses" | "browser_fallback";
  largeTargets: boolean;
  spatialNav: boolean;
  voiceHints: boolean;
};

export type BuildSession = {
  features: PlugFeature[];
  colorKitId: string;
  colorKits: ColorKit[];
  brand: BrandIdentity;
  vr: VrMode;
  sessionAdvisorTip: string;
};

export const COLOR_KITS: ColorKit[] = [
  {
    id: "teal_ink",
    name: "Teal Ink",
    primary: "#0f766e",
    secondary: "#12202b",
    accent: "#c45c26",
    background: "#0f1c24",
    foreground: "#f3f7f6",
  },
  {
    id: "midnight_lime",
    name: "Midnight Lime",
    primary: "#65a30d",
    secondary: "#14532d",
    accent: "#facc15",
    background: "#052e16",
    foreground: "#f7fee7",
  },
  {
    id: "ocean_sand",
    name: "Ocean Sand",
    primary: "#0284c7",
    secondary: "#0c4a6e",
    accent: "#f59e0b",
    background: "#082f49",
    foreground: "#f0f9ff",
  },
  {
    id: "slate_rose",
    name: "Slate Rose",
    primary: "#e11d48",
    secondary: "#1e293b",
    accent: "#fb7185",
    background: "#0f172a",
    foreground: "#fff1f2",
  },
];

export function defaultPlugFeatures(modules: string[]): PlugFeature[] {
  const on = new Set(modules);
  const all: PlugFeature[] = [
    { id: "website", name: "Website", blurb: "Public pages + landing", enabled: true },
    { id: "crm", name: "CRM", blurb: "Leads and customers", enabled: true },
    { id: "booking", name: "Booking", blurb: "Appointments and slots", enabled: on.has("booking") },
    { id: "payments", name: "Payments", blurb: "Checkout and deposits", enabled: on.has("payments") },
    { id: "membership", name: "Membership", blurb: "Recurring plans", enabled: on.has("membership") },
    { id: "reviews", name: "Reviews", blurb: "Post-service asks", enabled: on.has("reviews") },
    { id: "ecommerce", name: "E-commerce", blurb: "Catalog + cart", enabled: on.has("ecommerce") },
    { id: "analytics", name: "Analytics", blurb: "Events + health", enabled: true },
    {
      id: "vr_storefront",
      name: "VR storefront (Meta)",
      blurb: "Large-target, spatial-friendly live experience for Quest / Meta glasses",
      enabled: false,
    },
  ];
  return all;
}

export function applyColorKit(brand: BrandIdentity, kit: ColorKit): BrandIdentity {
  return {
    ...brand,
    primary: kit.primary,
    secondary: kit.secondary,
    accent: kit.accent,
    background: kit.background,
    foreground: kit.foreground,
    surface: "rgba(255,255,255,0.06)",
    muted: "rgba(255,255,255,0.7)",
  };
}

export function createBuildSession(
  ventureName: string,
  modules: string[],
  advisorTip: string,
): BuildSession {
  const kit = COLOR_KITS[0];
  return {
    features: defaultPlugFeatures(modules),
    colorKitId: kit.id,
    colorKits: COLOR_KITS,
    brand: applyColorKit(defaultBrand(ventureName), kit),
    vr: {
      enabled: false,
      target: "browser_fallback",
      largeTargets: true,
      spatialNav: true,
      voiceHints: false,
    },
    sessionAdvisorTip: advisorTip,
  };
}
