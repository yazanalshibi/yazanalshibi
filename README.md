# Live Venture OS

AI-native **Venture Operating System** — build, launch, operate, validate, and scale real businesses from one environment.

> Do not build a prototype and hope it works later. Build the business live, collect real market data immediately, and improve it while it operates.

## V0.1 loop (shipped)

Describe idea → venture blueprint → activate modules → generate live site → publish → capture leads/bookings/orders → CRM/ERP admin → performance → AI recommendation.

### Routes

| Path | Purpose |
| --- | --- |
| `/` | Product landing |
| `/create` | Create venture (or load ShineOn demo) |
| `/os/[slug]` | Admin Business OS dashboard |
| `/os/[slug]/blueprint` | Blueprint + module activation |
| `/os/[slug]/builder` | Page editor |
| `/os/[slug]/customers` | CRM leads & customers |
| `/os/[slug]/bookings` | Bookings & orders |
| `/os/[slug]/products` | Services, staff, locations |
| `/os/[slug]/performance` | Metrics, health, events |
| `/os/[slug]/advisor` | AI recommendations |
| `/v/[slug]` | Live customer experience |
| `/agent` | MVP Specialist industry trainer |

### Demo venture

```bash
npm run dev
# open /create → “Load ShineOn demo”
# Live site: /v/shineon
# Admin: /os/shineon
```

Mobile car detailing membership for Toronto condo residents — CRM, booking, payments, membership, reviews, staff, locations.

## MVP Discovery → Launchpad

1. **/create** — 8 questions lock the MVP shape  
2. System recommends infrastructure connections (domain, Stripe, commerce, Google, email, hosting)  
3. **LVOS Bot Terminal** runs our own bots (scaffold, connect, smoke-test) — not third-party devices  
4. **3–5 experts** matched to your milestone, industry, and MVP needs  
5. **/os/[slug]/launchpad** — connect providers in minutes and launch

- **Local-first:** all data in `data/venture-os.json`
- **Cloud share:** choose categories + retention (1d → until revoked); mirrors in `data/cloud/`
- **Brand identity:** colors, fonts, radius, tone — applied to live site (optional admin)
- **Flexible dashboard:** show/hide/reorder widgets, compact metrics, density
- **Behavior-smart UX:** navigation patterns → enhancement suggestions on the dashboard

Configure at `/os/[slug]/settings`.

- **Venture Engine** — idea → blueprint → modules → pages
- **Native CRM** — leads, customers, sources, LTV
- **Native ERP (lite)** — services, orders, staff, locations, expenses
- **Event tracking** — page views, leads, bookings, payments
- **AI Advisor** — recommendations from real venture metrics
- **JSON store** — `data/venture-os.json` (local persistence)

Industry playbooks from MVP Specialist still power blueprint industry detection (`/agent`, `src/lib/agent/industries`).

## Quick start

```bash
npm install
npm run dev
```

## What is intentionally NOT in V0.1

Full accounting, payroll, franchise legal, investor network, native mobile apps, marketplace, dozens of autonomous agents — deferred per the product blueprint.

## Product definition

**Category:** AI-Native Venture Operating System  
**Promise:** Turn an idea into a live operating business and improve it using real data.  
**Core:** Native CRM + Native ERP + Modules + Live Website + Analytics + AI Intelligence
