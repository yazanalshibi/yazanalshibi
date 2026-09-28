import Link from "next/link";
import { DiscoveryQuiz } from "@/components/venture/DiscoveryQuiz";
import { CreateVentureForm } from "@/components/venture/CreateVentureForm";

export const metadata = {
  title: "Create Venture · Live Venture OS",
};

export default function CreatePage() {
  return (
    <div className="atmosphere min-h-screen px-5 py-10 sm:px-8 lg:px-12">
      <Link href="/" className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/50">
        Live Venture OS
      </Link>
      <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
        What does your MVP look like?
      </h1>
      <p className="mt-3 max-w-xl text-[var(--ink)]/65">
        Answer ~9 questions (including where you operate). We collect leading cost and
        paperwork data, open an incorporation checklist, spin infrastructure + bots,
        plug-and-play features/colors (VR-ready for Meta glasses), and seat 5 advisors
        from the first build. Data stays local until you choose what to share.
      </p>
      <div className="mt-10">
        <DiscoveryQuiz />
      </div>

      <details className="mx-auto mt-16 max-w-2xl border-t border-[var(--ink)]/10 pt-8">
        <summary className="cursor-pointer text-sm text-[var(--ink)]/55">
          Prefer a one-line idea or ShineOn demo instead?
        </summary>
        <div className="mt-6">
          <CreateVentureForm />
        </div>
      </details>
    </div>
  );
}
