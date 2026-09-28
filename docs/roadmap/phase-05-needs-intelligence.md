# Phase 5 — Needs Intelligence

**Goal:** Add needs, alternatives, barriers, desired outcomes, and rejection reasons as first-class intelligence.

**Exit criteria:** Experiments and market views surface need signals with Problem→Outcome→… evidence chains; rejection reason taxonomy distinguishes “no need” vs “need, wrong offer.”

**Depends on:** Phase 4 (and Phase 2 evidence)

---

## Epic P5-E1 — Need object & graph

### Issue: Need entity and signal schema
```
Title: Implement Need as first-class data object
Labels: phase-5, epic:needs, type:feature, area:data, priority:P0

## Signal shape
Problem → Desired Outcome → Current Solution → Alternative → Barrier → Trigger → Context → Evidence

## Acceptance criteria
- [ ] CRUD + evidence links
- [ ] dimensions: functional, emotional, convenience, economic, social, unmet, latent
- [ ] Neo4j SATISFIES / BLOCKS / EXPRESSES_NEED edges
```

### Issue: Extract needs from reviews and feedback
```
Title: Pipeline to extract need signals from consumer evidence
Labels: phase-5, epic:needs, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] retains raw evidence
- [ ] extractions labeled INFERRED with model provenance
- [ ] human review queue stub for corrections
```

---

## Epic P5-E2 — Rejection & barriers

### Issue: Rejection reason taxonomy
```
Title: Model rejection reasons distinct from lack of demand
Labels: phase-5, epic:rejection, type:feature, area:data, priority:P0

## Reasons
Price, timing, location, convenience, trust, brand, feature, quality, commitment, delivery, availability, payment structure.

## Acceptance criteria
- [ ] classification: NO_NEED vs NEED_WRONG_OFFER
- [ ] usable in experiment outputs and later modification engine
```

### Issue: Barrier ranking in experiment results
```
Title: Rank primary barriers in simulated + inferred outputs
Labels: phase-5, epic:rejection, type:feature, area:sim, priority:P1

## Acceptance criteria
- [ ] detailing demo surfaces price/duration style barriers when appropriate
- [ ] barriers cite supporting evidence IDs
```

---

## Epic P5-E3 — Alternatives intelligence

### Issue: Alternative set per need
```
Title: Capture consumer alternatives including do-nothing
Labels: phase-5, epic:alternatives, type:feature, area:data, priority:P0

## Alternatives
Competitor, DIY, existing product, delay, substitute, do nothing.

## Acceptance criteria
- [ ] alternatives linked to needs and geos/categories
- [ ] experiment output includes alternative section populated from graph + sim
```

---

## Epic P5-E4 — Product modification hypotheses (foundation)

### Issue: Hypothesis generator stub from objections
```
Title: Generate testable modification hypotheses from rejection reasons
Labels: phase-5, epic:modification, type:feature, area:api, priority:P2

## Summary
Future capability: smallest modification addressing objection. Phase 5 ships hypothesis stubs, not prescriptions.

## Variables
Price, feature, package, location, delivery, frequency, branding, trust, guarantee, payment, subscription, speed.

## Acceptance criteria
- [ ] returns hypotheses labeled INFERRED/SIMULATED as appropriate
- [ ] UI copy states these are hypotheses to test, not guarantees
```

---

## Epic P5-E5 — Needs discovery narrative (detailing example)

### Issue: Demo — convenience vs quality insight path
```
Title: Seed demo where convenience need outranks “better detailing”
Labels: phase-5, epic:needs, type:feature, area:data, priority:P1

## Acceptance criteria
- [ ] evidence supports “don’t want to lose three hours”
- [ ] suggested concepts: pickup, mobile, workplace, overnight, express
- [ ] labeled and confidence-scored
```
