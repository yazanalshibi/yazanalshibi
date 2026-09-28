# Phase 10 — Market Twin

**Goal:** Bring all layers together into a continuously evolving representation of a real market — the Market Intelligence Operating System experience.

**Exit criteria:** End-to-end north-star flow works for GTA automotive services (IDEA → MARKET and MARKET → IDEA), with evidence labels, confidence, experiments, discovery, and calibration hooks in one product surface.

**Depends on:** Phases 1–9 (can ship as progressive integration once P4+P5+P9 MVP exist)

---

## Epic P10-E1 — Unified product experience

### Issue: North-star end-to-end flow
```
Title: Ship unified flow for “$149 express detailing in Scarborough”
Labels: phase-10, epic:market-twin, type:feature, area:web, priority:P0

## Must answer
Who needs it; why; alternatives; likes/dislikes; rejection reasons; price resistance; feature importance; preference durability; switching; geo differences; evidence; confidence — then counterfactuals.

## Acceptance criteria
- [ ] single guided session covering Market Twin panels
- [ ] every numeric claim labeled
- [ ] works on desktop and mobile layouts
```

### Issue: Reverse discovery integrated in same shell
```
Title: Integrate MARKET → IDEA into Market Twin shell
Labels: phase-10, epic:market-twin, type:feature, area:web, priority:P0
```

---

## Epic P10-E2 — Continuous evolution

### Issue: Scheduled refresh of market representation
```
Title: Continuously refresh GTA market foundation
Labels: phase-10, epic:flywheel, type:feature, area:data, priority:P1

## Acceptance criteria
- [ ] scheduled ingest for registered sources
- [ ] freshness SLOs defined and visible
- [ ] graph projection stays consistent with Postgres
```

### Issue: Flywheel metrics
```
Title: Instrument platform flywheel KPIs
Labels: phase-10, epic:flywheel, type:chore, area:api, priority:P2

## KPIs
Data volume, representation coverage, experiments run, real tests logged, calibration coverage, accuracy trend.
```

---

## Epic P10-E3 — Multi-vertical readiness

### Issue: Industry pack interface for non-automotive verticals
```
Title: Generalize industry packs beyond automotive seed
Labels: phase-10, epic:expansion, type:feature, area:data, priority:P1

## Acceptance criteria
- [ ] automotive remains a pack, not core fork
- [ ] docs for adding a new vertical pack
- [ ] no automotive-only assumptions in API contracts
```

---

## Epic P10-E4 — Commercial packaging hooks (non-blocking)

### Issue: Entitlement stubs for future tiers
```
Title: Add entitlement stubs (research / pro / business / enterprise / API)
Labels: phase-10, epic:commercial, type:feature, area:api, priority:P2

## Acceptance criteria
- [ ] feature flags for experiments, private data, API access
- [ ] architecture remains monetization-agnostic
```

### Issue: Private Market Twin workspace mode
```
Title: Dedicated private market twin mode for an organization
Labels: phase-10, epic:commercial, type:feature, area:api, priority:P2

## Acceptance criteria
- [ ] org-specific graph projections / filters
- [ ] private datasets + public backdrop with clear separation
```

---

## Epic P10-E5 — Hardening & trust

### Issue: Evidence export with labels for consultants/investors
```
Title: Export briefings that preserve evidence classification
Labels: phase-10, epic:trust, type:feature, area:api, priority:P1

## Acceptance criteria
- [ ] PDF/Markdown export cannot strip SIMULATED/PREDICTED labels
- [ ] includes confidence and source diversity
```

### Issue: Security review for tenancy and PII boundaries
```
Title: Security review of tenant isolation and PII separation
Labels: phase-10, epic:trust, type:chore, area:api, priority:P0
```
