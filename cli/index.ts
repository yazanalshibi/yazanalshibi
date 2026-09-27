#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildTrainingCorpus,
  listIndustries,
  getIndustry,
} from "../src/lib/agent/industries";
import { buildMvpPlan, formatPlanMarkdown } from "../src/lib/agent/planner";
import { generateScaffold, listTemplates } from "../src/lib/agent/scaffold";
import type { ScaffoldTemplateId } from "../src/lib/agent/types";

function printHelp() {
  console.log(`MVP Specialist CLI

Usage:
  npm run cli -- industries
  npm run cli -- plan --idea "..." [--industry <id>]
  npm run cli -- scaffold <name> --template <id> [--industry <id>] [--idea "..."]
  npm run cli -- train-export [--out path.jsonl]
  npm run cli -- templates

Industries:
${listIndustries()
  .map((i) => `  ${i.id.padEnd(16)} ${i.name} — ${i.blurb}`)
  .join("\n")}

Templates:
${listTemplates()
  .map((t) => `  ${t.id.padEnd(18)} ${t.blurb}`)
  .join("\n")}
`);
}

function getFlag(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

async function scaffold(args: string[]) {
  const name = args[0];
  const industryFlag = getFlag(args, "--industry");
  const idea = getFlag(args, "--idea") || "";
  const pack = industryFlag ? getIndustry(industryFlag) : null;
  if (industryFlag && !pack) {
    console.error(`Unknown industry: ${industryFlag}`);
    process.exit(1);
  }

  const template = (getFlag(args, "--template") ||
    pack?.preferredTemplate ||
    "web-saas") as ScaffoldTemplateId;

  if (!name) {
    console.error("Missing project name.");
    printHelp();
    process.exit(1);
  }

  const valid = listTemplates().some((t) => t.id === template);
  if (!valid) {
    console.error(`Unknown template: ${template}`);
    process.exit(1);
  }

  const target = path.resolve(process.cwd(), name);
  const files = generateScaffold({ name, idea, template });

  // Drop an industry playbook note into the scaffold
  if (pack) {
    files.push({
      path: "INDUSTRY.md",
      contents: [
        `# ${pack.name} playbook`,
        "",
        pack.whyMvp,
        "",
        `## Buyer`,
        pack.buyer,
        "",
        `## MVP shapes`,
        ...pack.mvpShapes.map((s) => `- ${s}`),
        "",
        `## Must-haves`,
        ...pack.mustHaves.map((s) => `- ${s}`),
        "",
        `## Non-goals`,
        ...pack.nonGoals.map((s) => `- ${s}`),
        "",
        `## Constraints`,
        ...pack.constraints.map((s) => `- ${s}`),
        "",
      ].join("\n"),
    });
  }

  for (const file of files) {
    const full = path.join(target, file.path);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, file.contents, "utf8");
  }

  console.log(`Scaffolded ${files.length} files in ${target}`);
  console.log(`Template: ${template}`);
  if (pack) console.log(`Industry: ${pack.id} (${pack.name})`);
  if (idea) console.log(`Idea: ${idea}`);
  console.log("\nNext:");
  console.log(`  cd ${name}`);
  console.log("  npm install");
  console.log("  npm run dev   # or npm start / node bin/run.mjs");
}

function plan(args: string[]) {
  const idea = getFlag(args, "--idea");
  const industryId = getFlag(args, "--industry");
  if (!idea) {
    console.error('Missing --idea "..."');
    process.exit(1);
  }
  if (industryId && !getIndustry(industryId)) {
    console.error(`Unknown industry: ${industryId}`);
    process.exit(1);
  }
  const mvp = buildMvpPlan([{ role: "user", content: idea }], industryId);
  console.log(formatPlanMarkdown(mvp));
}

async function trainExport(args: string[]) {
  const out =
    getFlag(args, "--out") ||
    path.resolve(process.cwd(), "training/mvp-specialist-corpus.jsonl");
  const corpus = buildTrainingCorpus();
  const body = corpus.map((row) => JSON.stringify(row)).join("\n") + "\n";
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, body, "utf8");
  console.log(`Wrote ${corpus.length} training rows → ${out}`);
  console.log(
    "Use for fine-tuning / evals. Also available at GET /api/training?format=jsonl",
  );
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    printHelp();
    return;
  }

  if (cmd === "templates") {
    for (const t of listTemplates()) {
      console.log(`${t.id}\t${t.label}\t${t.blurb}`);
    }
    return;
  }

  if (cmd === "industries") {
    for (const i of listIndustries()) {
      console.log(`${i.id}\t${i.name}\t${i.blurb}`);
    }
    return;
  }

  if (cmd === "plan") {
    plan(args.slice(1));
    return;
  }

  if (cmd === "train-export") {
    await trainExport(args.slice(1));
    return;
  }

  if (cmd === "scaffold") {
    await scaffold(args.slice(1));
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  printHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
