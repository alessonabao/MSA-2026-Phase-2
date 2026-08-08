# How AI Was Used in This Project

This is a narrative summary of how Claude was used to build EnGarde, grounded in the
actual mined session transcripts in `specs/sessions/`. It's written for a marker
skimming quickly — every claim below is backed by a real, dated prompt, not a
reconstruction.

## Planning and scaffolding

Most planning happened feature-by-feature rather than in one big upfront design
session — local logs only start 2026-07-27, once the frontend routing/CRUD basics
already existed (earlier architecture decisions, e.g. the initial Shadcn UI/routing
setup, were worked out in a separate claude.ai browser Project — see
`specs/browser-sessions.md`).

Where planning shows up clearly in the logs is state-management architecture. On
**2026-07-30** (session `57f7ef91`, 19:02) the developer explicitly scoped a new
dependency before writing code:

> "I am currently using TanStack Query for server state... I want to add Zustand
> specifically for client-side global state that TanStack Query doesn't handle well...
> Do not replace TanStack Query — it should remain for server state. Zustand should
> only manage client-side global state"

That same discipline — audit and plan before generating code — recurs for both major
testing efforts. On **2026-07-31** (session `3cad18a5`, 00:48, and `a2ff7b35`, 21:19 /
22:05) the developer wrote structured, phased briefs for Vitest and Playwright work,
each explicitly gating implementation on review:

> "Approach — please work systematically rather than generating tests all at once:
> _Phase 0 — Audit (no code yet)_ ... _Phase 1 — Unit tests only_... Once I confirm
> the plan, implement unit tests incrementally, one component/hook at a time, so I
> can review each before moving to the next."

On **2026-08-01** (session `b86a95ac`, 00:45) Claude was also used directly for design
documentation — generating a Mermaid ERD and user-flow diagrams for the backend schema
(User/Role/Activity/Attendance/Badge/UserBadge) and member/admin flows, explicitly
"so I can copy the output directly into specs/architecture.md."

The developer also repeatedly used Claude to self-check progress against the actual
assessment brief — e.g. **2026-07-29** (`7c541048`, 17:52): _"Am I satisfying the
frontend and backend requirements? Is there anything I'm missing?"_, and similar
checks on 2026-07-31 and 2026-08-01 (session `78855d84`) — a genuine planning/gap-
analysis use of AI, not just code generation.

## Feature implementation

The bulk of the logged prompts are feature-implementation requests across both
frontend and backend, closely tracking the day-by-day commit history:

- **2026-07-27–28**: activity routing, the create/edit event form, an attendee
  dialog with hosting/going status badges, and the activity details page (venue
  map, price sidebar, filtering) — e.g. (`52509085`, 21:49) _"is there a way that I
  can responsively show the attendees names after the word 'Joined by' where the
  first two names are shown but if the attendees show more than that it will be +1
  other..."_
- **2026-07-29**: ASP.NET Core Identity was wired up end to end — registration,
  cookie-based login/logout, protected routes — driven by prompts like (`efd368b0`,
  21:28–21:45) a rapid sequence of small, concrete UI-behaviour requests ("redirect
  to /activities on login", "redirect to home on logout", "hide the create event
  button if the user isn't logged in").
- **2026-07-30**: the profile page, Zustand stores, and the full join/cancel
  attendance feature with milestone badges. Session `f65623cc` (21:31) is a good
  example of a developer front-loading investigation before implementation: _"Before
  writing code, tell me: 1. Does ActivityAttendance already have a UserId field, or
  does it need to be added? Check the current model..."_ followed by a six-point
  implementation spec (attendance model, new `/api/profile/{id}` endpoint, shared
  attendee-list component, auth policy, participation filtering).
- **2026-08-01**: CI workflow refactor and README/documentation generation, e.g.
  (`ad49abfc`, 00:14–00:38) a short back-and-forth turning a generic README into one
  scoped to the actual repo layout, then adding a screenshots section.

## Debugging and fixing

A large share of prompts are real bug reports and error pastes, not feature requests
— genuine evidence of AI-assisted debugging rather than one-shot generation:

- CORS: **2026-07-28** (`784add54`, 02:23 and 19:43) — pasted browser console errors
  ("Access to XMLHttpRequest at 'http://localhost:5000/api/activities'... has been
  blocked by CORS policy") reported twice, once per branch, showing genuine
  iterative troubleshooting rather than a single fix.
- Slow dev loop: same session, 20:25 — _"It takes 20 minutes for the activity to
  load. Why is that and how do I make it faster?"_ with pasted backend terminal logs.
- Auth cookie bug: **2026-07-29** (`738bd6e3`, 19:56) — _"why is it that the cookie
  is not showing when I submit the email and password? They are both correct based
  on the seed user information"_.
- Git/branching problems while a testing branch was mid-flight: **2026-07-29**
  (`b836c833`, 16:38) — a real, messy branch-management problem described in detail
  rather than a clean request.
- A cluster of profile bugs reported as formal bug reports on **2026-07-30/31**
  (`f65623cc`, `6aa0cd4e`, `361d4680`) each following a "Bug: ... / Expected
  behaviour: ..." structure, e.g. _"Bug: Attendees list doesn't update immediately
  after joining an event... It only shows the updated list after I navigate away
  (e.g. to the events tab) and back into the event details."_ and _"Bug: Profile
  picture fails to load (broken image icon)..."_.
- CI failures: **2026-07-31** (`01477e4c`, 23:29) — a pasted Playwright CI failure
  log (_"Test timeout of 30000ms exceeded... Error: locator..."_) used to debug the
  auth setup step in the pipeline.

## Testing

Testing was treated as its own deliberate workstream, not an afterthought:

- **Backend**: `b836c833` (2026-07-29, 02:31 onward) — introducing an xUnit test
  project, then iterating on its organisation (_"I want my backend tests inside the
  backend instead of it being in the same level as the backend and frontend
  folders"_), gitignore hygiene for generated test artefacts, and a documentation
  convention (_"Follow the AAA (Arrange-Act-Assert) Format... and XML Documentation
  (For Method & Class Summaries)"_).
- **Frontend unit tests**: `3cad18a5` and `a2ff7b35` (2026-07-31) — a phased
  Vitest + React Testing Library rollout, audited first, implemented incrementally,
  matching the commits `18b2421`, `70852c5`, `c5bf9b3`, `ef4fb54` that same day.
- **E2E**: `a2ff7b35` (2026-07-31, 22:05) — a detailed Playwright brief specifying
  a real backend + seeded test database (not mocked routes), storageState auth
  reuse, and explicit flagging of flakiness risk around real-time features —
  matching commit `bdaf417` ("test: add Playwright suite against real backend with
  seeded auth").

## CI/CD and documentation

- Backend CI was requested and iterated alongside the backend test project itself
  (`b836c833`, 2026-07-29): _"I have new code for my backend, but I want to have a
  backend-ci.yml file integrated in my repo before pushing the code to my main
  branch."_
- Frontend CI was extended once both unit and E2E suites existed: `f6209f2e`
  (2026-07-31, 23:50/23:54) — _"I want my CI pipeline to run my frontend unit tests
  as well... I actually have unit tests for both frontend and backend. But only the
  frontend has E2E tests with playwright. Can you update my CI pipelines?"_ — which
  matches the 2026-08-01 commit `124e71d` ("refactor: split reusable workflow into
  unit-test and e2e-test steps").
- CD (deployment to Azure) was built on **2026-08-02**, in two phases visible in the
  logs. Early morning (`2f6b54b7`, 00:05–02:51) was a manual first deploy —
  _"what do I do to publish and deploy my app to azure then?"_ — debugged live
  against the deployed app (Azure device-code login, missing env vars, 500 errors on
  creating/joining events, a broken profile image) before committing, matching
  commits `5d87cbd`/`9759a0b` ("fix: resolve Azure deployment issues for backend,
  static files, and SQL Server"). That evening (`271fa6e7`, 20:16) the actual GitHub
  Actions CD automation was requested from scratch — _"can you help me create a cd
  pipeline?"_ — then iterated through a failed first run ("My cd pipeline failed.
  Here's the errors:", 21:16), fixed by rotating the `AZURE_WEBAPP_PUBLISH_PROFILE`
  GitHub secret; a stale-cache favicon/CSS 404 chased across two sessions
  (`613eb48e`, 21:02–22:03); and a real merge conflict in `frontend/index.html`
  merging `feature/12-cd-pipeline` into `main` (`613eb48e`, 22:07) — matching commits
  `7afd53e` ("chore: add Azure deployment pipeline for frontend and backend"),
  `d0c1247`/`f9bad14` (favicon/stylesheet path fixes), and `c587ab5` ("fix: set
  VITE_API_URL at build time in CD workflow").
- Documentation: the README was iteratively refined against the assessment brief
  itself on 2026-08-01 (`ad49abfc`) — asked to reflect the real folder structure,
  explain nested folders in plain terms, and add a screenshots section covering
  responsiveness — and architecture diagrams (ERD + user flowcharts) were generated
  the same day (`b86a95ac`) for `specs/architecture.md`.
- Semantic commit messages were repeatedly asked for after implementation work
  (e.g. `52509085` 2026-07-27 22:49, `57f7ef91` 2026-07-30 20:13, `01477e4c`
  2026-07-31 23:59), showing AI assistance extended into the git workflow itself,
  not just code.

## Critical evaluation, not blind acceptance: scoping down the original concept

The assessment brief asks students to "critically evaluate AI-generated outputs," not
just use them. The clearest evidence of that here predates local session logging: the
browser-based planning phase (`specs/browser-sessions/`, 2026-06-23–2026-07-21) shows
Claude proposing an ambitious first design — XP, Levels, Streaks, a
`Tournament`/`Registration`/`Bout`/`TrainingLog`/`Announcement` schema, and client-side state management as a planned advanced requirement.

That design was deliberately cut down during implementation to the simpler system that
actually shipped — `ClubActivity` + `ActivityAttendance` + hardcoded milestone badges
(`AttendanceBadges.cs`), with Zustand, theme switching, and Playwright e2e as the three
marked advanced requirements instead of WebSockets. This isn't just a claim: git history
confirms it — on **2026-07-03**, the same day `ClubActivity` was added, an earlier
`ScoreEntry` model was explicitly deleted (`chore: deleted ScoreEntry model`). See
`specs/browser-sessions/README.md` for the full comparison.

## Honest caveats

- Local Claude Code logging only covers 2026-07-27 onward; earlier architectural
  decisions (initial routing, Shadcn UI adoption, the first EF Core model, and the
  scope pivot above) predate local logging and were worked out in the separate
  claude.ai browser Project (see `specs/browser-sessions/`).
- A meaningful fraction of prompts are short follow-ups ("yes", "go for it", "push
  feature/11-ci-pipeline") — kept verbatim in `specs/sessions/` for completeness,
  since they're still genuine steps in an iterative, human-directed conversation,
  even if individually unremarkable.
