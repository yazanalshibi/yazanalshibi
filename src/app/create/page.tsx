import Link from "next/link";
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
        Create Venture
      </h1>
      <p className="mt-3 max-w-xl text-[var(--ink)]/65">
        Describe the business. AI structures a blueprint, recommends modules, and
        prepares a live customer experience.
      </p>
      <div className="mt-10">
        <CreateVentureForm />
      </div>
    </div>
  );
}
