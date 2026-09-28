import { notFound } from "next/navigation";
import { LaunchpadClient } from "@/components/venture/LaunchpadClient";
import { BehaviorTracker } from "@/components/venture/BehaviorTracker";
import { getLaunchPack, getVenture } from "@/lib/venture/store";

export const dynamic = "force-dynamic";

export default async function LaunchpadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const pack = getLaunchPack(venture.id);
  if (!pack) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl">No launch pack yet</h1>
        <p className="mt-2 text-sm text-[var(--ink)]/60">
          Run the discovery quiz to generate infrastructure + experts.
        </p>
        <a href="/create" className="mt-6 inline-block text-[var(--teal)]">
          Start discovery →
        </a>
      </div>
    );
  }

  return (
    <>
      <BehaviorTracker slug={slug} path="/launchpad" />
      <LaunchpadClient slug={slug} initial={pack} />
    </>
  );
}
