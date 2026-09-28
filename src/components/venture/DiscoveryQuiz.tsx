"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DISCOVERY_QUESTIONS,
  type DiscoveryAnswerMap,
} from "@/lib/venture/discovery";

export function DiscoveryQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiscoveryAnswerMap>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const q = DISCOVERY_QUESTIONS[step];
  const progress = Math.round(((step + 1) / DISCOVERY_QUESTIONS.length) * 100);

  const canNext = useMemo(() => {
    const val = answers[q.id];
    if (!q.required) return true;
    if (q.type === "multi") return Array.isArray(val) && val.length > 0;
    return typeof val === "string" && val.trim().length > 0;
  }, [answers, q]);

  function setSingle(value: string) {
    setAnswers((a) => ({ ...a, [q.id]: value }));
  }

  function toggleMulti(value: string) {
    setAnswers((a) => {
      const cur = Array.isArray(a[q.id]) ? [...(a[q.id] as string[])] : [];
      const idx = cur.indexOf(value);
      if (idx >= 0) cur.splice(idx, 1);
      else cur.push(value);
      return { ...a, [q.id]: cur };
    });
  }

  function finish() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Discovery failed");
        return;
      }
      router.push(`/os/${data.venture.slug}/launchpad`);
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canNext) return;
    if (step < DISCOVERY_QUESTIONS.length - 1) setStep((s) => s + 1);
    else finish();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.16em] text-[var(--ink)]/45">
          <span>
            Question {step + 1} / {DISCOVERY_QUESTIONS.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-[var(--ink)]/10">
          <div className="h-full bg-[var(--teal)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">{q.prompt}</h2>
        {q.help && <p className="mt-2 text-sm text-[var(--ink)]/60">{q.help}</p>}
      </div>

      {q.type === "text" && (
        <textarea
          className="w-full border border-[var(--ink)]/15 bg-[var(--foam)]/80 p-4 text-base outline-none focus:border-[var(--teal)]"
          rows={4}
          value={String(answers[q.id] || "")}
          onChange={(e) => setSingle(e.target.value)}
          placeholder="Type your answer…"
          autoFocus
        />
      )}

      {(q.type === "single" || q.type === "multi") && (
        <div className="grid gap-2">
          {q.options?.map((opt) => {
            const selected =
              q.type === "single"
                ? answers[q.id] === opt.value
                : Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => (q.type === "single" ? setSingle(opt.value) : toggleMulti(opt.value))}
                className={`border p-4 text-left text-sm transition ${
                  selected
                    ? "border-[var(--teal)] bg-[var(--mist)]/60"
                    : "border-[var(--ink)]/10 bg-white/50 hover:border-[var(--teal)]/50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="border border-[var(--ink)]/15 px-4 py-3 text-sm disabled:opacity-30"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!canNext || pending}
          className="bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-[var(--foam)] disabled:opacity-40"
        >
          {pending
            ? "Building infrastructure plan…"
            : step === DISCOVERY_QUESTIONS.length - 1
              ? "Build my MVP launchpad"
              : "Next"}
        </button>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
