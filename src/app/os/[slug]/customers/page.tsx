import { notFound } from "next/navigation";
import { getVenture, listCustomers, listLeads } from "@/lib/venture/store";

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const customers = listCustomers(venture.id);
  const leads = listLeads(venture.id);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">CRM</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">Customers & Leads</h1>
      </div>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Leads</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[var(--ink)]/45">
              <tr>
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-[var(--ink)]/5">
                  <td className="py-2">{l.name}</td>
                  <td>{l.email}</td>
                  <td>{l.status}</td>
                  <td>{l.source || "—"}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-[var(--ink)]/45">
                    No leads yet — submit one from the live site.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-[var(--ink)]/10 bg-white/70 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Customers</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.12em] text-[var(--ink)]/45">
              <tr>
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>LTV</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-[var(--ink)]/5">
                  <td className="py-2">{c.name}</td>
                  <td>{c.email}</td>
                  <td>${c.ltv}</td>
                  <td>{c.source || "—"}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-[var(--ink)]/45">
                    No customers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
