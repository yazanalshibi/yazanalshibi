# Phase 1 — Foundation

**Goal:** Complete data architecture — sources → ingestion → normalization → knowledge graph → provenance → history → confidence → API.

**Exit criteria:** Can register a source, ingest a sample dataset, write normalized entities with provenance, query via API, and see confidence/evidence labels on a sample finding.

---

## Epic P1-E1 — Repository & platform skeleton

### Issue: Initialize monorepo structure
```
Title: Initialize Market Twin monorepo (api, web, workers, schemas)
Labels: phase-1, epic:platform-skeleton, type:infra, priority:P0

## Summary
Create the greenfield repository layout for FastAPI, Next.js, workers, and shared schemas.

## Acceptance criteria
- [ ] `apps/api`, `apps/web`, `workers/`, `packages/schemas`, `docs/` present
- [ ] Root README links to product docs
- [ ] `docker-compose.yml` boots Postgres+pgvector, Neo4j, Redis, MinIO
- [ ] `make up` / documented equivalent starts local deps
```

### Issue: CI baseline
```
Title: Add CI for lint, typecheck, and unit tests
Labels: phase-1, epic:platform-skeleton, type:infra, priority:P1

## Acceptance criteria
- [ ] API lint + pytest on PR
- [ ] Web lint + typecheck on PR
- [ ] Compose services healthcheck documented
```

---

## Epic P1-E2 — Identity, tenancy, audit

### Issue: Org/workspace tenancy model
```
Title: Implement organization and workspace tenancy in Postgres
Labels: phase-1, epic:tenancy, type:feature, area:api, priority:P0

## Summary
Support public vs private dataset scoping from day one.

## Acceptance criteria
- [ ] tables: organizations, workspaces, memberships, roles
- [ ] every domain table has tenant/workspace scope where needed
- [ ] API rejects cross-tenant reads
```

### Issue: Audit log MVP
```
Title: Audit log for sensitive dataset access
Labels: phase-1, epic:tenancy, type:feature, area:api, priority:P1

## Acceptance criteria
- [ ] append-only audit events for read/write on private datasets
- [ ] actor, resource, action, timestamp recorded
```

---

## Epic P1-E3 — Source registry & licensing

### Issue: Source and license registry
```
Title: Create source registry with license constraints
Labels: phase-1, epic:ingestion, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] register source metadata (name, owner, URL, refresh cadence)
- [ ] license record with allowed uses / redistribution flags
- [ ] ingest blocked if license missing or disallows use
```

### Issue: Immutable raw artifact storage
```
Title: Store immutable raw source snapshots in object storage
Labels: phase-1, epic:ingestion, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] each ingest run writes raw payload to object store
- [ ] raw URI linked on provenance record
- [ ] re-processing possible from raw without re-fetch
```

---

## Epic P1-E4 — Ingestion & normalization pipeline

### Issue: Ingest run orchestration
```
Title: Build ingest run worker pipeline
Labels: phase-1, epic:ingestion, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] create ingest_run with status lifecycle
- [ ] worker pulls job from queue
- [ ] failures recorded with error detail; partial success visible
```

### Issue: Normalization framework
```
Title: Normalize heterogeneous sources into canonical entities
Labels: phase-1, epic:ingestion, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] pydantic schemas for Business, Location, Product, PriceObservation, ReviewEvidence
- [ ] mapper interface per source connector
- [ ] transform_version stamped on outputs
```

### Issue: Connector stub — seed CSV/JSON
```
Title: Ship first connector for seed CSV/JSON market files
Labels: phase-1, epic:ingestion, type:feature, area:data, priority:P0

## Acceptance criteria
- [ ] load local/seed files for GTA automotive demo
- [ ] produces normalized businesses, products, prices, reviews
- [ ] full provenance chain present
```

---

## Epic P1-E5 — History & provenance

### Issue: Temporal price and entity history
```
Title: Preserve historical price and business attribute changes
Labels: phase-1, epic:history, type:feature, area:data, priority:P0

## Summary
Do not overwrite competitor price; store timelines.

## Acceptance criteria
- [ ] price_observation is append-only with observed_at
- [ ] business attribute changes create history rows (SCD-style or event log)
- [ ] API can return price timeline for a product/location
```

### Issue: Provenance API on every record
```
Title: Expose provenance metadata on entity and insight APIs
Labels: phase-1, epic:history, type:feature, area:api, priority:P0

## Acceptance criteria
- [ ] source_id, license_id, collected_at, ingest_run_id, raw_uri, transform_version returned
- [ ] OpenAPI documents provenance fields
```

---

## Epic P1-E6 — Knowledge graph bootstrap

### Issue: Neo4j projection from Postgres
```
Title: Project canonical entities into Neo4j knowledge graph
Labels: phase-1, epic:graph, type:feature, area:graph, priority:P0

## Acceptance criteria
- [ ] nodes: Geo, Business, Product, Category
- [ ] edges: LOCATED_IN, SELLS, PART_OF
- [ ] Postgres IDs are stable external keys on nodes
- [ ] rebuild job is idempotent
```

### Issue: Graph query API — market neighborhood
```
Title: API to query businesses/products in a geography
Labels: phase-1, epic:graph, type:feature, area:api, priority:P1

## Acceptance criteria
- [ ] query by city/neighborhood name or geo_id
- [ ] returns competitors and products with provenance refs
```

---

## Epic P1-E7 — Evidence labels & confidence

### Issue: Evidence classification enum end-to-end
```
Title: Enforce OBSERVED/REPORTED/INFERRED/SIMULATED/PREDICTED labels
Labels: phase-1, epic:confidence, type:feature, area:api, priority:P0

## Acceptance criteria
- [ ] shared schema package exports EvidenceType
- [ ] insight create/read requires evidence_type
- [ ] API validation rejects missing labels
```

### Issue: Confidence rubric MVP
```
Title: Implement deterministic confidence rubric for findings
Labels: phase-1, epic:confidence, type:feature, area:api, priority:P1

## Acceptance criteria
- [ ] inputs: evidence count, freshness, geo coverage, source diversity
- [ ] outputs Low/Medium/High with explanation fields
- [ ] unit tests for rubric boundaries
```

---

## Epic P1-E8 — Foundation API & health

### Issue: Public health and version endpoints
```
Title: Health, readiness, and build version endpoints
Labels: phase-1, epic:api, type:chore, area:api, priority:P1
```

### Issue: OpenAPI documentation published
```
Title: Publish OpenAPI for foundation entities and ingest
Labels: phase-1, epic:api, type:docs, area:api, priority:P1
```
