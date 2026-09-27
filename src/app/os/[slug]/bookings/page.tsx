import { notFound } from "next/navigation";
import {
  getVenture,
  listBookings,
  listCustomers,
  listOrders,
  listServices,
} from "@/lib/venture/store";

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const bookings = listBookings(venture.id);
  const services = Object.fromEntries(listServices(venture.id).map((s) => [s.id, s]));
  const customers = Object.fromEntries(listCustomers(venture.id).map((c) => [c.id, c]));
  const orders = listOrders(venture.id);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">Operations</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">Bookings & Orders</h1>
      </div>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Bookings</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {bookings.map((b) => (
            <li key={b.id} className="border-b border-[var(--ink)]/5 py-2">
              <strong>{customers[b.customerId]?.name || "Customer"}</strong>
              {" · "}
              {services[b.serviceId]?.name || "Service"}
              {" · "}
              {new Date(b.startsAt).toLocaleString()}
              {" · "}
              {b.status}
              {b.notes ? ` — ${b.notes}` : ""}
            </li>
          ))}
          {bookings.length === 0 && <li className="text-[var(--ink)]/45">No bookings yet.</li>}
        </ul>
      </section>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Orders</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {orders.map((o) => (
            <li key={o.id} className="border-b border-[var(--ink)]/5 py-2">
              ${o.amount} · {o.status} · {customers[o.customerId]?.name || "Customer"} ·{" "}
              {new Date(o.createdAt).toLocaleString()}
            </li>
          ))}
          {orders.length === 0 && <li className="text-[var(--ink)]/45">No orders yet.</li>}
        </ul>
      </section>
    </div>
  );
}
