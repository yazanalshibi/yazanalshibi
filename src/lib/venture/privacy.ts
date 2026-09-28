import type { CloudMirror, Venture } from "./types";
import type { CloudShareRule, DataCategory, VenturePreferences } from "./preferences";
import {
  getPreferences,
  listBookings,
  listCloudMirrors,
  listCustomers,
  listEvents,
  listLeads,
  listOrders,
  listRecommendations,
  listServices,
  listStaff,
  purgeExpiredCloudMirrors,
  replaceCloudMirrors,
  savePreferences,
} from "./store";

function expiresAt(rule: CloudShareRule, from = Date.now()): string | null {
  if (!rule.share) return null;
  if (!rule.retentionDays) return null; // until revoked
  return new Date(from + rule.retentionDays * 86400000).toISOString();
}

function payloadFor(category: DataCategory, venture: Venture) {
  switch (category) {
    case "customers":
      return listCustomers(venture.id).map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        ltv: c.ltv,
        source: c.source,
      }));
    case "leads":
      return listLeads(venture.id).map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        status: l.status,
        source: l.source,
      }));
    case "bookings":
      return listBookings(venture.id);
    case "orders":
      return listOrders(venture.id).map((o) => ({
        id: o.id,
        amount: o.amount,
        status: o.status,
        createdAt: o.createdAt,
      }));
    case "analytics":
      return listEvents(venture.id)
        .filter((e) => !e.type.startsWith("ux_"))
        .slice(0, 200)
        .map((e) => ({ type: e.type, createdAt: e.createdAt, payload: e.payload }));
    case "recommendations":
      return listRecommendations(venture.id).map((r) => ({
        title: r.title,
        body: r.body,
        priority: r.priority,
        createdAt: r.createdAt,
      }));
    case "brand":
      return venture.brand || getPreferences(venture.id).brand;
    case "pages":
      return venture.pages;
    case "services":
      return listServices(venture.id).map((s) => ({
        name: s.name,
        price: s.price,
        description: s.description,
      }));
    case "staff":
      return listStaff(venture.id).map((s) => ({ name: s.name, role: s.role }));
    default:
      return null;
  }
}

/** Sync selected categories to the local cloud mirror with retention */
export function syncCloudShare(venture: Venture, prefs?: VenturePreferences) {
  purgeExpiredCloudMirrors();
  const preferences = prefs || getPreferences(venture.id);
  const now = Date.now();
  const mirrors: CloudMirror[] = [];

  for (const rule of preferences.cloudShare) {
    if (!rule.share) continue;
    mirrors.push({
      ventureId: venture.id,
      category: rule.category,
      sharedAt: new Date(now).toISOString(),
      expiresAt: expiresAt(rule, now),
      payload: payloadFor(rule.category, venture),
    });
  }

  replaceCloudMirrors(venture.id, mirrors);
  return {
    sharedCategories: mirrors.map((m) => m.category),
    mirrors,
    localOnly: preferences.cloudShare.filter((r) => !r.share).map((r) => r.category),
  };
}

export function cloudStatus(ventureId: string) {
  purgeExpiredCloudMirrors();
  const prefs = getPreferences(ventureId);
  const mirrors = listCloudMirrors(ventureId);
  return {
    policy: prefs.cloudShare,
    activeMirrors: mirrors.map((m) => ({
      category: m.category,
      sharedAt: m.sharedAt,
      expiresAt: m.expiresAt,
      itemCount: Array.isArray(m.payload) ? m.payload.length : m.payload ? 1 : 0,
    })),
    localFirst: true,
    note: "All business data is saved locally first. Cloud mirrors only include categories you enable, and expire per retention.",
  };
}

export function updateShareRules(
  ventureId: string,
  rules: CloudShareRule[],
): VenturePreferences {
  const prefs = getPreferences(ventureId);
  prefs.cloudShare = rules;
  return savePreferences(prefs);
}
