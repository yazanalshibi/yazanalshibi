# Epic & Issue Index

Flat index of all epics and issue titles for GitHub import. Full acceptance criteria live in the phase files.

| Phase | Epic | Issue title | Priority |
|------:|------|-------------|----------|
| 1 | platform-skeleton | Initialize Market Twin monorepo (api, web, workers, schemas) | P0 |
| 1 | platform-skeleton | Add CI for lint, typecheck, and unit tests | P1 |
| 1 | tenancy | Implement organization and workspace tenancy in Postgres | P0 |
| 1 | tenancy | Audit log for sensitive dataset access | P1 |
| 1 | ingestion | Create source registry with license constraints | P0 |
| 1 | ingestion | Store immutable raw source snapshots in object storage | P0 |
| 1 | ingestion | Build ingest run worker pipeline | P0 |
| 1 | ingestion | Normalize heterogeneous sources into canonical entities | P0 |
| 1 | ingestion | Ship first connector for seed CSV/JSON market files | P0 |
| 1 | history | Preserve historical price and business attribute changes | P0 |
| 1 | history | Expose provenance metadata on entity and insight APIs | P0 |
| 1 | graph | Project canonical entities into Neo4j knowledge graph | P0 |
| 1 | graph | API to query businesses/products in a geography | P1 |
| 1 | confidence | Enforce OBSERVED/REPORTED/INFERRED/SIMULATED/PREDICTED labels | P0 |
| 1 | confidence | Implement deterministic confidence rubric for findings | P1 |
| 1 | api | Health, readiness, and build version endpoints | P1 |
| 1 | api | Publish OpenAPI for foundation entities and ingest | P1 |
| 2 | geo | Ingest GTA geo hierarchy (province → CMA → city → neighborhood → FSA) | P0 |
| 2 | geo | Attach population, income, density overlays to geo nodes | P1 |
| 2 | industry-pack | Define industry taxonomy for automotive services / detailing | P0 |
| 2 | industry-pack | Curate seed dataset of GTA detailing businesses, offers, prices | P0 |
| 2 | economic | Store economic indicators affecting willingness to spend | P1 |
| 2 | market-views | Market landscape API for geography + category | P0 |
| 2 | market-views | Extract review themes without discarding raw evidence | P1 |
| 2 | quality | Define and measure representation completeness scorecard | P1 |
| 3 | sim-engines | Spike: evaluate open-source agent/population engines | P0 |
| 3 | sim-engines | Define SimulationEngine adapter (populate, run, export) | P0 |
| 3 | digital-twin | Implement synthetic consumer digital twin schema | P0 |
| 3 | digital-twin | Generate synthetic population grounded in GTA segment distributions | P0 |
| 3 | memory | Persist per-agent simulated experience memory | P1 |
| 3 | runner | Run population-level evaluations as async jobs | P0 |
| 3 | runner | Policy tests preventing identifiable person impersonation | P0 |
| 4 | experiments | Model commercial offer for experiments | P0 |
| 4 | experiments | Experiment workspace with baseline and counterfactual versions | P0 |
| 4 | ux | Natural-language intent intake for market experiments | P0 |
| 4 | ux | UI to compare baseline vs version simulated outcomes | P0 |
| 4 | experiments | Evaluate all offer versions on the same synthetic population | P0 |
| 4 | experiments | Structured experiment output (context, reaction, barriers, alternatives) | P0 |
| 4 | ux | Create dashboard shell for experiment results | P1 |
| 5 | needs | Implement Need as first-class data object | P0 |
| 5 | needs | Pipeline to extract need signals from consumer evidence | P0 |
| 5 | rejection | Model rejection reasons distinct from lack of demand | P0 |
| 5 | rejection | Rank primary barriers in simulated + inferred outputs | P1 |
| 5 | alternatives | Capture consumer alternatives including do-nothing | P0 |
| 5 | modification | Generate testable modification hypotheses from rejection reasons | P2 |
| 5 | needs | Seed demo where convenience need outranks “better detailing” | P1 |
| 6 | pricing | Expand price intelligence fields | P0 |
| 6 | wtp | Estimate multiple WTP concepts per experiment | P0 |
| 6 | wtp | Pluggable WTP methodology adapters | P1 |
| 6 | pricing | Run multi-price response ladders on fixed population | P0 |
| 6 | ux | Dashboard Price panel for WTP and sensitivity | P1 |
| 6 | pricing | Simulate trade-offs (e.g. lower price vs pickup included) | P1 |
| 7 | temporal | Model preference state at 0/1/3/6/12 months | P0 |
| 7 | ux | Dashboard Time panel for preference durability | P1 |
| 7 | switching | Model switching triggers and thresholds | P0 |
| 7 | temporal | Condition preference/switching on historical market change | P1 |
| 8 | discovery | Score opportunities from needs, gaps, competition, pricing, demographics | P0 |
| 8 | discovery | UX mode “Show me what this market needs” | P0 |
| 8 | opportunity-map | Map indicators across GTA geos | P1 |
| 8 | discovery | Generate investigable concepts from opportunity scores | P1 |
| 9 | calibration | Capture actual outcomes linked to simulation runs | P0 |
| 9 | calibration | Keep proprietary actual outcomes tenant-private | P0 |
| 9 | calibration | Analyze sim vs actual deltas and likely error sources | P0 |
| 9 | calibration | Apply calibration adjustments to future simulation priors | P1 |
| 9 | calibration | Report proprietary market learning history across experiments | P2 |
| 10 | market-twin | Ship unified flow for “$149 express detailing in Scarborough” | P0 |
| 10 | market-twin | Integrate MARKET → IDEA into Market Twin shell | P0 |
| 10 | flywheel | Continuously refresh GTA market foundation | P1 |
| 10 | flywheel | Instrument platform flywheel KPIs | P2 |
| 10 | expansion | Generalize industry packs beyond automotive seed | P1 |
| 10 | commercial | Add entitlement stubs (research / pro / business / enterprise / API) | P2 |
| 10 | commercial | Dedicated private market twin mode for an organization | P2 |
| 10 | trust | Export briefings that preserve evidence classification | P1 |
| 10 | trust | Security review of tenant isolation and PII separation | P0 |

**Counts:** 72 issues across 10 phases.

## Suggested first sprint (Phase 1 P0 only)

1. Initialize monorepo  
2. Org/workspace tenancy  
3. Source + license registry  
4. Raw artifact storage  
5. Ingest run pipeline  
6. Normalization framework  
7. Seed CSV/JSON connector  
8. Historical prices  
9. Provenance API  
10. Neo4j projection  
11. Evidence type enforcement  
