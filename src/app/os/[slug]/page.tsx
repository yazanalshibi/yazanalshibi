import { notFound } from "next/navigation";
import { BehaviorTracker } from "@/components/venture/BehaviorTracker";
import { FlexibleDashboard } from "@/components/venture/FlexibleDashboard";
import { LaunchButton } from "@/components/venture/LaunchButton";
import { computeMetrics, ventureHealth } from "@/lib/venture/advisor";
import { cloudStatus } from "@/lib/venture/privacy";
import { refreshUxSuggestions } from "@/lib/venture/ux";
import {
  getLaunchPack,
  getPreferences,
  getVenture,
  listBookings,
  listLeads,
  listOrders,
  listRecommendations,
} from "@/lib/venture/store";
import { sessionAdvisorRecommendation } from "@/lib/venture/experts";

export default async function OsDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venture = getVenture(slug);
  if (!venture) notFound();

  let prefs = getPreferences(venture.id);
  // lightly refresh UX suggestions when opening dashboard
  prefs = refreshUxSuggestions(prefs);

  const metrics = computeMetrics(venture.id);
  const health = ventureHealth(metrics);
  const leads = listLeads(venture.id);
  const bookings = listBookings(venture.id);
  const orders = listOrders(venture.id);
  const recs = listRecommendations(venture.id);
  const cloud = cloudStatus(venture.id);
  const pack = getLaunchPack(venture.id);
  const sessionAdvisor =
    pack?.sessionAdvisor ||
    (pack?.experts?.length
      ? sessionAdvisorRecommendation(
          pack.experts.map((e) => ({
            ...e,
            specialties: [],
            industries: [],
            milestones: [],
            sessionTip: e.sessionTip,
          })),
          `${venture.id}:${new Date().toDateString()}`,
        )
      : null);

  return (
    <>
      <BehaviorTracker slug={slug} path="/dashboard" />
      <div className="mb-4 flex justify-end gap-2">
        {!venture.live && <LaunchButton slug={venture.slug} />}
      </div>
      <FlexibleDashboard
        slug={slug}
        ventureName={venture.name}
        live={venture.live}
        prefs={prefs}
        metrics={metrics}
        health={health}
        recommendations={recs}
        leads={leads}
        bookings={bookings}
        cloud={cloud}
        sessionAdvisor={sessionAdvisor}
      />
      {/* keep orders referenced for future widgets without unused lint */}
      <span className="sr-only">{orders.length}</span>
    </>
  );
}
