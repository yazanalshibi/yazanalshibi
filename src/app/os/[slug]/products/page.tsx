import { notFound } from "next/navigation";
import { getVenture, listLocations, listServices, listStaff } from "@/lib/venture/store";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const services = listServices(venture.id);
  const staff = listStaff(venture.id);
  const locations = listLocations(venture.id);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">ERP</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
          Products, Staff & Locations
        </h1>
      </div>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Services & packages</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {services.map((s) => (
            <li key={s.id} className="flex justify-between border-b border-[var(--ink)]/5 py-2">
              <span>
                <strong>{s.name}</strong> — {s.description}
              </span>
              <span>${s.price}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Staff</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {staff.map((s) => (
              <li key={s.id}>
                {s.name} · {s.role}
              </li>
            ))}
            {staff.length === 0 && <li className="text-[var(--ink)]/45">No staff yet.</li>}
          </ul>
        </section>
        <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Locations</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {locations.map((l) => (
              <li key={l.id}>
                {l.name} · {l.city}
              </li>
            ))}
            {locations.length === 0 && <li className="text-[var(--ink)]/45">No locations yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
