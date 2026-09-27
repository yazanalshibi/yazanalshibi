import { notFound } from "next/navigation";
import { BehaviorTracker } from "@/components/venture/BehaviorTracker";
import { SettingsClient } from "@/components/venture/SettingsClient";
import { cloudStatus } from "@/lib/venture/privacy";
import { getPreferences, getVenture } from "@/lib/venture/store";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();
  const preferences = getPreferences(venture.id);
  const cloud = cloudStatus(venture.id);

  return (
    <>
      <BehaviorTracker slug={slug} path="/settings" />
      <SettingsClient slug={slug} initial={preferences} cloud={cloud} />
    </>
  );
}
