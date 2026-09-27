import Link from "next/link";

export function SiteHeader({ tone = "light" }: { tone?: "light" | "ink" }) {
  const onInk = tone === "ink";
  return (
    <header className="relative z-20 flex items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-12">
      <Link href="/" className="group flex items-baseline gap-2">
        <span
          className={`font-[family-name:var(--font-display)] text-xl tracking-tight sm:text-2xl ${
            onInk ? "text-[var(--sand)]" : "text-[var(--ink)]"
          }`}
        >
          MVP Specialist
        </span>
        <span
          className={`hidden text-xs uppercase tracking-[0.18em] sm:inline ${
            onInk ? "text-[var(--sand)]/55" : "text-[var(--ink)]/45"
          }`}
        >
          AI agent
        </span>
      </Link>
      <nav className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/#method"
          className={`hidden text-sm sm:inline ${
            onInk ? "text-[var(--sand)]/70 hover:text-[var(--sand)]" : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
          }`}
        >
          Method
        </Link>
        <Link
          href="/#cli"
          className={`hidden text-sm sm:inline ${
            onInk ? "text-[var(--sand)]/70 hover:text-[var(--sand)]" : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
          }`}
        >
          CLI
        </Link>
        <Link
          href="/agent"
          className="inline-flex items-center bg-[var(--teal)] px-4 py-2 text-sm font-medium text-[var(--foam)] transition hover:bg-[var(--teal-deep)]"
        >
          Open agent
        </Link>
      </nav>
    </header>
  );
}
