import { notFound } from "next/navigation";
import { getVenture, listRecommendations } from "@/lib/venture/store";
import { AdvisorList, AdvisorRefresh } from "@/components/venture/AdvisorClient";

export default async function AdvisorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const recommendations = listRecommendations(venture.id);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">Screen 6</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">AI Advisor</h1>
          <p className="mt-2 text-sm text-[var(--ink)]/65">
            Recommendations grounded in CRM, bookings, orders, and event data — not generic advice.
          </p>
        </div>
        <AdvisorRefresh slug={venture.slug} />
      </div>
      <AdvisorList recommendations={recommendations} />
    </div>
  );
}
