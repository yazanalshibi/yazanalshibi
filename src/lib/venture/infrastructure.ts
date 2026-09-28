import type { MvpSpec } from "./discovery";
import { recommendTools, type ToolId } from "./tools";

export type InfraConnectionId = ToolId;

export type InfraConnection = {
  id: InfraConnectionId;
  name: string;
  why: string;
  setupMinutes: number;
  status: "recommended" | "optional" | "required";
  connectUrl: string;
  docsHint: string;
  botTask: string;
  category?: string;
  forNextProjects?: boolean;
};

export function recommendInfrastructure(
  spec: MvpSpec,
  industryId?: string,
  ideaHint?: string,
): InfraConnection[] {
  return recommendTools(spec, industryId, ideaHint).map((t) => ({
    id: t.id,
    name: t.name,
    why: t.why,
    setupMinutes: t.setupMinutes,
    status: t.status,
    connectUrl: t.connectUrl,
    docsHint: t.docsHint,
    botTask: t.botTask,
    category: t.category,
    forNextProjects: t.forNextProjects,
  }));
}
