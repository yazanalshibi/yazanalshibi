#!/usr/bin/env node
/**
 * Dual-mode build for local + Cloudflare Workers Builds.
 *
 * - Local / OPENNEXT_CHILD=1 → `next build` only
 * - CI (Workers Builds)      → `opennextjs-cloudflare build`
 *   (OpenNext re-invokes this script with OPENNEXT_CHILD=1 for the Next step)
 */
import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: false,
  });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

const openNextChild = process.env.OPENNEXT_CHILD === "1";
const onCi = process.env.CI === "true" || process.env.WORKERS_CI === "1";

if (openNextChild || !onCi) {
  run("npx", ["next", "build"]);
}

// Top-level CI build: produce the Workers bundle OpenNext/Wrangler expect
process.env.OPENNEXT_CHILD = "1";
run("npx", ["opennextjs-cloudflare", "build"]);
