import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="atmosphere min-h-screen text-[var(--ink)]">
      <div className="relative overflow-hidden">
        <div className="grid-fade pointer-events-none absolute inset-0" />
        <SiteHeader />

        <section className="relative grid min-h-[calc(100svh-5rem)] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 flex flex-col justify-center px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-24">
            <p className="reveal text-xs uppercase tracking-[0.22em] text-[var(--ink)]/50">
              Yazan Alshibi · AI agent
            </p>
            <h1 className="reveal reveal-delay-1 mt-4 max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(3rem,9vw,6.4rem)] font-bold leading-[0.92] tracking-tight">
              MVP Specialist
            </h1>
            <p className="reveal reveal-delay-2 mt-6 max-w-md text-lg text-[var(--ink)]/70 sm:text-xl">
              An AI agent that turns raw ideas into scoped plans and local
              scaffolds — chat in the browser, or run the CLI.
            </p>
            <div className="reveal reveal-delay-3 mt-9 flex flex-wrap gap-3">
              <Link
                href="/agent"
                className="bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-[var(--foam)] transition hover:bg-[var(--teal-deep)]"
              >
                Plan an MVP
              </Link>
              <a
                href="#cli"
                className="border border-[var(--ink)]/20 bg-[var(--foam)]/50 px-6 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--teal)]"
              >
                Use the CLI
              </a>
            </div>
          </div>

          <div className="relative min-h-[42vh] lg:min-h-full">
            <div className="hero-visual absolute inset-0" />
            <svg
              className="stroke-draw pointer-events-none absolute bottom-10 left-1/2 h-10 w-[min(70%,22rem)] -translate-x-1/2 opacity-80"
              viewBox="0 0 240 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 12h52l18-8 18 16 18-12 18 10 18-6h70"
                stroke="var(--sand)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </section>
      </div>

      <section id="method" className="border-t border-[var(--ink)]/10 px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            One job: make the first shippable cut.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--ink)]/65">
            MVP Specialist refuses platform fantasies. It forces a target user,
            a core loop, non-goals, and a scaffold you can run tonight.
          </p>
          <ol className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              {
                n: "01",
                t: "Frame",
                d: "Name the painful job and the person who feels it most.",
              },
              {
                n: "02",
                t: "Cut",
                d: "Keep three must-haves. Write non-goals before features expand.",
              },
              {
                n: "03",
                t: "Scaffold",
                d: "Generate a local project for web SaaS, waitlist, API, or CLI.",
              },
            ].map((step) => (
              <li key={step.n}>
                <p className="text-xs tracking-[0.2em] text-[var(--signal)]">{step.n}</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                  {step.t}
                </h3>
                <p className="mt-2 text-[var(--ink)]/65">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="cli" className="bg-[var(--ink)] px-5 py-20 text-[var(--foam)] sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              CLI for when chat is not enough.
            </h2>
            <p className="mt-4 text-[var(--sand)]/75">
              Scaffold a starter from the terminal. Same templates the agent
              recommends in chat.
            </p>
          </div>
          <pre className="overflow-x-auto border border-white/10 bg-black/30 p-5 text-sm leading-relaxed text-[var(--sand)]">
{`npm run cli -- scaffold my-app \\
  --template web-saas \\
  --idea "AI notes for freelancers"

# templates: web-saas | landing-waitlist
#            api-service | cli-tool`}
          </pre>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl border-t border-[var(--ink)]/10 pt-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            Built for founders who ship this week.
          </h2>
          <p className="mt-4 max-w-xl text-[var(--ink)]/65">
            Chat plans work offline via the built-in planner. Add{" "}
            <code className="bg-[var(--mist)] px-1.5 py-0.5 text-sm">OPENAI_API_KEY</code>{" "}
            for full LLM replies.
          </p>
          <Link
            href="/agent"
            className="mt-8 inline-flex bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-[var(--foam)] transition hover:bg-[var(--teal-deep)]"
          >
            Open the agent
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--ink)]/10 px-5 py-8 text-sm text-[var(--ink)]/50 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>MVP Specialist · Yazan Alshibi</span>
          <span>Chat agent · CLI scaffolder · landing in one MVP</span>
        </div>
      </footer>
    </div>
  );
}
