# Changelog

This file is a lightweight project context log for future work, not a release log.
Add entries in grouped summaries for completed work, typically before commits, not after every small change. Update it when the user asks for that step.

## 2026-04-15

### Completed

- Turned `/admin/intakes` from a read-only inbox into a navigable review flow with clickable intake rows.
- Added an intake detail route at `/admin/intakes/[publicId]` with a dedicated loading state and not-found handling.
- Expanded the intake workflow beyond `pending_review` by adding richer internal states:
  - `awaiting_documents`
  - `under_review`
  - `ready_for_case`
  - `rejected`
- Added internal state transition actions directly on the intake detail page.
- Introduced real intake document handling backed by local SQLite metadata plus local filesystem storage under `data/intake-documents/`.
- Added document upload support for intake review, including:
  - type validation
  - size validation
  - source tracking (`admin` vs `customer`)
  - optional note metadata
- Added document-serving routes so stored files can be viewed, downloaded, and printed from the admin flow.
- Reworked the document management UI several times toward a simpler operational model:
  - replaced the original side-panel style document browser
  - removed the crowded action-row approach
  - simplified the final table to clickable rows/file names for preview
  - left only icon-only actions for download and delete
- Moved document preview into a modal instead of a persistent embedded panel.
- Simplified document preview behavior to the intended baseline:
  - images render inline in the modal
  - PDFs render in a plain frame
  - unsupported formats fall back to open/download guidance
- Added document deletion so admin review can remove uploaded files and keep intake metadata synchronized.
- Added a print route for documents so the admin flow can trigger browser printing when needed.
- Fixed multiple admin UI issues during the iteration:
  - state help tooltips now render above the button stack instead of being covered
  - the upload card was restructured so file selection and origin are separate rows
  - origin selection now uses a two-option choice instead of a dropdown
  - removed an invalid nested-button structure that caused a hydration warning in development

### Current state

- `/admin/intakes` is now an operational inbox plus entry point into per-intake review.
- `/admin/intakes/[publicId]` acts as the internal review workspace for a single intake.
- Intake review now supports actual status mutation, not just filtering by the original status.
- Documents can now be uploaded, listed, previewed, downloaded, printed, and deleted from the admin flow.
- Document preview is intentionally lightweight and opens in a modal rather than occupying permanent screen space.
- Storage remains local-first:
  - SQLite stores intake and document metadata
  - the filesystem stores the actual uploaded files

### Important decisions

- Keep the first document storage strategy local and simple instead of introducing external object storage yet.
- Treat `admin` and `customer` as document-source metadata now, even before a public upload flow exists.
- Prefer a direct operational document table over a richer embedded document browser.
- Use the table row and file name as the preview trigger, while keeping destructive and export actions explicit.
- Keep preview behavior minimal and native-looking rather than trying to outbuild a full browser document viewer.

### Suggested next steps

- Define the first `case` entity and add the promote-from-intake path.
- Decide whether intake state changes need an explicit audit trail or event log.
- Decide whether customer-side upload should reuse this same document model as a follow-up step.
- Evaluate whether local filesystem storage remains sufficient once multi-user or hosted environments are introduced.

## 2026-03-23

### Completed

- Built the first real intake flow as the phase 0/1 starting point.
- Added a public intake form and submission flow backed by local SQLite.
- Added a success page for completed intake submissions.
- Added an internal intake inbox at `/admin/intakes` for local review.
- Chose `intake` as the initial domain entity and reserved `case` for a later review/promote step.
- Set the initial intake status to `pending_review`.
- Kept document handling optional for this phase and captured whether documentation is available.
- Standardized internal route naming in English by renaming the old internal route to `/admin/intakes`.
- Initialized real shadcn/ui in the repo and migrated the current shared primitives onto shadcn-managed components.
- Added shadcn field primitives and migrated the intake form to the official field composition pattern.
- Restored the custom warm visual system on top of shadcn so the homepage and intake flow preserve the intended layout and feel.
- Reworked the public experience from a roadmap-style page into an actual intake-first product flow.
- Simplified the landing page to a single, direct submission path with the intake form embedded on `/`.
- Rewrote the public-facing copy into a more formal tone.
- Made the additional information textarea optional.
- Added an English technical roadmap at `docs/technical-roadmap.md` based on the original functional roadmap and marked completed delivery status from the beginning of the project.

### Current state

- `/` is now the primary public intake page and the simplest way to submit a consultation.
- `/intake` lets a user create an intake without creating an account.
- `/intake/success/[publicId]` shows the intake confirmation state.
- `/admin/intakes` shows the internal intake inbox.
- Data is stored locally in SQLite and the database file is created automatically on first write.

### Important decisions

- Code and route naming stay in English.
- User-facing copy can remain in Spanish for now.
- Real shadcn/ui is now the component foundation, but visual styling remains project-owned.
- No user accounts in this phase.
- Local SQLite first; evaluate a later move only if the workflow proves out.
- The landing page should optimize for a single straightforward path, not multiple equivalent CTAs.

### Suggested next steps

- Add the internal review action that promotes an intake into a case.
- Define the first `case` entity and its relationship to `intake`.
- Decide whether `jurisdiction` remains free text or becomes a curated list.
- Add optional document upload as the next user-facing step after intake creation.

## 2026-03-22

### Completed

- Read the product roadmap in `docs/Gestión de Multas – Roadmap Funcional del Sistema.md`.
- Confirmed this repo should be a separate module that visually aligns with the broader `nomarys` project.
- Extracted the first shared visual layer inspired by `../nomarys`:
  - warm neutral token palette
  - card, badge, and button UI primitives
  - local Geist font setup
- Replaced the default starter page with a `Gestion de Multas` landing page based on the roadmap.
- Set `turbopack.root` in `next.config.ts` to keep Next scoped to this repo.
- Standardized the repo on `pnpm` and documented that in `AGENTS.md`.

### Current state

- The app currently has a polished marketing/module shell at `/`.
- The visual language is intentionally aligned with `nomarys`, but the domain logic is still separate.
- The implementation so far is presentation-only; the roadmap capabilities are not built yet.

### Important decisions

- Use `pnpm` only in this repository.
- Keep this project modular and independent from `nomarys` business logic.
- Reuse visual patterns from `nomarys`, but avoid tightly coupling the codebases.
- Use local fonts instead of network-fetched fonts so builds work reliably.

### Suggested next steps

- Build Phase 1 of the roadmap first: C1, C2, and C6.
- Define the core domain model for cases, people, vehicles, infractions, and documents.
- Add the first real flow: create a case from DNI + dominio.
- After the core flow is stable, add document upload and case state tracking.
