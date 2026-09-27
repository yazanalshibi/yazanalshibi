# MVP Specialist

AI agent that turns product ideas into **industry-trained MVP plans** and **local scaffolds**.

Built for [Yazan Alshibi](https://github.com/yazanalshibi) as a three-in-one MVP:

1. **Landing** — brand site for the specialist
2. **Chat agent** — `/agent` plans with vertical playbooks
3. **CLI** — scaffold + plan + export training corpus

## Industry training

The agent is trained on playbooks for industries that repeatedly need MVPs:

| ID | Industry |
| --- | --- |
| `healthtech` | HealthTech |
| `fintech` | FinTech |
| `edtech` | EdTech |
| `proptech` | PropTech / Real Estate |
| `ecommerce` | E-commerce / Retail |
| `logistics` | Logistics / Supply Chain |
| `b2b-saas` | B2B SaaS / Productivity |
| `local-services` | Local Services / Marketplace |
| `legaltech` | LegalTech |
| `climate` | Climate / Energy |

Each pack teaches: why MVPs win there, buyer, pain patterns, MVP shapes, must-haves, non-goals, constraints, stack hints, milestones, risks, and rewrite examples (empire idea → shippable cut).

Export the fine-tuning / eval corpus:

```bash
npm run cli -- train-export
# or GET /api/training?format=jsonl
```

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or `/agent` (pick an industry chip).

### Optional LLM mode

Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`. Without a key, the industry planner still returns full MVP cuts (playbook mode).

## CLI

```bash
npm run cli -- industries

npm run cli -- plan --industry fintech --idea "Neobank for everyone"

npm run cli -- scaffold my-app \
  --industry healthtech \
  --template web-saas \
  --idea "Clinic intake triage"
```

## API

- `POST /api/chat` — `{ messages, industryId? }` → `{ message, mode, industryId, industryName }`
- `GET /api/industries` — playbook summaries
- `GET /api/training?format=jsonl` — training corpus
- `GET|POST /api/scaffold` — templates / file generation

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · Node CLI via `tsx`
