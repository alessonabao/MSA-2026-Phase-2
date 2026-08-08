# /specs — Planning, Design, and AI-Assisted Development Evidence

This folder exists to satisfy the 2026 Phase 2 Software Assessment requirement for a
`/specs` folder at the repository root containing genuine evidence of planning, design,
and AI-assisted development — specifically, real prompts used during development
(not reconstructed after the fact), agent/tooling context, and related configuration.

EnGarde (`software/demo/`) was built with the help of **Claude Code** running as a VS
Code extension for almost the entire build, plus a separate **Claude.ai browser
Project** ("MSA Phase 2") for some earlier high-level planning. Claude Code logs every
local session to a JSONL transcript on the developer's machine
(`~/.claude/projects/...`). Those transcripts are the source of truth for everything in
`specs/sessions/` — they were mined directly, not rewritten or summarised from memory.

## How this folder was built

- Every `.jsonl` session transcript for this project (35 files, spanning
  2026-07-27 through 2026-08-02) was parsed programmatically.
- Only lines representing text a human actually typed into Claude Code were kept.
  Anything synthetic — IDE "file opened"/"selection" notices, slash-command
  echoes, background task-completion notifications, auto-generated
  conversation-continuation summaries, tool results, and the
  `[Request interrupted by user for tool use]` marker Claude Code inserts on
  Escape — was filtered out.
- Prompts are reproduced **verbatim** (only leading/trailing whitespace trimmed) and
  ordered chronologically per day, each tagged with its local time (NZT) and the
  originating session ID.
- One session (`025c25ca-…`, the conversation that produced this `/specs` folder
  itself) was excluded — it is about building this documentation, not about building
  the app, so including it would misrepresent it as "app development" evidence.

## Contents

| File | What it is |
|---|---|
| `sessions/2026-07-27.md` … `sessions/2026-08-02.md` | Verbatim, timestamped prompts, grouped by day |
| `browser-sessions/` | Earlier planning prompts from the claude.ai browser Project (not locally logged — see below) |
| `ai-usage-summary.md` | Narrative summary of how AI was used across the project, with concrete cited examples |
| `agent-instructions.md` | What agent/tooling configuration did (and didn't) exist for this repo |
| `architecture.md` | ERD + user-flow Mermaid diagrams, generated from the real EF Core models/routes in a 2026-08-01 session |

## Session index

| Date | Topic (from that day's commits + prompts) | Prompts |
|---|---|---|
| [2026-07-27](sessions/2026-07-27.md) | Activity routing/forms, attendee dialog + hosting/going status badges, footer component | 13 |
| [2026-07-28](sessions/2026-07-28.md) | Activity details page (header, forum, venue/price sidebar, filtering) + Identity/User model started | 19 |
| [2026-07-29](sessions/2026-07-29.md) | ASP.NET Core Identity auth (register/login/logout, cookie auth, protected routes), backend xUnit tests, backend CI wiring | 26 |
| [2026-07-30](sessions/2026-07-30.md) | User profile page + Zustand client state, event attendance (join/cancel) with milestone badges, real attendee/attendance data | 19 |
| [2026-07-31](sessions/2026-07-31.md) | Profile edit/picture fixes, Vitest unit tests, Playwright e2e setup against real backend, CI test integration | 24 |
| [2026-08-01](sessions/2026-08-01.md) | CI workflow refactor (unit-test/e2e-test split) + PR merge, project README/docs | 7 |
| [2026-08-02](sessions/2026-08-02.md) | Azure CD pipeline (frontend + backend deploy), CI test fixes, README merge, video-script prep | 46 |

**Total: 154 genuine prompts across 7 days of local Claude Code sessions.**

## About the browser-based planning (not in these logs)

Before local session logging shows any activity (i.e. before 2026-07-27), the developer
also used a separate **claude.ai browser Project** named "MSA Phase 2" for earlier
planning conversations, roughly **2026-06-23 through 2026-07-21**. The Claude.ai web app
does not export to a local JSONL transcript the way Claude Code does, so those prompts
could not be mined the same way. They are captured separately in
[`browser-sessions/`](browser-sessions/README.md) — six files covering initial
planning, backend, frontend, CI/CD, design decisions, and agent context/instructions
from that phase.

Worth reading before the video: `browser-sessions/README.md` documents a real scope
pivot — the original concept (XP/Levels/Streaks/Tournaments/Bouts) was cut down early
in implementation to the simpler system that actually shipped, confirmed by a
2026-07-03 commit deleting the earlier `ScoreEntry` model the same day `ClubActivity`
was added.
