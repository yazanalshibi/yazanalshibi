# Phase 7 — Temporal Behavior

**Goal:** Add preference duration, retention, switching, and market change over time.

**Exit criteria:** Synthetic consumers have time-indexed state; experiments can ask “how long might preference remain?” and “what would cause switching?”

**Depends on:** Phases 5–6

---

## Epic P7-E1 — Preference duration

### Issue: Time-indexed preference state
```
Title: Model preference state at 0/1/3/6/12 months
Labels: phase-7, epic:temporal, type:feature, area:sim, priority:P0

## Factors
Novelty, repeated experience, satisfaction, price changes, competitor entry, technology, trends, economy, personal needs.

## Acceptance criteria
- [ ] preference decay / retention curve object stored
- [ ] outputs labeled SIMULATED/PREDICTED as appropriate
```

### Issue: Time panel in dashboard
```
Title: Dashboard Time panel for preference durability
Labels: phase-7, epic:ux, type:feature, area:web, priority:P1
```

---

## Epic P7-E2 — Switching behavior

### Issue: Switching driver model
```
Title: Model switching triggers and thresholds
Labels: phase-7, epic:switching, type:feature, area:sim, priority:P0

## Examples
15% cheaper, better quality, faster service, new feature, location, free delivery, trust, loyalty.

## Acceptance criteria
- [ ] switching scenarios runnable in experiment workspace
- [ ] links to alternatives graph from Phase 5
```

---

## Epic P7-E3 — Market change context

### Issue: Bind temporal sims to economic and competitor history
```
Title: Condition preference/switching on historical market change
Labels: phase-7, epic:temporal, type:feature, area:sim, priority:P1

## Acceptance criteria
- [ ] can replay “after fuel spike” or “after competitor price cut” contexts
- [ ] cites OBSERVED history used as conditioning evidence
```
