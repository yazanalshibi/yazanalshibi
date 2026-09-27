"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CreateVentureForm() {
  const router = useRouter();
  const [idea, setIdea] = useState(
    "Mobile detailing membership for condo residents in Toronto",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create venture");
        return;
      }
      router.push(`/os/${data.venture.slug}/blueprint`);
    });
  }

  async function seedDemo() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedDemo: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to seed demo");
        return;
      }
      router.push(`/os/${data.venture.slug}`);
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--ink)]/50">
            What business do you want to build?
          </span>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={4}
            className="mt-3 w-full border border-[var(--ink)]/15 bg-[var(--foam)]/80 p-4 text-lg text-[var(--ink)] outline-none focus:border-[var(--teal)]"
            placeholder="Describe the venture…"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending || !idea.trim()}
            className="bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-[var(--foam)] disabled:opacity-40"
          >
            {pending ? "Configuring…" : "Configure venture"}
          </button>
          <button
            type="button"
            onClick={() => void seedDemo()}
            disabled={pending}
            className="border border-[var(--ink)]/20 px-5 py-3 text-sm"
          >
            Load ShineOn demo
          </button>
          <Link href="/" className="px-5 py-3 text-sm text-[var(--ink)]/60">
            Back
          </Link>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </form>
    </div>
  );
}
