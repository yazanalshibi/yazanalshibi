#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateScaffold, listTemplates } from "../src/lib/agent/scaffold";
import type { ScaffoldTemplateId } from "../src/lib/agent/types";

function printHelp() {
  console.log(`MVP Specialist CLI

Usage:
  npm run cli -- scaffold <name> --template <id> [--idea "..."]
  npm run cli -- templates

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
  const template = (getFlag(args, "--template") || "web-saas") as ScaffoldTemplateId;
  const idea = getFlag(args, "--idea") || "";

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

  for (const file of files) {
    const full = path.join(target, file.path);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, file.contents, "utf8");
  }

  console.log(`Scaffolded ${files.length} files in ${target}`);
  console.log(`Template: ${template}`);
  if (idea) console.log(`Idea: ${idea}`);
  console.log("\nNext:");
  console.log(`  cd ${name}`);
  console.log("  npm install");
  console.log("  npm run dev   # or npm start / node bin/run.mjs");
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
