# Phase 4 — Basic Experimentation

**Goal:** Allow simple `Product + Price + Location + Consumer` experiments with counterfactual versions.

**Exit criteria:** User can define a baseline offer (e.g. Scarborough express detail $149), create versions, run the same population across versions, and compare labeled simulated responses.

**Depends on:** Phase 3

---

## Epic P4-E1 — Offer & experiment model

### Issue: Offer schema (product concept)
```
Title: Model commercial offer for experiments
Labels: phase-4, epic:experiments, type:feature, area:api, priority:P0

## Fields
Product/service type, price, duration, location/geo, features, delivery options, membership flags, add-ons.

## Acceptance criteria
- [ ] CRUD for offers in a workspace
- [ ] offers reference taxonomy + geo entities
```

### Issue: Experiment baseline + versions
```
Title: Experiment workspace with baseline and counterfactual versions
Labels: phase-4, epic:experiments, type:feature, area:api, priority:P0

## Acceptance criteria
- [ ] create experiment from baseline offer
- [ ] duplicate to versions with controlled field diffs
- [ ] store assumption set and population selector
```

---

## Epic P4-E2 — Intent entry UX

### Issue: “What are you trying to understand?” intake
```
Title: Natural-language intent intake for market experiments
Labels: phase-4, epic:ux, type:feature, area:web, priority:P0

## Example
“I’m thinking about opening an express automotive detailing concept in Scarborough.”

## Acceptance criteria
- [ ] parse/identify industry, geography, missing fields
- [ ] ask only for missing information
- [ ] creates draft offer + experiment shell
- [ ] inferred parses labeled INFERRED
```

### Issue: Experiment comparison UI
```
Title: UI to compare baseline vs version simulated outcomes
Labels: phase-4, epic:ux, type:feature, area:web, priority:P0

## Acceptance criteria
- [ ] table/chart of versions with SIMULATED badge always visible
- [ ] show assumptions and population definition
- [ ] link to underlying market context (Phase 2 landscape)
```

---

## Epic P4-E3 — Controlled counterfactual runs

### Issue: Same-population multi-version evaluation
```
Title: Evaluate all offer versions on the same synthetic population
Labels: phase-4, epic:experiments, type:feature, area:sim, priority:P0

## Acceptance criteria
- [ ] fixed population snapshot ID reused across versions
- [ ] isolates changed variables in result metadata
- [ ] automotive detailing counterfactual set (price, pickup, duration, membership, good/better/best) runnable as demo
```

### Issue: Output structure beyond “% like it”
```
Title: Structured experiment output (context, reaction, barriers, alternatives)
Labels: phase-4, epic:experiments, type:feature, area:api, priority:P0

## Acceptance criteria
- [ ] sections: observed market context, simulated reaction, barriers (stub OK), alternatives (stub OK)
- [ ] each section carries evidence_type
- [ ] no unlabeled purchase probability in API/UI
```

---

## Epic P4-E4 — Dashboard shell

### Issue: Output dashboard shell (Market / Consumer / Product / Experiments)
```
Title: Create dashboard shell for experiment results
Labels: phase-4, epic:ux, type:feature, area:web, priority:P1

## Acceptance criteria
- [ ] panels exist even if some are placeholders
- [ ] Evidence panel shows sources + confidence
- [ ] Experiments panel shows scenario comparison
```
