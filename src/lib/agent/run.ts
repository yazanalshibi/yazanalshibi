import { buildMvpPlan, buildSystemPrompt, formatPlanMarkdown, resolveIndustry } from "./planner";
import type { IndustryId } from "./industries";
import type { ChatMessage } from "./types";

export type AgentReply = {
  message: string;
  mode: "llm" | "planner";
  industryId: string;
  industryName: string;
};

async function callOpenAI(
  messages: ChatMessage[],
  system: string,
): Promise<string | null> {
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
      messages: [{ role: "system", content: system }, ...messages],
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

export async function runAgent(
  messages: ChatMessage[],
  industryId?: IndustryId | string | null,
): Promise<AgentReply> {
  const idea =
    [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const pack = resolveIndustry(idea, industryId);
  const system = buildSystemPrompt(pack);

  try {
    const llm = await callOpenAI(messages, system);
    if (llm) {
      return {
        message: llm,
        mode: "llm",
        industryId: pack.id,
        industryName: pack.name,
      };
    }
  } catch (err) {
    console.error("LLM fallback:", err);
  }

  const plan = buildMvpPlan(messages, pack.id);
  const preface = `Working in planner mode · industry playbook **${pack.name}**. (Set \`OPENAI_API_KEY\` for full LLM replies.)\n\n`;
  return {
    message: preface + formatPlanMarkdown(plan),
    mode: "planner",
    industryId: pack.id,
    industryName: pack.name,
  };
}
