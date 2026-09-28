/** Starter curriculum packs — used when building learning / kids ventures */

export type CurriculumWeek = {
  week: number;
  title: string;
  outcome: string;
};

export type CurriculumPack = {
  id: string;
  title: string;
  weeks: CurriculumWeek[];
};

export function kidsBusinessSchoolCurriculum(): CurriculumPack {
  return {
    id: "venture_kids_v1",
    title: "Mini-Venture Sprint (ages 8–14)",
    weeks: [
      {
        week: 1,
        title: "Idea → customer",
        outcome: "Kid picks one problem and sketches who pays.",
      },
      {
        week: 2,
        title: "Offer & price",
        outcome: "Simple offer card with a real price parents can understand.",
      },
      {
        week: 3,
        title: "Sell something small",
        outcome: "One real sale, preorder, or commitment (even $5 counts).",
      },
      {
        week: 4,
        title: "Reflect & share",
        outcome: "Short pitch + parent progress note + next-step membership invite.",
      },
    ],
  };
}

export function curriculumForIndustry(industryId: string, idea?: string): CurriculumPack | null {
  const t = `${idea || ""}`.toLowerCase();
  if (
    industryId === "edtech" ||
    /kid|child|youth|business school|entrepreneur/.test(t)
  ) {
    return kidsBusinessSchoolCurriculum();
  }
  return null;
}
