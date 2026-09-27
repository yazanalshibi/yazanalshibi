import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type {
  Booking,
  CloudMirror,
  Customer,
  DbShape,
  Expense,
  LaunchPack,
  Lead,
  Location,
  Order,
  Recommendation,
  ServiceItem,
  StaffMember,
  Venture,
  VentureEvent,
} from "./types";
import type { BehaviorHit, VenturePreferences } from "./preferences";
import { defaultPreferences } from "./preferences";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "venture-os.json");
const CLOUD_DIR = path.join(DATA_DIR, "cloud");

function emptyDb(): DbShape {
  return {
    ventures: [],
    customers: [],
    leads: [],
    services: [],
    bookings: [],
    orders: [],
    expenses: [],
    staff: [],
    locations: [],
    events: [],
    recommendations: [],
    preferences: [],
    behavior: [],
    cloudMirrors: [],
    launchPacks: [],
  };
}

function migrate(db: DbShape): DbShape {
  if (!db.preferences) db.preferences = [];
  if (!db.behavior) db.behavior = [];
  if (!db.cloudMirrors) db.cloudMirrors = [];
  if (!db.launchPacks) db.launchPacks = [];
  return db;
}

function ensureDb(): DbShape {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CLOUD_DIR)) fs.mkdirSync(CLOUD_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const db = emptyDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    return db;
  }
  const raw = JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as DbShape;
  return migrate(raw);
}

function saveDb(db: DbShape) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CLOUD_DIR)) fs.mkdirSync(CLOUD_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function mutate<T>(fn: (db: DbShape) => T): T {
  const db = ensureDb();
  const result = fn(db);
  saveDb(db);
  return result;
}

export function listVentures(): Venture[] {
  return ensureDb().ventures.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getVenture(idOrSlug: string): Venture | null {
  const db = ensureDb();
  return (
    db.ventures.find((v) => v.id === idOrSlug || v.slug === idOrSlug) || null
  );
}

export function saveVenture(venture: Venture): Venture {
  return mutate((db) => {
    const idx = db.ventures.findIndex((v) => v.id === venture.id);
    if (idx >= 0) db.ventures[idx] = venture;
    else db.ventures.push(venture);
    // ensure preferences exist
    if (!db.preferences.find((p) => p.ventureId === venture.id)) {
      db.preferences.push(defaultPreferences(venture.id, venture.name));
    }
    return venture;
  });
}

export function getPreferences(ventureId: string): VenturePreferences {
  const db = ensureDb();
  const existing = db.preferences.find((p) => p.ventureId === ventureId);
  if (existing) return existing;
  const venture = db.ventures.find((v) => v.id === ventureId);
  return defaultPreferences(ventureId, venture?.name || "Venture");
}

export function savePreferences(prefs: VenturePreferences): VenturePreferences {
  return mutate((db) => {
    prefs.updatedAt = new Date().toISOString();
    const idx = db.preferences.findIndex((p) => p.ventureId === prefs.ventureId);
    if (idx >= 0) db.preferences[idx] = prefs;
    else db.preferences.push(prefs);
    const venture = db.ventures.find((v) => v.id === prefs.ventureId);
    if (venture) {
      venture.brand = prefs.brand;
      venture.updatedAt = prefs.updatedAt;
    }
    return prefs;
  });
}

export function trackBehavior(
  ventureId: string,
  path: string,
  action: string,
  meta?: Record<string, unknown>,
): BehaviorHit {
  return mutate((db) => {
    const hit: BehaviorHit = {
      id: randomUUID(),
      ventureId,
      path,
      action,
      meta,
      createdAt: new Date().toISOString(),
    };
    db.behavior.push(hit);
    // keep last 2000
    if (db.behavior.length > 2000) {
      db.behavior = db.behavior.slice(-2000);
    }
    return hit;
  });
}

export function listBehavior(ventureId: string): BehaviorHit[] {
  return ensureDb()
    .behavior.filter((b) => b.ventureId === ventureId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listCloudMirrors(ventureId: string): CloudMirror[] {
  return ensureDb().cloudMirrors.filter((m) => m.ventureId === ventureId);
}

export function replaceCloudMirrors(ventureId: string, mirrors: CloudMirror[]) {
  return mutate((db) => {
    db.cloudMirrors = [
      ...db.cloudMirrors.filter((m) => m.ventureId !== ventureId),
      ...mirrors,
    ];
    // also write per-venture cloud snapshot file (local "cloud" mirror)
    const file = path.join(CLOUD_DIR, `${ventureId}.json`);
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          ventureId,
          syncedAt: new Date().toISOString(),
          mirrors,
        },
        null,
        2,
      ),
    );
    return mirrors;
  });
}

export function purgeExpiredCloudMirrors(now = Date.now()) {
  return mutate((db) => {
    const before = db.cloudMirrors.length;
    db.cloudMirrors = db.cloudMirrors.filter((m) => {
      if (!m.expiresAt) return true;
      return new Date(m.expiresAt).getTime() > now;
    });
    return { removed: before - db.cloudMirrors.length, remaining: db.cloudMirrors.length };
  });
}

export function trackEvent(
  ventureId: string,
  type: string,
  payload: Record<string, unknown> = {},
): VentureEvent {
  return mutate((db) => {
    const event: VentureEvent = {
      id: randomUUID(),
      ventureId,
      type,
      payload,
      createdAt: new Date().toISOString(),
    };
    db.events.push(event);
    return event;
  });
}

export function listEvents(ventureId: string): VentureEvent[] {
  return ensureDb()
    .events.filter((e) => e.ventureId === ventureId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listCustomers(ventureId: string): Customer[] {
  return ensureDb().customers.filter((c) => c.ventureId === ventureId);
}

export function upsertCustomer(input: Omit<Customer, "id" | "createdAt" | "ltv" | "tags" | "notes"> & Partial<Customer>): Customer {
  return mutate((db) => {
    const existing = db.customers.find(
      (c) => c.ventureId === input.ventureId && c.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (existing) {
      Object.assign(existing, {
        name: input.name || existing.name,
        phone: input.phone ?? existing.phone,
        source: input.source ?? existing.source,
        notes: input.notes ?? existing.notes,
        tags: input.tags ?? existing.tags,
      });
      return existing;
    }
    const customer: Customer = {
      id: randomUUID(),
      ventureId: input.ventureId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      source: input.source,
      tags: input.tags || [],
      notes: input.notes || "",
      ltv: input.ltv || 0,
      createdAt: new Date().toISOString(),
    };
    db.customers.push(customer);
    return customer;
  });
}

export function listLeads(ventureId: string): Lead[] {
  return ensureDb().leads.filter((l) => l.ventureId === ventureId);
}

export function createLead(input: Omit<Lead, "id" | "createdAt" | "status" | "notes"> & Partial<Lead>): Lead {
  return mutate((db) => {
    const lead: Lead = {
      id: randomUUID(),
      ventureId: input.ventureId,
      customerId: input.customerId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      status: input.status || "new",
      source: input.source,
      notes: input.notes || "",
      createdAt: new Date().toISOString(),
    };
    db.leads.push(lead);
    return lead;
  });
}

export function updateLeadStatus(id: string, status: Lead["status"]): Lead | null {
  return mutate((db) => {
    const lead = db.leads.find((l) => l.id === id);
    if (!lead) return null;
    lead.status = status;
    return lead;
  });
}

export function listServices(ventureId: string): ServiceItem[] {
  return ensureDb().services.filter((s) => s.ventureId === ventureId);
}

export function saveService(service: ServiceItem): ServiceItem {
  return mutate((db) => {
    const idx = db.services.findIndex((s) => s.id === service.id);
    if (idx >= 0) db.services[idx] = service;
    else db.services.push(service);
    return service;
  });
}

export function listBookings(ventureId: string): Booking[] {
  return ensureDb().bookings.filter((b) => b.ventureId === ventureId);
}

export function createBooking(input: Omit<Booking, "id" | "createdAt" | "status"> & Partial<Booking>): Booking {
  return mutate((db) => {
    const booking: Booking = {
      id: randomUUID(),
      ventureId: input.ventureId,
      customerId: input.customerId,
      serviceId: input.serviceId,
      startsAt: input.startsAt,
      status: input.status || "scheduled",
      notes: input.notes,
      createdAt: new Date().toISOString(),
    };
    db.bookings.push(booking);
    return booking;
  });
}

export function listOrders(ventureId: string): Order[] {
  return ensureDb().orders.filter((o) => o.ventureId === ventureId);
}

export function createOrder(input: Omit<Order, "id" | "createdAt" | "status"> & Partial<Order>): Order {
  return mutate((db) => {
    const order: Order = {
      id: randomUUID(),
      ventureId: input.ventureId,
      customerId: input.customerId,
      serviceId: input.serviceId,
      bookingId: input.bookingId,
      amount: input.amount,
      status: input.status || "paid",
      source: input.source,
      createdAt: new Date().toISOString(),
    };
    db.orders.push(order);
    const customer = db.customers.find((c) => c.id === input.customerId);
    if (customer && order.status === "paid") customer.ltv += order.amount;
    return order;
  });
}

export function listExpenses(ventureId: string): Expense[] {
  return ensureDb().expenses.filter((e) => e.ventureId === ventureId);
}

export function listStaff(ventureId: string): StaffMember[] {
  return ensureDb().staff.filter((s) => s.ventureId === ventureId);
}

export function listLocations(ventureId: string): Location[] {
  return ensureDb().locations.filter((l) => l.ventureId === ventureId);
}

export function saveStaff(member: StaffMember): StaffMember {
  return mutate((db) => {
    const idx = db.staff.findIndex((s) => s.id === member.id);
    if (idx >= 0) db.staff[idx] = member;
    else db.staff.push(member);
    return member;
  });
}

export function saveLocation(location: Location): Location {
  return mutate((db) => {
    const idx = db.locations.findIndex((l) => l.id === location.id);
    if (idx >= 0) db.locations[idx] = location;
    else db.locations.push(location);
    return location;
  });
}

export function saveExpense(expense: Expense): Expense {
  return mutate((db) => {
    db.expenses.push(expense);
    return expense;
  });
}

export function listRecommendations(ventureId: string): Recommendation[] {
  return ensureDb()
    .recommendations.filter((r) => r.ventureId === ventureId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveRecommendation(rec: Recommendation): Recommendation {
  return mutate((db) => {
    db.recommendations.unshift(rec);
    return rec;
  });
}

export function getLaunchPack(ventureId: string): LaunchPack | null {
  return ensureDb().launchPacks.find((p) => p.ventureId === ventureId) || null;
}

export function saveLaunchPack(pack: LaunchPack): LaunchPack {
  return mutate((db) => {
    pack.updatedAt = new Date().toISOString();
    const idx = db.launchPacks.findIndex((p) => p.ventureId === pack.ventureId);
    if (idx >= 0) db.launchPacks[idx] = pack;
    else db.launchPacks.push(pack);
    return pack;
  });
}

export function resetDb(seed?: DbShape) {
  saveDb(seed || emptyDb());
}

export { DB_PATH, DATA_DIR, CLOUD_DIR };
