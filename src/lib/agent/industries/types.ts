import type { ScaffoldTemplateId } from "../types";

export type IndustryId =
  | "healthtech"
  | "fintech"
  | "edtech"
  | "proptech"
  | "ecommerce"
  | "logistics"
  | "b2b-saas"
  | "local-services"
  | "legaltech"
  | "climate";

export type IndustryExample = {
  idea: string;
  cut: string;
  why: string;
};

export type IndustryPack = {
  id: IndustryId;
  name: string;
  blurb: string;
  /** Why this industry urgently needs MVPs */
  whyMvp: string;
  buyer: string;
  painPatterns: string[];
  mvpShapes: string[];
  mustHaves: string[];
  nonGoals: string[];
  constraints: string[];
  stackHints: {
    frontend: string;
    backend: string;
    data: string;
    hosting: string;
  };
  preferredTemplate: ScaffoldTemplateId;
  keywords: string[];
  discoveryQuestions: [string, string];
  risks: string[];
  milestones: { title: string; outcome: string }[];
  examples: IndustryExample[];
};
