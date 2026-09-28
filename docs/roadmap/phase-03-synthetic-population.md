# Phase 3 — Synthetic Population

**Goal:** Integrate useful infrastructure from GenAgents, DeepPersona, AgentTorch (or alternatives) as **pluggable engines**, not as the product core.

**Exit criteria:** Can generate a GTA-segment-aligned synthetic population for automotive services scenarios; each agent carries demographic/geo/economic context from the market foundation; outputs labeled SIMULATED.

**Depends on:** Phase 2

---

## Epic P3-E1 — Engine evaluation & adapter interface

### Issue: Evaluate GenAgents / DeepPersona / AgentTorch fit
```
Title: Spike: evaluate open-source agent/population engines
Labels: phase-3, epic:sim-engines, type:chore, area:sim, priority:P0

## Acceptance criteria
- [ ] written comparison: strengths, license, integration cost, gaps vs our digital twin fields
- [ ] recommendation for MVP engine(s)
- [ ] list of components to reimplement vs wrap
```

### Issue: Simulation engine adapter interface
```
Title: Define SimulationEngine adapter (populate, run, export)
Labels: phase-3, epic:sim-engines, type:feature, area:sim, priority:P0

## Acceptance criteria
- [ ] interface independent of vendor/OSS project
- [ ] can swap engines without changing experiment API
- [ ] contract includes evidence grounding inputs + SIMULATED outputs
```

---

## Epic P3-E2 — Consumer digital twin schema

### Issue: Synthetic consumer schema v1
```
Title: Implement synthetic consumer digital twin schema
Labels: phase-3, epic:digital-twin, type:feature, area:sim, priority:P0

## Fields
Demographics, geography, economic context, needs (stub OK), alternatives (stub), preferences, constraints, price sensitivity priors, brand awareness, trust, decision drivers, memory placeholders.

## Acceptance criteria
- [ ] schema in packages/schemas
- [ ] no real PII; population-statistical generation only
- [ ] linked to geo segment distributions from Phase 2
```

### Issue: Population generator from market evidence
```
Title: Generate synthetic population grounded in GTA segment distributions
Labels: phase-3, epic:digital-twin, type:feature, area:sim, priority:P0

## Acceptance criteria
- [ ] sample N agents for a geography + segment mix
- [ ] grounding metadata cites demographic/economic sources
- [ ] generation run versioned and reproducible with seed
```

---

## Epic P3-E3 — Memory & longitudinal stubs

### Issue: Agent memory store for simulated experiences
```
Title: Persist per-agent simulated experience memory
Labels: phase-3, epic:memory, type:feature, area:sim, priority:P1

## Acceptance criteria
- [ ] agents can store past simulated exposures/outcomes
- [ ] memory available to later experiment runs (opt-in)
- [ ] cleared/resettable per experiment workspace
```

---

## Epic P3-E4 — Population-level execution

### Issue: Batch simulation runner
```
Title: Run population-level evaluations as async jobs
Labels: phase-3, epic:runner, type:feature, area:sim, priority:P0

## Acceptance criteria
- [ ] enqueue simulation job; poll status
- [ ] aggregate metrics + per-segment breakdowns
- [ ] all metrics labeled SIMULATED with assumption set
```

### Issue: Guardrail — no identifiable impersonation
```
Title: Policy tests preventing identifiable person impersonation
Labels: phase-3, epic:runner, type:chore, area:sim, priority:P0

## Acceptance criteria
- [ ] generators cannot accept raw customer PII as agent identity
- [ ] docs state statistical population principle
```
