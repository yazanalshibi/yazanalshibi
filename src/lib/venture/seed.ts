import { randomUUID } from "node:crypto";
import { createVentureFromIdea } from "./blueprint";
import { generateAdvisorInsight } from "./advisor";
import {
  createBooking,
  createLead,
  createOrder,
  getVenture,
  listServices,
  resetDb,
  saveExpense,
  saveLocation,
  saveService,
  saveStaff,
  saveVenture,
  trackEvent,
  upsertCustomer,
} from "./store";

/** Seeds the Mobile Car Detailing demo venture with a partial operating history */
export function seedMobileDetailingDemo() {
  resetDb();
  const venture = createVentureFromIdea(
    "Mobile detailing membership for condo residents in Toronto",
  );
  venture.slug = "shineon";
  venture.live = true;
  venture.stage = "live";
  venture.updatedAt = new Date().toISOString();
  saveVenture(venture);

  for (const offer of venture.blueprint.offers) {
    saveService({
      id: randomUUID(),
      ventureId: venture.id,
      name: offer.name,
      description: offer.description,
      price: offer.price,
      durationMinutes: offer.name.includes("Full") ? 120 : 60,
      active: true,
    });
  }

  const location = saveLocation({
    id: randomUUID(),
    ventureId: venture.id,
    name: "Toronto Mobile Hub",
    address: "Serving downtown condos",
    city: "Toronto",
  });

  saveStaff({
    id: randomUUID(),
    ventureId: venture.id,
    name: "Alex Rivera",
    role: "Detail Specialist",
    email: "alex@shineon.demo",
  });

  saveExpense({
    id: randomUUID(),
    ventureId: venture.id,
    category: "Supplies",
    amount: 120,
    note: "Detailing kits restock",
    createdAt: new Date().toISOString(),
  });

  for (let i = 0; i < 18; i++) {
    trackEvent(venture.id, "page_viewed", { page: "home", locationId: location.id });
  }

  const customer = upsertCustomer({
    ventureId: venture.id,
    name: "Jordan Lee",
    email: "jordan@example.com",
    phone: "+1-416-555-0142",
    source: "condo_partner",
  });

  createLead({
    ventureId: venture.id,
    customerId: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    source: "condo_partner",
    status: "won",
  });
  trackEvent(venture.id, "lead_created", { email: customer.email });

  const service =
    listServices(venture.id).find((s) => s.name.includes("Full")) ||
    listServices(venture.id)[0];

  const booking = createBooking({
    ventureId: venture.id,
    customerId: customer.id,
    serviceId: service.id,
    startsAt: new Date(Date.now() + 86400000).toISOString(),
    status: "completed",
    notes: "Lobby Level P2 — black SUV",
  });
  trackEvent(venture.id, "booking_created", { bookingId: booking.id });

  const order = createOrder({
    ventureId: venture.id,
    customerId: customer.id,
    serviceId: service.id,
    bookingId: booking.id,
    amount: service.price,
    status: "paid",
    source: "checkout",
  });
  trackEvent(venture.id, "payment_completed", { orderId: order.id, amount: service.price });
  trackEvent(venture.id, "order_created", { orderId: order.id });

  createLead({
    ventureId: venture.id,
    name: "Sam Patel",
    email: "sam@example.com",
    source: "instagram",
    status: "new",
  });
  trackEvent(venture.id, "lead_created", { email: "sam@example.com" });

  const saved = getVenture(venture.id)!;
  generateAdvisorInsight(saved);
  return saved;
}
