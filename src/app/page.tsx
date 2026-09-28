import Link from "next/link";

export default function Home() {
  return (
    <div className="atmosphere min-h-screen text-[var(--ink)]">
      <div className="relative overflow-hidden">
        <div className="grid-fade pointer-events-none absolute inset-0" />
        <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl">
              Live Venture OS
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/45">
              AI-native venture operating infrastructure
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/agent"
              className="hidden border border-[var(--ink)]/15 px-4 py-2 text-sm sm:inline"
            >
              MVP Specialist
            </Link>
            <Link
              href="/create"
              className="bg-[var(--teal)] px-4 py-2 text-sm font-medium text-[var(--foam)]"
            >
              Create venture
            </Link>
          </div>
        </header>

        <section className="relative grid min-h-[calc(100svh-5rem)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 flex flex-col justify-center px-5 pb-16 pt-8 sm:px-8 lg:px-12">
            <p className="reveal text-xs uppercase tracking-[0.22em] text-[var(--ink)]/50">
              Build live · Operate · Learn · Scale
            </p>
            <h1 className="reveal reveal-delay-1 mt-4 max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(2.6rem,7vw,5.4rem)] font-bold leading-[0.95] tracking-tight">
              Live Venture OS
            </h1>
            <p className="reveal reveal-delay-2 mt-6 max-w-md text-lg text-[var(--ink)]/70">
              Turn an idea into a live operating business. Native CRM + ERP,
              plug-and-play modules, real customer data, and an AI advisor —
              in one system.
            </p>
            <div className="reveal reveal-delay-3 mt-9 flex flex-wrap gap-3">
              <Link
                href="/create"
                className="bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-[var(--foam)]"
              >
                Answer 8 questions · launch ASAP
              </Link>
              <Link
                href="/create"
                className="border border-[var(--ink)]/20 px-6 py-3 text-sm"
              >
                Try ShineOn demo
              </Link>
            </div>
          </div>
          <div className="relative min-h-[40vh] lg:min-h-full">
            <div className="hero-visual absolute inset-0" />
            <svg
              className="stroke-draw pointer-events-none absolute bottom-10 left-1/2 h-10 w-[min(70%,22rem)] -translate-x-1/2 opacity-80"
              viewBox="0 0 240 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 12h40l16-8 16 16 16-12 16 10 16-6h80"
                stroke="var(--sand)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </section>
      </div>

      <section className="border-t border-[var(--ink)]/10 px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            Not a prototype factory. An operating system for businesses.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--ink)]/65">
            Idea → Configure → Launch live → Real users → Real data → AI analysis →
            Improve → Validate → Scale.
          </p>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              ["01", "Launch", "Publish a customer experience in minutes, not months."],
              ["02", "Operate", "CRM, bookings, orders, staff, and locations in one model."],
              ["03", "Learn", "Events, venture health, and AI recommendations from real activity."],
            ].map(([n, t, d]) => (
              <li key={n}>
                <p className="text-xs tracking-[0.2em] text-[var(--signal)]">{n}</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl">{t}</h3>
                <p className="mt-2 text-[var(--ink)]/65">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-[var(--ink)]/10 px-5 py-8 text-sm text-[var(--ink)]/50 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl justify-between gap-4">
          <span>Live Venture OS · V0.1</span>
          <Link href="/agent" className="hover:text-[var(--ink)]">
            MVP Specialist (industry trainer)
          </Link>
        </div>
      </footer>
    </div>
  );
}
