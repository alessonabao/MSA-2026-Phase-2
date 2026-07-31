# Agent Instructions and Context

AI tool used: Claude (claude.ai)

## Project context provided to AI

The following context was provided to Claude at the start of and throughout the project to ensure consistent, accurate assistance:

---

### Tech stack

- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router v7, TanStack Query, React Hook Form + Zod v4
- **Backend:** ASP.NET Core .NET 10, EF Core, SQLite (development), MediatR (CQRS), AutoMapper, ASP.NET Core Identity, Scalar API docs
- **CI/CD:** GitHub Actions with reusable workflows, Playwright for e2e testing
- **State management:** TanStack Query for server state; Zustand for client-side global state (advanced requirement)

---

### Domain context

EnGarde is a gamified fencing club management platform for the Auckland University Fencing Club. Users are either Members (can join/cancel activities, earn badges) or ClubAdmins (can create/edit/delete activities). Gamification elements: XP earned per action, levels calculated from XP, badges awarded at thresholds, streaks for consecutive training days, and a club leaderboard.

> Note: this domain description reflects the original planning-phase concept. The XP/Level/Streak/leaderboard system described here did not ship — see `specs/browser-sessions/README.md` for what changed and why.

---

### Coding conventions established during development

- Short, direct sentences in comments and documentation
- Google XYZ formula for bullet points in README
- `"Header: content"` format for skills section bullets
- Present tense for in-progress features
- Semantic commit messages following Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`, `refactor:`)
- Branch naming: `feature/[issue-number]-[short-description]`
- All merges to `main` via pull request — no direct pushes

---

### Key constraints Claude was asked to respect

1. Do not replace TanStack Query — Zustand is for client-side global state only
2. `TimeOnly` and `DateOnly` fields are used deliberately — do not revert to `DateTime`
3. The Zod v4 `.transform()` pattern is required for coerced numbers and dates — do not use `z.infer`, always use `z.output`
4. `DeleteBehavior.Restrict` on all `Bout` FK relationships — do not change to `Cascade`
5. shadcn components are preferred over raw HTML elements for all UI work
6. All CI/CD changes must be pushed to `main` before feature branch pipelines can reference them

---

### Files Claude was given access to during development

- `backend.csproj` — to verify .NET version, packages, and target framework
- `package.json` — to verify Node version, installed packages, and available scripts
- `AppDbContext.cs` — to understand entity relationships and migration state
- `ActivityForm.tsx` — repeatedly shared for iterative form fixes
- `useActivities.ts` — for React Query hook debugging
- `playwright.config.ts` — for CI test configuration
- `frontend-ci-ruleset.json` — for GitHub branch protection debugging
- Various `.yml` workflow files — for CI pipeline iteration
