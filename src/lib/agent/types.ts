export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type MvpPlan = {
  name: string;
  oneLiner: string;
  problem: string;
  targetUser: string;
  coreLoop: string;
  features: string[];
  nonGoals: string[];
  stack: {
    frontend: string;
    backend: string;
    data: string;
    hosting: string;
  };
  milestones: { title: string; outcome: string }[];
  risks: string[];
  scaffoldCommand: string;
};

export type ScaffoldTemplateId =
  | "web-saas"
  | "landing-waitlist"
  | "api-service"
  | "cli-tool";

export type ScaffoldRequest = {
  name: string;
  idea: string;
  template: ScaffoldTemplateId;
};
