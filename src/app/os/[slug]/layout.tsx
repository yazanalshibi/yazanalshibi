import { notFound } from "next/navigation";
import { AdminNav } from "@/components/venture/AdminNav";
import { getPreferences, getVenture } from "@/lib/venture/store";

export const dynamic = "force-dynamic";

export default async function OsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const prefs = getPreferences(venture.id);

  return (
    <div className="flex min-h-screen flex-col bg-[#eef4f2] text-[var(--ink)] lg:flex-row">
      <AdminNav
        slug={venture.slug}
        name={venture.name}
        live={venture.live}
        brand={prefs.brand}
      />
      <main className="flex-1 px-5 py-6 sm:px-8">{children}</main>
    </div>
  );
}
