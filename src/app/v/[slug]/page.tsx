import { notFound } from "next/navigation";
import { LiveVentureSite } from "@/components/venture/LiveVentureSite";
import { getPreferences, getVenture, listServices } from "@/lib/venture/store";

export const dynamic = "force-dynamic";

export default async function LivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const prefs = getPreferences(venture.id);
  if (!venture.live) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0f1c24] px-6 text-center text-white">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">{venture.name}</h1>
          <p className="mt-3 text-white/60">This venture is not live yet. Launch it from the admin OS.</p>
          <a href={`/os/${venture.slug}`} className="mt-6 inline-block text-[#5eead4]">
            Open admin →
          </a>
        </div>
      </div>
    );
  }
  return (
    <LiveVentureSite
      venture={venture}
      services={listServices(venture.id)}
      brand={prefs.brand}
    />
  );
}
