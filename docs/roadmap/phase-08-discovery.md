# Phase 8 — Discovery

**Goal:** Enable MARKET → IDEA — “What does this market appear to need?” — not only testing existing ideas.

**Exit criteria:** User can request opportunity discovery for a geo + category; system surfaces needs/gaps from evidence with confidence and labels.

**Depends on:** Phase 5 (needs) and Phase 2 (market representation)

---

## Epic P8-E1 — Opportunity engine

### Issue: Market opportunity scoring
```
Title: Score opportunities from needs, gaps, competition, pricing, demographics
Labels: phase-8, epic:discovery, type:feature, area:api, priority:P0

## Inputs
Need signals, reviews, search behavior (if available), competitor weaknesses, pricing gaps, demographic conditions, geographic gaps.

## Acceptance criteria
- [ ] ranked opportunities with evidence citations
- [ ] each item labeled INFERRED (or OBSERVED components separated)
- [ ] confidence + freshness + source diversity shown
```

### Issue: Discovery intent UX
```
Title: UX mode “Show me what this market needs”
Labels: phase-8, epic:discovery, type:feature, area:web, priority:P0

## Acceptance criteria
- [ ] distinct from IDEA → MARKET flow
- [ ] asks for geo + category (+ constraints)
- [ ] results emphasize evidence, not idea theater
```

---

## Epic P8-E2 — Market Opportunity Map

### Issue: Geo opportunity map visualization
```
Title: Map indicators across GTA geos
Labels: phase-8, epic:opportunity-map, type:feature, area:web, priority:P1

## Indicators
Need intensity, supply, competition, pricing, segments, gaps, business density, demand signals.

## Acceptance criteria
- [ ] Canada → province → city → neighborhood navigation path (GTA filled)
- [ ] click-through to evidence panels
```

---

## Epic P8-E3 — Concept suggestion from gaps

### Issue: Suggest concepts from unmet/latent needs
```
Title: Generate investigable concepts from opportunity scores
Labels: phase-8, epic:discovery, type:feature, area:api, priority:P1

## Acceptance criteria
- [ ] suggestions are hypotheses to investigate
- [ ] can one-click create Phase 4 experiment draft
- [ ] never presented as guaranteed winners
```
