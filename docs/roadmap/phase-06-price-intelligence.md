# Phase 6 — Price Intelligence

**Goal:** Add willingness-to-pay concepts, price sensitivity, trade-offs, and pricing scenarios.

**Exit criteria:** Experiments can estimate multiple WTP concepts (not one arbitrary number); price ladders are labeled SIMULATED; observed transactions outweigh hypotheticals when present.

**Depends on:** Phase 4; stronger with Phase 5 barriers

---

## Epic P6-E1 — Price structure

### Issue: Rich price observation model
```
Title: Expand price intelligence fields
Labels: phase-6, epic:pricing, type:feature, area:data, priority:P0

## Fields
List, promotional, historical, competitor, bundle, subscription, add-ons, regional, transactional (optional).

## Acceptance criteria
- [ ] query competitor price timelines
- [ ] regional price differences supported
```

---

## Epic P6-E2 — WTP concepts

### Issue: Multi-concept willingness-to-pay outputs
```
Title: Estimate multiple WTP concepts per experiment
Labels: phase-6, epic:wtp, type:feature, area:sim, priority:P0

## Concepts
Acceptable, expected, good-value, premium threshold, resistance threshold, maximum considered.

## Acceptance criteria
- [ ] API returns all concepts with method metadata
- [ ] never collapses to a single unlabeled “WTP = $X”
```

### Issue: Methodology adapters (Van Westendorp, Gabor-Granger, DCE stubs)
```
Title: Pluggable WTP methodology adapters
Labels: phase-6, epic:wtp, type:feature, area:sim, priority:P1

## Acceptance criteria
- [ ] adapters implement common interface
- [ ] observed transactional method path preferred when data exists
- [ ] outputs labeled SIMULATED or OBSERVED accordingly
```

---

## Epic P6-E3 — Price ladder experiments

### Issue: Price sensitivity ladder runner
```
Title: Run multi-price response ladders on fixed population
Labels: phase-6, epic:pricing, type:feature, area:sim, priority:P0

## Example ladder
$99, $129, $149, $179, $199, $249 with qualitative bands.

## Acceptance criteria
- [ ] results table explicitly SIMULATED
- [ ] comparable across geos (Scarborough vs Mississauga)
```

### Issue: Price panel in dashboard
```
Title: Dashboard Price panel for WTP and sensitivity
Labels: phase-6, epic:ux, type:feature, area:web, priority:P1
```

---

## Epic P6-E4 — Trade-offs

### Issue: Feature vs price trade-off scenarios
```
Title: Simulate trade-offs (e.g. lower price vs pickup included)
Labels: phase-6, epic:pricing, type:feature, area:sim, priority:P1

## Acceptance criteria
- [ ] pairs with Phase 4 counterfactuals
- [ ] reports which attribute drove response delta
```
