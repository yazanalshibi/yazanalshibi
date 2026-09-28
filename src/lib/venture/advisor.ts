import { randomUUID } from "node:crypto";
import {
  listBookings,
  listCustomers,
  listEvents,
  listLeads,
  listOrders,
  listServices,
  saveRecommendation,
} from "./store";
import type { Recommendation, Venture } from "./types";

export type VentureMetrics = {
  revenue: number;
  customers: number;
  bookings: number;
  leads: number;
  conversion: number;
  averageOrder: number;
  pageViews: number;
  paidOrders: number;
};

export function computeMetrics(ventureId: string): VentureMetrics {
  const orders = listOrders(ventureId).filter((o) => o.status === "paid");
  const customers = listCustomers(ventureId);
  const bookings = listBookings(ventureId);
  const leads = listLeads(ventureId);
  const events = listEvents(ventureId);
  const pageViews = events.filter((e) => e.type === "page_viewed").length;
  const revenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const paidOrders = orders.length;
  const conversion =
    pageViews > 0 ? Math.round((leads.length / pageViews) * 1000) / 10 : leads.length > 0 ? 100 : 0;

  return {
    revenue,
    customers: customers.length,
    bookings: bookings.length,
    leads: leads.length,
    conversion,
    averageOrder: paidOrders ? Math.round(revenue / paidOrders) : 0,
    pageViews,
    paidOrders,
  };
}

export function ventureHealth(metrics: VentureMetrics) {
  return [
    {
      dimension: "Market Interest",
      status: metrics.pageViews >= 5 || metrics.leads >= 3 ? "Strong" : metrics.leads > 0 ? "Moderate" : "Early",
    },
    {
      dimension: "Customer Acquisition",
      status: metrics.leads >= 5 ? "Strong" : metrics.leads >= 1 ? "Moderate" : "Early",
    },
    {
      dimension: "Conversion",
      status: metrics.conversion >= 8 ? "Strong" : metrics.conversion > 0 ? "Moderate" : "Needs Data",
    },
    {
      dimension: "Retention",
      status: "Early",
    },
    {
      dimension: "Revenue Validation",
      status: metrics.revenue >= 300 ? "Strong" : metrics.revenue > 0 ? "Moderate" : "Needs Data",
    },
    {
      dimension: "Unit Economics",
      status: metrics.paidOrders >= 3 ? "Moderate" : "Needs Data",
    },
    {
      dimension: "Operational Stability",
      status: metrics.bookings >= 1 ? "Strong" : "Early",
    },
  ];
}

export function generateAdvisorInsight(venture: Venture): Recommendation {
  const metrics = computeMetrics(venture.id);
  const services = listServices(venture.id);
  const membership = services.find((s) => /member/i.test(s.name));
  const bookings = listBookings(venture.id);
  const orders = listOrders(venture.id).filter((o) => o.status === "paid");

  let title = "Launch traffic and watch the first conversions";
  let body =
    "You have a live venture. Drive 50–100 targeted visitors, capture leads, and complete at least 3 paid bookings before changing pricing.";
  let priority: Recommendation["priority"] = "medium";

  if (metrics.revenue === 0 && metrics.leads > 0) {
    title = "Leads exist — close the booking loop";
    body = `You have ${metrics.leads} lead(s) but no paid orders yet. Follow up within 15 minutes and offer an immediate booking slot for your top package.`;
    priority = "high";
  } else if (metrics.paidOrders >= 2 && membership) {
    title = "Test membership right after the second booking";
    body = `Membership customers typically compound LTV. After a customer's second booking, offer “${membership.name}” ($${membership.price}/mo) before they leave the confirmation screen.`;
    priority = "high";
  } else if (metrics.conversion >= 8 && metrics.pageViews >= 5) {
    title = "Conversion is healthy — carefully increase acquisition";
    body = `Conversion is ${metrics.conversion}% with $${metrics.averageOrder} AOV. Keep the current offer and raise acquisition spend gradually while watching CAC.`;
    priority = "medium";
  } else if (bookings.length > orders.length) {
    title = "Bookings outpace payments";
    body = "Some appointments may be uncollected. Require deposit at booking or send a payment link on confirmation.";
    priority = "high";
  } else if (metrics.pageViews === 0) {
    title = "No traffic events yet";
    body = "Share the live URL, open the site yourself, and submit a test lead so the intelligence layer has signal.";
    priority = "high";
  }

  const rec: Recommendation = {
    id: randomUUID(),
    ventureId: venture.id,
    title,
    body,
    priority,
    createdAt: new Date().toISOString(),
  };
  return saveRecommendation(rec);
}
