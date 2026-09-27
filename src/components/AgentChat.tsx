"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { ChatMessage } from "@/lib/agent/types";

type IndustrySummary = {
  id: string;
  name: string;
  blurb: string;
  mvpShapes: string[];
  examples: { idea: string; cut: string }[];
};

function renderLiteMarkdown(text: string) {
  const blocks = text.split("\n");
  return blocks.map((line, i) => {
    if (line.startsWith("```")) {
      return (
        <span key={i} className="block font-mono text-[0.85em] text-[var(--teal-deep)]">
          {line}
        </span>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <strong key={i} className="mt-3 block font-[family-name:var(--font-display)] text-xl">
          {line.slice(2)}
        </strong>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <strong key={i} className="mt-3 block text-base tracking-wide">
          {line.slice(3)}
        </strong>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <span key={i} className="block pl-3 before:mr-2 before:content-['–']">
          {line.slice(2)}
        </span>
      );
    }
    if (!line.trim()) return <span key={i} className="block h-2" />;
    return (
      <span key={i} className="block">
        {line}
      </span>
    );
  });
}

export function AgentChat() {
  const [industries, setIndustries] = useState<IndustrySummary[]>([]);
  const [industryId, setIndustryId] = useState<string>("b2b-saas");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"llm" | "planner" | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetch("/api/industries")
      .then((r) => r.json())
      .then((data: { industries: IndustrySummary[] }) => {
        setIndustries(data.industries || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  const selected = useMemo(
    () => industries.find((i) => i.id === industryId) || null,
    [industries, industryId],
  );

  const starters = useMemo(() => {
    if (!selected?.examples?.length) {
      return [
        "A waitlist for an AI meeting notes tool for freelancers",
        "CLI that turns a product idea into a Next.js scaffold",
        "Marketplace MVP connecting local tutors with parents",
      ];
    }
    return selected.examples.map((ex) => ex.idea);
  }, [selected]);

  async function send(content: string) {
    const trimmed = content.trim();
    if (!trimmed || pending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages, industryId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        setMode(data.mode);
        setActiveIndustry(data.industryName || null);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message as string },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-8 pt-6 sm:px-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink)]/50">
            Industry playbook
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {industries.map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => setIndustryId(ind.id)}
                className={`shrink-0 border px-3 py-1.5 text-xs transition ${
                  industryId === ind.id
                    ? "border-[var(--teal)] bg-[var(--teal)] text-[var(--foam)]"
                    : "border-[var(--ink)]/15 bg-[var(--foam)]/70 text-[var(--ink)]/75 hover:border-[var(--teal)]"
                }`}
              >
                {ind.name}
              </button>
            ))}
          </div>
          {selected && (
            <p className="mt-3 text-sm text-[var(--ink)]/60">{selected.blurb}</p>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center gap-8 py-6">
            <div className="reveal">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink)]/50">
                Planning room
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.05] text-[var(--ink)] sm:text-5xl">
                Train the cut on the industry that needs the MVP.
              </h1>
              <p className="mt-4 max-w-xl text-[var(--ink)]/70">
                Each playbook teaches the agent winning MVP shapes, must-haves, non-goals,
                and constraints for that vertical — then rewrites empire ideas into shippable cuts.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="border border-[var(--ink)]/10 bg-[var(--foam)]/70 p-4 text-left text-sm text-[var(--ink)]/80 transition hover:border-[var(--teal)] hover:bg-[var(--foam)]"
                >
                  {s}
                </button>
              ))}
            </div>
            {selected?.mvpShapes?.length ? (
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink)]/40">
                  Winning shapes · {selected.name}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--ink)]/65">
                  {selected.mvpShapes.map((shape) => (
                    <li key={shape}>– {shape}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-5 py-4">
            {messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={`max-w-[95%] whitespace-pre-wrap text-sm leading-relaxed sm:text-[0.95rem] ${
                  m.role === "user"
                    ? "ml-auto bg-[var(--ink)] px-4 py-3 text-[var(--foam)]"
                    : "mr-auto border border-[var(--ink)]/10 bg-[var(--foam)]/80 px-4 py-3 text-[var(--ink)]"
                }`}
              >
                {m.role === "assistant" ? renderLiteMarkdown(m.content) : m.content}
              </div>
            ))}
            {pending && (
              <div className="mr-auto border border-[var(--ink)]/10 bg-[var(--foam)]/60 px-4 py-3 text-sm text-[var(--ink)]/55">
                Applying {selected?.name || "industry"} playbook…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {error && (
          <p className="mb-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {(mode || activeIndustry) && (
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--ink)]/40">
            {mode ? `mode · ${mode}` : null}
            {mode && activeIndustry ? " · " : null}
            {activeIndustry ? `industry · ${activeIndustry}` : null}
          </p>
        )}

        <form
          onSubmit={onSubmit}
          className="sticky bottom-4 flex gap-2 border border-[var(--ink)]/10 bg-[var(--foam)]/90 p-2 backdrop-blur"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`MVP idea for ${selected?.name || "this industry"}…`}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/35"
            disabled={pending}
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className="bg-[var(--teal)] px-4 py-3 text-sm font-medium text-[var(--foam)] transition enabled:hover:bg-[var(--teal-deep)] disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
