# Data Model

Canonical conceptual model for the Market Intelligence Data Foundation. Implementation maps these entities to PostgreSQL tables and Neo4j nodes/edges (see [TECH_STACK.md](TECH_STACK.md)).

## Evidence classification (required on every insight)

| Label | Meaning |
|-------|---------|
| **OBSERVED** | Directly measured |
| **REPORTED** | Reported by a person or organization |
| **INFERRED** | Derived by a model from evidence |
| **SIMULATED** | Produced by synthetic agents |
| **PREDICTED** | Future estimate |

Never display statements like “73% will purchase” without a label and assumption set.

## Confidence metadata (required on findings)

Each finding should carry:

- Finding statement  
- Evidence count / observation IDs  
- Geographic coverage  
- Freshness (e.g. % within 12 months)  
- Source diversity (source class count)  
- Confidence (Low / Medium / High — deterministic rubric)  
- Type (evidence label above)  
- Model / prompt / pipeline version (for INFERRED / SIMULATED / PREDICTED)

## Core entity groups

### A. Geography

Hierarchy: `Country → Province → CMA → City → Neighborhood → Postal Area → Catchment Area`

Attributes (examples): population, income, businesses, accessibility, transportation, commercial activity, competition density, consumer density, business density.

### B. Demographics

Age, income, household composition, education, employment, housing, family structure, language, population density, migration, consumer segments.

Canada: prefer government and properly licensed datasets.

### C. Economic context

Inflation, interest rates, disposable income, employment, consumer spending, housing costs, fuel prices, industry performance, growth, regional conditions — **historical**, not only latest snapshot.

### D. Industry taxonomy

`Industry → Category → Subcategory → Product/Service Type`

Market participants, density, structure, typical products/prices, seasonality, supply, regulations, terminology, business models, trends. **Industry-agnostic core.**

### E. Business / competitor

Locations, products/services, pricing, promotions, reviews, ratings, positioning, distribution, hours, coverage, openings/closures, price changes — **with history**.

Example: not only `price = $149`, but Jan $129 → Mar $149 → Jun promo $119 → Sep $159.

### F. Product / service

Independent objects (e.g. Automotive Detailing → Interior Detail → Package A): brand, price, features, location, duration, availability, add-ons, promotion, reviews, historical pricing, competitor equivalents.

### G. Consumer evidence (retain raw)

Reviews, surveys, interviews, search behavior, questions, feedback, CRM, purchases, repeats, churn, website behavior, ad response, abandonment, promotions, service interactions.

**Do not** immediately reduce to a single sentiment score. Store source text/structure + derived annotations.

### H. Needs (first-class)

Signal shape:

`Problem → Desired Outcome → Current Solution → Alternative → Barrier → Trigger → Context → Evidence`

Dimensions:

| Dimension | Question |
|-----------|----------|
| Functional | What needs to get done? |
| Emotional | How does the customer want to feel? |
| Convenience | What friction to remove? |
| Economic | What financial constraint? |
| Social | Status / community / social proof? |
| Unmet | What does the market fail to provide? |
| Latent | What pattern suggests opportunity without explicit ask? |

### I. Rejection reasons

Rejection ≠ lack of demand. Capture reason codes: price, timing, location, convenience, trust, brand, feature, quality, commitment, delivery, availability, payment structure.

Distinguish:

- **No need** — “I don’t need it”  
- **Need, wrong offer** — “I need it, but not like this”

### J. Alternatives

For each important need: Competitor → DIY → Existing product → Delay → Substitute → **Do nothing**.

### K. Price intelligence

List, promotional, historical, competitor, bundle, subscription, add-ons, regional, transactional (when available).

Simulation outputs (e.g. response at $99…$249) are **SIMULATED**, never presented as facts.

### L. Willingness to pay (multiple concepts)

Acceptable price, expected price, good-value price, premium threshold, resistance threshold, maximum considered price.

Methods later: Van Westendorp, Gabor-Granger, conjoint / discrete choice, observed transactions. **Observed purchases weigh more than hypotheticals when appropriate.**

### M. Preference duration

Synthetic consumer state over `today → 1m → 3m → 6m → 12m` with novelty, experience, satisfaction, price changes, competitor entry, technology, trends, economy, personal needs → **Preference Decay / Retention Curve**.

### N. Switching factors

Drivers such as % cheaper, quality, speed, feature, location, delivery, trust, loyalty — for retention/competitive strategy.

### O. Synthetic consumer (digital twin fields)

Demographics, geography, economic context, needs, current alternatives, preferences, constraints, price sensitivity, purchase-history state, brand awareness, trust, lifestyle context, decision drivers, memory, past simulated experiences.

Richer than decorative personas (“Sarah, 31, likes coffee”).

### P. Experiment & calibration

- Experiment: baseline offer + versions, population definition, assumptions, results (labeled)  
- Calibration: simulated metric vs actual metric, segment error, missing data notes, model version, delta stored forever  

## Provenance model (every record)

| Field | Purpose |
|-------|---------|
| `source_id` | Registered source |
| `license_id` | Licensing constraints |
| `collected_at` / `observed_at` | Freshness |
| `ingest_run_id` | Pipeline run |
| `raw_uri` | Immutable raw artifact |
| `transform_version` | Normalization code version |
| `tenant_id` | `public` or private org |
| `pii_class` | none / pseudonymous / restricted |

## Suggested graph relationships (Neo4j)

- `LOCATED_IN`, `PART_OF` (geo)  
- `OPERATES_IN`, `COMPETES_WITH`  
- `SELLS`, `EQUIVALENT_TO`, `SUBSTITUTE_FOR`  
- `EXPRESSES_NEED`, `SATISFIES`, `BLOCKS` (barrier)  
- `ALTERNATIVE_TO`, `SWITCHES_FOR`  
- `PRICED_AT` (with temporal properties)  
- `SUPPORTED_BY` (insight → evidence)  
- `CALIBRATES` (actual outcome → simulation run)
