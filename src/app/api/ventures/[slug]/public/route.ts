import { NextResponse } from "next/server";
import {
  createBooking,
  createLead,
  createOrder,
  getVenture,
  listServices,
  trackEvent,
  upsertCustomer,
} from "@/lib/venture/store";

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const venture = getVenture(slug);
  if (!venture || !venture.live) {
    return NextResponse.json({ error: "venture not live" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    action,
    name,
    email,
    phone,
    source,
    serviceId,
    startsAt,
    notes,
  } = body as {
    action?: "lead" | "booking" | "checkout" | "page_view";
    name?: string;
    email?: string;
    phone?: string;
    source?: string;
    serviceId?: string;
    startsAt?: string;
    notes?: string;
  };

  if (action === "page_view") {
    trackEvent(venture.id, "page_viewed", { page: notes || "home" });
    return NextResponse.json({ ok: true });
  }

  if (!name || !email) {
    return NextResponse.json({ error: "name and email required" }, { status: 400 });
  }

  const customer = upsertCustomer({
    ventureId: venture.id,
    name,
    email,
    phone,
    source: source || "website",
  });

  if (action === "lead" || !action) {
    const lead = createLead({
      ventureId: venture.id,
      customerId: customer.id,
      name,
      email,
      phone,
      source: source || "website",
    });
    trackEvent(venture.id, "lead_created", { leadId: lead.id, email });
    trackEvent(venture.id, "form_submitted", { email });
    return NextResponse.json({ ok: true, customer, lead });
  }

  const services = listServices(venture.id);
  const service = services.find((s) => s.id === serviceId) || services[0];
  if (!service) {
    return NextResponse.json({ error: "no services" }, { status: 400 });
  }

  if (action === "booking") {
    const booking = createBooking({
      ventureId: venture.id,
      customerId: customer.id,
      serviceId: service.id,
      startsAt: startsAt || new Date(Date.now() + 86400000).toISOString(),
      notes,
    });
    trackEvent(venture.id, "booking_created", { bookingId: booking.id });
    createLead({
      ventureId: venture.id,
      customerId: customer.id,
      name,
      email,
      phone,
      source: source || "booking",
      status: "qualified",
    });
    return NextResponse.json({ ok: true, customer, booking, service });
  }

  if (action === "checkout") {
    const booking = createBooking({
      ventureId: venture.id,
      customerId: customer.id,
      serviceId: service.id,
      startsAt: startsAt || new Date(Date.now() + 86400000).toISOString(),
      notes,
    });
    const order = createOrder({
      ventureId: venture.id,
      customerId: customer.id,
      serviceId: service.id,
      bookingId: booking.id,
      amount: service.price,
      status: "paid",
      source: "checkout",
    });
    trackEvent(venture.id, "booking_created", { bookingId: booking.id });
    trackEvent(venture.id, "order_created", { orderId: order.id });
    trackEvent(venture.id, "payment_completed", { orderId: order.id, amount: order.amount });
    createLead({
      ventureId: venture.id,
      customerId: customer.id,
      name,
      email,
      phone,
      source: "checkout",
      status: "won",
    });
    return NextResponse.json({ ok: true, customer, booking, order, service });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
