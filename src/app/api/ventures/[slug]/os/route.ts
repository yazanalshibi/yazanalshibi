import { NextResponse } from "next/server";
import {
  computeMetrics,
  generateAdvisorInsight,
  ventureHealth,
} from "@/lib/venture/advisor";
import {
  getVenture,
  listBookings,
  listCustomers,
  listEvents,
  listLeads,
  listLocations,
  listOrders,
  listRecommendations,
  listServices,
  listStaff,
} from "@/lib/venture/store";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });

  const metrics = computeMetrics(venture.id);
  return NextResponse.json({
    venture,
    metrics,
    health: ventureHealth(metrics),
    customers: listCustomers(venture.id),
    leads: listLeads(venture.id),
    services: listServices(venture.id),
    bookings: listBookings(venture.id),
    orders: listOrders(venture.id),
    staff: listStaff(venture.id),
    locations: listLocations(venture.id),
    events: listEvents(venture.id).slice(0, 50),
    recommendations: listRecommendations(venture.id),
  });
}

export async function POST(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture) return NextResponse.json({ error: "not found" }, { status: 404 });
  const recommendation = generateAdvisorInsight(venture);
  return NextResponse.json({ recommendation });
}
