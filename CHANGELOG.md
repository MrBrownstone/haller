# Changelog

This file is a lightweight project context log for future work, not a release log.
Add entries in grouped summaries for completed work, typically before commits, not after every small change. Update it when the user asks for that step.

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
