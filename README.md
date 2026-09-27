# MVP Specialist

AI agent that turns product ideas into **scoped MVP plans** and **local scaffolds**.

Built for [Yazan Alshibi](https://github.com/yazanalshibi) as a three-in-one MVP:

1. **Landing** — brand site for the specialist
2. **Chat agent** — `/agent` plans features, non-goals, stack, milestones
3. **CLI** — `mvp-specialist scaffold` writes starter projects

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or `/agent` for the planner.

### Optional LLM mode

Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`. Without a key, the agent uses the built-in planner (still returns full MVP cuts).

## CLI

```bash
npm run cli -- templates

npm run cli -- scaffold my-app \
  --template web-saas \
  --idea "AI notes for freelancers"
```

Templates: `web-saas` · `landing-waitlist` · `api-service` · `cli-tool`

You can also run the bin after install:

```bash
npx mvp-specialist scaffold demo --template landing-waitlist --idea "Waitlist for X"
```

## API

- `POST /api/chat` — `{ messages: [{ role, content }] }` → `{ message, mode }`
- `GET /api/scaffold` — list templates
- `POST /api/scaffold` — `{ name, template, idea }` → `{ files }`

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · Node CLI via `tsx`
