import {
  SYSTEM_PROMPT,
  buildMvpPlan,
  formatPlanMarkdown,
} from "./planner";
import type { ChatMessage } from "./types";

export type AgentReply = {
  message: string;
  mode: "llm" | "planner";
};

async function callOpenAI(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text.slice(0, 240)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function runAgent(messages: ChatMessage[]): Promise<AgentReply> {
  try {
    const llm = await callOpenAI(messages);
    if (llm) return { message: llm, mode: "llm" };
  } catch (err) {
    console.error("LLM fallback:", err);
  }

  const plan = buildMvpPlan(messages);
  const preface =
    "Working in planner mode (set `OPENAI_API_KEY` for full LLM replies). Here is a concrete MVP cut:\n\n";
  return {
    message: preface + formatPlanMarkdown(plan),
    mode: "planner",
  };
}
