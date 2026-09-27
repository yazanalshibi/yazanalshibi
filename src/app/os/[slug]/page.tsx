import Link from "next/link";
import { notFound } from "next/navigation";
import { computeMetrics, ventureHealth } from "@/lib/venture/advisor";
import {
  getVenture,
  listBookings,
  listLeads,
  listOrders,
  listRecommendations,
} from "@/lib/venture/store";
import { LaunchButton } from "@/components/venture/LaunchButton";

export default async function OsDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();

  const metrics = computeMetrics(venture.id);
  const health = ventureHealth(metrics);
  const leads = listLeads(venture.id);
  const bookings = listBookings(venture.id);
  const orders = listOrders(venture.id);
  const recs = listRecommendations(venture.id);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">Dashboard</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">{venture.name}</h1>
          <p className="mt-1 text-sm text-[var(--ink)]/60">
            Stage: {venture.stage} · Modules: {venture.modules.join(", ")}
          </p>
        </div>
        <div className="flex gap-2">
          {!venture.live && <LaunchButton slug={venture.slug} />}
          <Link
            href={`/v/${venture.slug}`}
            className="border border-[var(--ink)]/15 px-4 py-2 text-sm"
          >
            Live site
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Revenue", `$${metrics.revenue}`],
          ["Customers", String(metrics.customers)],
          ["Bookings", String(metrics.bookings)],
          ["Leads", String(metrics.leads)],
          ["Conversion", `${metrics.conversion}%`],
          ["AOV", `$${metrics.averageOrder}`],
        ].map(([label, value]) => (
          <div key={label} className="border border-[var(--ink)]/10 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">{label}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">AI observation</h2>
          {recs[0] ? (
            <div className="mt-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--signal)]">
                {recs[0].priority} priority
              </p>
              <p className="mt-2 font-medium">{recs[0].title}</p>
              <p className="mt-2 text-sm text-[var(--ink)]/70">{recs[0].body}</p>
              <Link href={`/os/${slug}/advisor`} className="mt-4 inline-block text-sm text-[var(--teal)]">
                Open AI Advisor →
              </Link>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--ink)]/60">
              Launch the venture and collect activity to unlock recommendations.
            </p>
          )}
        </section>

        <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Venture health</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {health.map((h) => (
              <li key={h.dimension} className="flex justify-between gap-4 border-b border-[var(--ink)]/5 py-1">
                <span>{h.dimension}</span>
                <span className="text-[var(--ink)]/55">{h.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Recent activity</h2>
        <div className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">Leads</p>
            <ul className="mt-2 space-y-1">
              {leads.slice(0, 5).map((l) => (
                <li key={l.id}>
                  {l.name} · {l.status}
                </li>
              ))}
              {leads.length === 0 && <li className="text-[var(--ink)]/45">None yet</li>}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">Bookings</p>
            <ul className="mt-2 space-y-1">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id}>
                  {b.status} · {new Date(b.startsAt).toLocaleString()}
                </li>
              ))}
              {bookings.length === 0 && <li className="text-[var(--ink)]/45">None yet</li>}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">Orders</p>
            <ul className="mt-2 space-y-1">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id}>
                  ${o.amount} · {o.status}
                </li>
              ))}
              {orders.length === 0 && <li className="text-[var(--ink)]/45">None yet</li>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
