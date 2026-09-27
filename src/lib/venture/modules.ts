import type { ModuleDef, ModuleId } from "./types";

export const MODULE_CATALOG: ModuleDef[] = [
  { id: "website", name: "Website", blurb: "Live customer pages and landing flows.", category: "experience" },
  { id: "crm", name: "CRM", blurb: "Leads, customers, notes, and pipeline.", category: "crm" },
  { id: "booking", name: "Booking", blurb: "Appointments, slots, and confirmations.", category: "experience" },
  { id: "payments", name: "Payments", blurb: "Checkout and order recording.", category: "ops" },
  { id: "membership", name: "Membership", blurb: "Recurring plans and member benefits.", category: "growth" },
  { id: "reviews", name: "Reviews", blurb: "Post-service review requests.", category: "growth" },
  { id: "analytics", name: "Analytics", blurb: "Events, KPIs, and venture health.", category: "intelligence" },
  { id: "inventory", name: "Inventory", blurb: "Stock levels and consumption.", category: "ops" },
  { id: "staff", name: "Staff", blurb: "People, roles, and assignments.", category: "ops" },
  { id: "locations", name: "Locations", blurb: "Sites, hours, and local performance.", category: "ops" },
];

export function moduleById(id: ModuleId): ModuleDef {
  return MODULE_CATALOG.find((m) => m.id === id)!;
}
