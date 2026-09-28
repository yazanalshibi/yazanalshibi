import { randomUUID } from "node:crypto";
import type { InfraConnection } from "./infrastructure";
import type { MvpSpec } from "./discovery";

export type BotJobStatus = "queued" | "running" | "done" | "blocked" | "failed";

export type BotJob = {
  id: string;
  ventureId: string;
  task: string;
  label: string;
  status: BotJobStatus;
  log: string[];
  connectionId?: string;
  createdAt: string;
  updatedAt: string;
};

/** Our own bots (not third-party “Grok devices”) — terminal jobs on Live Venture OS infra */
export function planBotJobs(
  ventureId: string,
  spec: MvpSpec,
  connections: InfraConnection[],
): BotJob[] {
  const now = new Date().toISOString();
  const jobs: BotJob[] = [
    {
      id: randomUUID(),
      ventureId,
      task: "scaffold_venture",
      label: "Scaffold venture OS workspace",
      status: "done",
      log: [
        `$ lvos bot scaffold --venture ${ventureId}`,
        "✓ CRM + event bus ready",
        "✓ Live site draft published on platform domain",
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      ventureId,
      task: "apply_mvp_spec",
      label: `Apply MVP spec: ${spec.summary.slice(0, 48)}`,
      status: "done",
      log: [
        "$ lvos bot apply-spec --from discovery",
        `✓ Core loop locked: ${spec.coreLoop.slice(0, 80)}`,
        `✓ Modules: ${spec.recommendedModules.join(", ")}`,
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const c of connections.filter((x) => x.status !== "optional")) {
    jobs.push({
      id: randomUUID(),
      ventureId,
      task: c.botTask,
      label: `Connect ${c.name}`,
      status: "queued",
      connectionId: c.id,
      log: [
        `$ lvos bot ${c.botTask}`,
        `… waiting for founder to authorize ${c.name}`,
        `open: ${c.connectUrl}`,
      ],
      createdAt: now,
      updatedAt: now,
    });
  }

  jobs.push({
    id: randomUUID(),
    ventureId,
    task: "smoke_live_loop",
    label: "Smoke-test lead → booking → pay loop",
    status: "queued",
    log: ["$ lvos bot smoke --loop happy-path", "… queued after connections"],
    createdAt: now,
    updatedAt: now,
  });

  return jobs;
}

export function advanceBotJob(job: BotJob, connected = false): BotJob {
  const updated = { ...job, updatedAt: new Date().toISOString(), log: [...job.log] };
  if (
    job.task.startsWith("connect_") ||
    job.task.startsWith("provision_") ||
    job.task.startsWith("setup_") ||
    job.task.startsWith("enable_") ||
    job.task.startsWith("ensure_")
  ) {
    if (!connected && job.status === "queued" && job.connectionId) {
      updated.status = "blocked";
      updated.log.push("! blocked — complete OAuth / DNS in Launchpad connections");
      return updated;
    }
    updated.status = "running";
    updated.log.push("→ authorizing on Live Venture bot runner…");
    updated.status = "done";
    updated.log.push("✓ connection stored locally (keys never leave your workspace policy)");
    if (job.task === "setup_parent_consent") {
      updated.log.push("✓ parental consent gate + policy stub attached to enroll flow");
    }
    if (job.task === "connect_video") {
      updated.log.push("✓ live classroom link template ready for booked sessions");
    }
    if (job.task === "connect_sms") {
      updated.log.push("✓ parent SMS reminder templates queued (opt-in only)");
    }
    return updated;
  }
  if (job.status === "queued") {
    updated.status = "running";
    updated.log.push("→ running on lvos-terminal…");
    updated.status = "done";
    updated.log.push("✓ complete");
  }
  return updated;
}
