# Browser-Based Planning (claude.ai — "MSA Phase 2" Project)

These six files were exported from a separate **claude.ai browser Project** named "MSA Phase 2", used for early planning and design work roughly between **2026-06-23 and 2026-07-21** — before local Claude Code session logging for this repo begins (see `specs/sessions/`, which starts 2026-07-27).

Unlike `specs/sessions/*.md` (mined verbatim, programmatically, from raw local transcripts), these files are prompt-and-summary records written up from that browser Project's history. Minor character-encoding artifacts from the original export (e.g. `Ã©` → `é`, corrupted dashes/arrows) were cleaned up when these were added to the repo; no wording was otherwise changed.

## Files

| File                                                 | Covers                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| [01-planning-prompts.md](01-planning-prompts.md)     | Initial concept development and evolution into a gamified fencing club platform |
| [02-backend-prompts.md](02-backend-prompts.md)       | Early EF Core model, seed data, CQRS handlers, Scalar docs, auth                |
| [03-frontend-prompts.md](03-frontend-prompts.md)     | NavBar, ActivityForm (React Hook Form + Zod), routing, Resources page           |
| [04-cicd-prompts.md](04-cicd-prompts.md)             | GitHub Actions pipeline design, branch protection, Playwright CI                |
| [05-design-decisions.md](05-design-decisions.md)     | Rationale for domain choice, cookie auth, CQRS, shadcn/ui, data modelling       |
| [06-agent-instructions.md](06-agent-instructions.md) | Tech stack, domain context, and constraints given to Claude during this phase   |

## Important: the original concept changed during implementation

`01-planning-prompts.md` and parts of `05-design-decisions.md` / `06-agent-instructions.md` describe an initial, more ambitious gamification design — **XP, Levels, Streaks, a `Tournament`/`Registration`/`Bout`/`TrainingLog`/`Announcement` schema, and a `Badge` master table**, plus client-side state management with Zustand as a planned advanced requirement.

That design was **scoped down early in implementation**. Git history confirms this: on **2026-07-03**, the same day `ClubActivity` was introduced, an earlier `ScoreEntry` model was explicitly deleted (`chore: deleted ScoreEntry model`). What actually shipped is the simpler system described in the root [README.md](../../README.md) and [`specs/architecture.md`](../architecture.md): `ClubActivity` + `ActivityAttendance` + hardcoded milestone badges (`AttendanceBadges.cs`), no XP/Levels/Streaks/Tournaments/Bouts, and Zustand + theme switching + Playwright e2e as the three marked advanced requirements (not WebSockets).

This mismatch is left in deliberately, not edited away — it's genuine evidence of the planning/design process (a scope pivot away from an overambitious first concept, matched by real commit history), and of critically evaluating rather than blindly accepting AI-generated design output, not a case of the AI-usage evidence disagreeing with the shipped app by accident.
