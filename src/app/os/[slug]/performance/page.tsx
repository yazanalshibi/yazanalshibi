import { notFound } from "next/navigation";
import { computeMetrics, ventureHealth } from "@/lib/venture/advisor";
import { getVenture, listEvents } from "@/lib/venture/store";

export default async function PerformancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const metrics = computeMetrics(venture.id);
  const health = ventureHealth(metrics);
  const events = listEvents(venture.id).slice(0, 30);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">Screen 5</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">Performance</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Page views", metrics.pageViews],
          ["Leads", metrics.leads],
          ["Paid orders", metrics.paidOrders],
          ["Revenue", `$${metrics.revenue}`],
        ].map(([k, v]) => (
          <div key={String(k)} className="border border-[var(--ink)]/10 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink)]/45">{k}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">{v}</p>
          </div>
        ))}
      </div>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Venture health</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {health.map((h) => (
            <li key={h.dimension} className="flex justify-between border-b border-[var(--ink)]/5 py-1">
              <span>{h.dimension}</span>
              <span className="text-[var(--ink)]/55">{h.status}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--ink)]/70">
          Current priority:{" "}
          {metrics.revenue === 0
            ? "Improve conversion to first paid booking before increasing acquisition spend."
            : "Improve customer retention before increasing acquisition spending."}
        </p>
      </section>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Event stream</h2>
        <ul className="mt-3 space-y-1 font-mono text-xs">
          {events.map((e) => (
            <li key={e.id}>
              {e.createdAt} · {e.type}
            </li>
          ))}
          {events.length === 0 && <li className="font-sans text-sm text-[var(--ink)]/45">No events yet.</li>}
        </ul>
      </section>
    </div>
  );
}
