# Privacy & Governance

Governance is a Phase 1 requirement, not a late add-on.

## Principles

1. **Local / private by default** where appropriate.  
2. **Synthetic consumers represent statistical populations** — do not impersonate identifiable individuals.  
3. **Public market intelligence** and **private company intelligence** remain separated with access controls.  
4. **Source licensing** is enforced in ingestion (no unlicensed commercial redistribution).  
5. **Data minimization** — collect only what is needed for stated purpose.  
6. **PII separation** — operational identity data isolated from market analytics where possible.  
7. **Lineage** — every derived insight traces to sources and transform versions.  
8. **Deletion & retention** — support retention periods and deletion requests for private tenant data.

## Controls checklist

| Control | Requirement |
|---------|-------------|
| Data permissions | Role-based + tenant-scoped |
| Retention periods | Per source class / tenant policy |
| Source licensing | Registry with allowed uses |
| Consent | For proprietary / personal data where required |
| Data minimization | Schema + ingest filters |
| PII separation | Dedicated stores / fields; no PII in graph demos |
| Encryption | In transit (TLS) and at rest |
| Access control | Org → workspace → dataset ACLs |
| Audit logs | Read/write on sensitive datasets |
| Dataset lineage | Source → raw → normalized → insight |
| Deletion | Soft-delete + hard-delete jobs for private data |
| Model provenance | Model/prompt/pipeline version on inferences |

## Tenant model

```
Organization
  └── Workspace
        ├── PublicMarketDatasets (read, licensed)
        ├── PrivateDatasets (org-only)
        ├── Experiments
        └── CalibrationRecords
```

Private enrichment never becomes shared training/public data unless explicitly contracted and legally cleared.

## Evidence & simulation labeling (trust)

UI and API must always expose evidence class + confidence. Marketing copy and exports must not strip labels.
