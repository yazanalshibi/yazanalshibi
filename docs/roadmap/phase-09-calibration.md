# Phase 9 — Real-World Calibration

**Goal:** Connect experiments with actual outcomes; build the Calibration Database moat.

**Exit criteria:** Users can record real-world test results against a simulation run; deltas stored; basic error attribution (segment / assumption / data / model) supported.

**Depends on:** Phase 4+ (usable experiments)

---

## Epic P9-E1 — Outcome capture

### Issue: Real-world test result schema
```
Title: Capture actual outcomes linked to simulation runs
Labels: phase-9, epic:calibration, type:feature, area:api, priority:P0

## Example
Simulated purchase response 14% vs actual 8.5%.

## Acceptance criteria
- [ ] link experiment_version_id → actual_metric records
- [ ] support multiple metrics and segments
- [ ] provenance for how actuals were measured
```

### Issue: Private actuals isolation
```
Title: Keep proprietary actual outcomes tenant-private
Labels: phase-9, epic:calibration, type:feature, area:api, priority:P0

## Acceptance criteria
- [ ] actuals never leak to public market twin without contract flag
- [ ] audit log on actuals access
```

---

## Epic P9-E2 — Delta analysis

### Issue: Calibration delta and attribution workflow
```
Title: Analyze sim vs actual deltas and likely error sources
Labels: phase-9, epic:calibration, type:feature, area:api, priority:P0

## Questions
Which segment was wrong? Which assumption? Which data missing? Which model overestimated?

## Acceptance criteria
- [ ] stores delta permanently in calibration database
- [ ] attribution tags: segment, assumption, missing_data, model
- [ ] findings labeled INFERRED when model-assisted
```

---

## Epic P9-E3 — Recalibration hooks

### Issue: Feed calibration into future priors
```
Title: Apply calibration adjustments to future simulation priors
Labels: phase-9, epic:calibration, type:feature, area:sim, priority:P1

## Acceptance criteria
- [ ] adjustable bias parameters versioned
- [ ] experiment results cite calibration version used
- [ ] can disable adjustments for ablation
```

### Issue: Calibration learning history report
```
Title: Report proprietary market learning history across experiments
Labels: phase-9, epic:calibration, type:feature, area:api, priority:P2

## Acceptance criteria
- [ ] aggregate accuracy trends over time
- [ ] export for enterprise/research tiers later
```
