# Phase 2 — Market Representation

**Goal:** Build one high-quality GTA market representation (seed vertical: automotive services).

**Exit criteria:** User/API can retrieve Scarborough (and peer GTA areas) market context: businesses, products, prices, reviews themes, demographics/economic stubs, with history and provenance.

**Depends on:** Phase 1

---

## Epic P2-E1 — Geographic intelligence pack (GTA)

### Issue: Load Canadian geo hierarchy for GTA
```
Title: Ingest GTA geo hierarchy (province → CMA → city → neighborhood → FSA)
Labels: phase-2, epic:geo, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] Scarborough, Mississauga, Vancouver contrast optional stub OK; GTA complete enough for demos
- [ ] catchment area entity supported
- [ ] graph PART_OF / LOCATED_IN populated
```

### Issue: Geo attribute overlays
```
Title: Attach population, income, density overlays to geo nodes
Labels: phase-2, epic:geo, type:feature, area:data, priority:P1

## Notes
Use properly licensed / open government sources only; document licenses in source registry.
```

---

## Epic P2-E2 — Industry pack: automotive services

### Issue: Automotive services taxonomy
```
Title: Define industry taxonomy for automotive services / detailing
Labels: phase-2, epic:industry-pack, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] Industry → Category → Subcategory → Service type
- [ ] includes detailing, wash, express, interior/exterior packages
- [ ] taxonomy is data, not hardcoded product logic
```

### Issue: Seed GTA detailing businesses & offers
```
Title: Curate seed dataset of GTA detailing businesses, offers, prices
Labels: phase-2, epic:industry-pack, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] ≥ N businesses across multiple GTA cities (document N target in issue)
- [ ] historical prices for a subset
- [ ] reviews/evidence samples retained as raw text
- [ ] clearly marked seed vs production-licensed data
```

---

## Epic P2-E3 — Economic context stubs

### Issue: Regional economic time series MVP
```
Title: Store economic indicators affecting willingness to spend
Labels: phase-2, epic:economic, type:feature, area:data, priority:P1

## Acceptance criteria
- [ ] inflation, employment, fuel, housing cost series at available regional grain
- [ ] API returns series for a geo + date range
- [ ] labeled OBSERVED/REPORTED as appropriate
```

---

## Epic P2-E4 — Competitor & product intelligence views

### Issue: Competitor landscape endpoint for a geo + category
```
Title: Market landscape API for geography + category
Labels: phase-2, epic:market-views, type:feature, area:api, priority:P0

## Acceptance criteria
- [ ] returns businesses, offers, price ranges, review theme summaries
- [ ] includes evidence labels and confidence on summaries
- [ ] Scarborough automotive detailing query works end-to-end
```

### Issue: Review theme extraction (inferred, labeled)
```
Title: Extract review themes without discarding raw evidence
Labels: phase-2, epic:market-views, type:feature, area:data, priority:P1

## Acceptance criteria
- [ ] raw review retained
- [ ] themes stored as INFERRED annotations linked to evidence IDs
- [ ] UI/API can show both raw and themes
```

---

## Epic P2-E5 — Market representation quality bar

### Issue: GTA automotive representation scorecard
```
Title: Define and measure representation completeness scorecard
Labels: phase-2, epic:quality, type:chore, area:data, priority:P1

## Acceptance criteria
- [ ] metrics: geo coverage, business density, price history coverage, review coverage, freshness
- [ ] dashboard or report in docs/CI artifact
- [ ] Phase 2 exit gated on agreed thresholds
```
