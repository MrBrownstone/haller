# Traffic Fines System – Technical Roadmap

This document translates the original functional roadmap into an implementation roadmap for this repository.

It is the working technical plan for the module and should reflect both:

- the intended long-term system scope
- the delivery status of what has already been built

## Scope and principles

- This repository is a separate module intended to align visually and operationally with the broader Nomarys project.
- Code, routes, and technical naming stay in English.
- User-facing copy may remain in Spanish.
- The first domain entity is `intake`.
- `case` is intentionally reserved for a later reviewed/promoted legal matter.
- The first release optimizes for operational clarity, not legal automation.
- Automation should focus first on structured and repetitive work.
- Professional legal judgment remains outside the automated layer.

## Status legend

- `[x]` completed
- `[ ]` pending
- `[~]` partially delivered / next slice already identified

Completed items are also struck through when useful, so the roadmap doubles as a progress record.

## Current baseline

### Product baseline

- [x] ~~Public user intake flow exists~~
- [x] ~~Dedicated success state with public reference exists~~
- [x] ~~Internal local intake inbox exists at `/admin/intakes`~~
- [x] ~~Internal intake detail review page exists at `/admin/intakes/[publicId]`~~
- [x] ~~Homepage now acts as a direct intake-first entry point~~
- [x] ~~Public flow has been simplified to one primary path~~
- [x] ~~Public copy has been moved away from internal roadmap language~~

### Technical baseline

- [x] ~~Next.js App Router project is initialized~~
- [x] ~~Repository is standardized on `pnpm`~~
- [x] ~~Shared UI primitives are on a real shadcn/ui foundation~~
- [x] ~~Project-owned styling remains layered on top of shadcn/ui~~
- [x] ~~Local SQLite persistence is in place for development~~
- [x] ~~The database file is created automatically on first write~~
- [x] ~~No user account system is required for the first intake flow~~

## Delivery phases

### Phase 0 – Repository and UI foundation

Goal: establish the repo, visual system, component baseline, and operating conventions before building domain flows.

- [x] ~~Initialize the Next.js module and keep it scoped to this repo~~
- [x] ~~Standardize package management on `pnpm` only~~
- [x] ~~Adopt a shared visual direction aligned with Nomarys~~
- [x] ~~Initialize real shadcn/ui support in the repo~~
- [x] ~~Restore project-specific spacing, geometry, and palette on top of shadcn/ui~~
- [x] ~~Document repo workflow conventions in `AGENTS.md` and `CHANGELOG.md`~~

### Phase 1 – Intake MVP

Goal: let an incoming user submit a consultation without creating an account, and make that submission visible internally.

- [x] ~~Define `intake` as the first domain entity~~
- [x] ~~Reserve `case` for a later reviewed/promoted entity~~
- [x] ~~Build the public intake form~~
- [x] ~~Create an intake record in local SQLite~~
- [x] ~~Generate a public intake reference ID~~
- [x] ~~Add a public success page after submission~~
- [x] ~~Add a local internal inbox for received intakes~~
- [x] ~~Use `pending_review` as the initial internal status~~
- [x] ~~Support an optional “has documents” signal from day one~~
- [x] ~~Make additional user notes optional rather than mandatory~~
- [x] ~~Keep the first release account-free~~
- [x] ~~Simplify the landing page to one clear intake submission path~~

Primary capability coverage:

- [x] ~~C1 – Basic intake data entry~~
- [~] C2 – Intake-side workflow now exists, but there is still no formal `case` entity
- [~] C6 – Real intake document handling now exists, but later case-level document handling is still pending

### Phase 2 – Intake review and case promotion

Goal: turn the current inbox into an actual operational review queue and introduce the first formal `case` record.

- [x] ~~Add review actions on intakes~~
- [x] ~~Support intake states beyond `pending_review`~~
- [ ] Add “promote intake to case”
- [x] ~~Add “reject intake”~~
- [x] ~~Add “request more information”~~
- [ ] Define the first `case` schema
- [ ] Record the relationship between `intake` and `case`
- [ ] Keep an audit trail of review decisions

Primary capability coverage:

- [~] Finish the operational part of C2 – case management and workflow

### Phase 3 – Document intake and storage

Goal: move from “documents available” to actual file handling.

- [x] ~~Add upload support for intake documents~~
- [x] ~~Define the first document storage strategy~~
- [x] ~~Associate uploaded files with intakes~~
- [ ] Associate uploaded files with later cases
- [x] ~~Add file metadata, type classification, and timestamps~~
- [x] ~~Add basic validation for file type and size~~
- [x] ~~Show uploaded document presence in the internal inbox/review flow~~
- [x] ~~Add internal document actions for preview, download, print, and delete~~

Primary capability coverage:

- [~] Finish C6 – document intake and storage

### Phase 4 – Infraction data model

Goal: capture infractions as structured records instead of relying only on free-text summaries.

- [ ] Define the infraction entity
- [ ] Capture structured fields such as court, type, date, amount, speed, and status
- [ ] Support one-to-many relationships between cases and infractions
- [ ] Add normalization rules for repeated infraction attributes
- [ ] Add the first internal screens for infraction review/editing
- [ ] Add simple categorization rules

Primary capability coverage:

- [ ] C3 – infraction registry
- [ ] C4 – infraction classification

### Phase 5 – Legal identity and data consistency

Goal: make person, vehicle, intake, case, and infraction relationships explicit and reliable.

- [ ] Define person and vehicle entities
- [ ] Link persons and vehicles consistently to cases
- [ ] Add integrity rules for ownership / representation relationships
- [ ] Prevent duplicate or conflicting identity records
- [ ] Add internal tools for reconciling inconsistent data

Primary capability coverage:

- [ ] C7 – legal identity and consistency

### Phase 6 – Quote and strategy assistance

Goal: support human legal work without automating final judgment.

- [ ] Add case pricing / quote records
- [ ] Add an assisted budget suggestion layer
- [ ] Allow manual override of suggested pricing
- [ ] Define the first strategy model
- [ ] Add structured strategy options such as prescription, nullity, and other challenge paths
- [ ] Keep all recommendations reviewable and editable by staff

Primary capability coverage:

- [ ] C5 – quote and valuation assistance
- [ ] C8 – strategy selection assistance

### Phase 7 – Filing generation and case follow-up

Goal: automate structured outputs only after the underlying case model is stable.

- [ ] Define filing/document template infrastructure
- [ ] Add placeholder resolution from case and infraction data
- [ ] Support template variants by case type
- [ ] Generate draft filings from structured case records
- [ ] Record filing submission events
- [ ] Track case follow-up states after submission

Primary capability coverage:

- [ ] C9 – filing generation
- [ ] C10 – filing/presentation tracking

### Phase 8 – External channels

Goal: add additional intake channels only after the core web workflow is stable.

- [ ] Add a WhatsApp intake channel without AI first
- [ ] Support intake creation from structured WhatsApp collection flows
- [ ] Support document collection through WhatsApp
- [ ] Add quote delivery through the channel if it proves operationally useful
- [ ] Evaluate optional AI-based extraction only for narrow text parsing tasks
- [ ] Keep AI strictly out of legal advice and legal decision-making

## Capability matrix

| Capability | Functional meaning | Technical phase | Status |
| --- | --- | --- | --- |
| C1 | Basic intake data entry | Phase 1 | Done |
| C2 | Case management and workflow | Phases 1–2 | In progress |
| C3 | Infraction registry | Phase 4 | Pending |
| C4 | Infraction classification | Phase 4 | Pending |
| C5 | Quote and valuation assistance | Phase 6 | Pending |
| C6 | Document intake and storage | Phases 1–3 | In progress |
| C7 | Legal identity consistency | Phase 5 | Pending |
| C8 | Strategy selection assistance | Phase 6 | Pending |
| C9 | Filing generation | Phase 7 | Pending |
| C10 | Presentation and follow-up | Phase 7 | Pending |
| WhatsApp base | Additional intake channel | Phase 8 | Pending |
| WhatsApp with optional AI | Narrow data extraction only | Phase 8 | Pending |

## Current implementation notes

- Public intake currently stores:
  - full name
  - DNI
  - email
  - phone / WhatsApp
  - vehicle plate
  - jurisdiction
  - optional additional information
  - whether documents are available
- Public submissions create local SQLite rows in the `intakes` table.
- Intake review now also stores local SQLite rows in `intake_documents` for uploaded files.
- Success states expose a generated public reference in the `INT-YYYYMMDD-XXXX` format.
- Internal review now includes:
  - a dedicated per-intake review page
  - status transitions on the intake itself
  - local document upload and deletion
  - document source metadata (`admin` or `customer`)
  - modal-based preview for uploaded files
- Uploaded file binaries are stored on the local filesystem under `data/intake-documents`.
- The current document actions available internally are:
  - preview
  - download
  - print
  - delete

## Open decisions

- Decide when `jurisdiction` becomes a curated list instead of free text.
- Decide when the first hosted database migration should happen.
- Decide the exact review-to-case promotion workflow before introducing `case`.
- Decide when local file storage should be replaced by a hosted provider.
- Decide how much of quote and strategy assistance should be rules-based before any AI is considered.

## Recommended next slice

If development resumes from the current baseline, the next highest-value slice is:

1. create the first `case` entity
2. promote an approved intake into a case
3. add an audit trail for intake review decisions and document mutations
4. decide whether customer-side upload should reuse the same document model
