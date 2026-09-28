import type { CSSProperties } from "react";
import type { BrandIdentity } from "./preferences";

export function brandCssVars(brand: BrandIdentity): CSSProperties {
  const radius =
    brand.radius === "sharp" ? "0px" : brand.radius === "round" ? "18px" : "8px";
  return {
    ["--brand-primary" as string]: brand.primary,
    ["--brand-secondary" as string]: brand.secondary,
    ["--brand-accent" as string]: brand.accent,
    ["--brand-bg" as string]: brand.background,
    ["--brand-fg" as string]: brand.foreground,
    ["--brand-surface" as string]: brand.surface,
    ["--brand-muted" as string]: brand.muted,
    ["--brand-radius" as string]: radius,
  };
}

export function brandToneLabel(tone: BrandIdentity["tone"]) {
  switch (tone) {
    case "bold":
      return "Bold & direct";
    case "warm":
      return "Warm & approachable";
    case "editorial":
      return "Editorial";
    default:
      return "Minimal";
  }
}
