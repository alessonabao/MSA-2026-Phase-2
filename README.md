# EnGarde

EnGarde is a web platform designed for a student and beginner-friendly fencing club in Auckland. The club currently relies on Instagram and Instagram Messages to manage events, training sessions, and announcements, which creates several problems:
* Beginners struggle to keep up with club activities and find basic sport knowledge (scoring, rules) hard to access
* Members miss events due to buried messages
* Club executives find it difficult to track attendance

EnGarde addresses these pain points by providing a dedicated platform for event discovery, club communications, and member engagement.

For more information, visit the wiki of this repo: https://github.com/alessonabao/MSA-2026-Phase-2/wiki

## Live Deployment

- Frontend: _TODO — add deployment URL_
- Backend / API: _TODO — add deployment URL_

## Test Credentials

These accounts are seeded automatically on backend startup (`DbSeedData.cs`) so markers can log in without registering:

| Role | Email | Password |
| --- | --- | --- |
| Member | `alesson@test.com` | `EnGarde!2` |
| Club Admin | `fencingclub@test.com` | `EnGarde!2` |

The Member account can browse events, RSVP, and earn badges. The Club Admin account can additionally create, edit, and delete events.

## Screenshots

> _TODO — capture each shot below (desktop **and** mobile width, to demonstrate the responsive UI requirement) and save under `software/demo/docs/screenshots/` using the suggested filenames. Embed each with:_
> `![Alt text](software/demo/docs/screenshots/filename.png)`

### Home / Landing Page
- [ ] Desktop — `home-desktop.png`
- [ ] Mobile — `home-mobile.png`

### Activities Dashboard (browse + filters)
- [ ] Desktop — `dashboard-desktop.png`
- [ ] Mobile — `dashboard-mobile.png`

### Activity Details (RSVP / join / cancel)
- [ ] Desktop — `activity-details-desktop.png`
- [ ] Mobile — `activity-details-mobile.png`

### Login / Register
- [ ] Desktop — `auth-desktop.png`
- [ ] Mobile — `auth-mobile.png`

### Member Profile (badges + event history)
- [ ] Desktop — `profile-desktop.png`
- [ ] Mobile — `profile-mobile.png`

### Admin: Create/Edit Activity Form
*(log in as the Club Admin test account above)*
- [ ] Desktop — `activity-form-desktop.png`
- [ ] Mobile — `activity-form-mobile.png`

### Mobile Navigation Menu (open state)
- [ ] Mobile — `nav-mobile-open.png`

### Light vs. Dark Mode
- [ ] Same page, side by side — `theme-light-dark.png`

## How EnGarde Relates to the Theme (Gamification)

This year's theme is **Gamification**. EnGarde applies this directly to the club-attendance problem above:

- **Milestone badges**: joining or cancelling club events awards tiered badges (e.g. *First Touch* for a first event joined, *Regular Fencer* at 5 events, *Club Veteran* at 10) via `AttendanceBadges.cs`, giving beginners a visible sense of progress instead of a silent RSVP.
- **Progress tracking**: a member's profile shows their event history and earned badges, turning attendance into a track record rather than a message buried in a chat thread.
- **"New badge" feedback loop**: a dedicated Zustand store (`useGamificationStore`) tracks which earned badges a member has not viewed yet, displaying an indicator in the navigation bar until they open their profile. This helps complete the gamification feedback loop by connecting user actions, rewards, and notifications across the app.

## What Makes EnGarde Unique

- **Real attendance data, not mock RSVPs**: joining/cancelling an event immediately updates attendee lists, attendance history, and badge eligibility end-to-end (frontend hooks → API → EF Core → SQLite).
- **Role-based club administration**: `ClubAdmin` and `Member` roles are enforced in the backend (`[Authorize(Roles = ...)]`), so only club executives can create, edit, or delete events, while any authenticated member can browse events, RSVP, and view other members' public profiles.
- **Badge-driven engagement designed for beginners**: badges are intentionally centred on participation, rewarding members for attending events, joining activities, and trying new experiences rather than for skill or competition outcomes. This aligns with the club’s goal of encouraging newcomers and fostering an inclusive environment where progress is not determined by fencing ability.

## Tech Stack

**Backend**: C# / .NET 10, ASP.NET Core Web API, EF Core + SQLite, ASP.NET Core Identity, AutoMapper, MediatR, Scalar API documentation, xUnit.

**Frontend**: React 19 + TypeScript, Vite, React Router, TanStack Query, Zustand, Tailwind CSS + shadcn/ui, React Hook Form + Zod, Vitest + Testing Library, Playwright.

**CI**: GitHub Actions running unit tests (frontend + backend) and end-to-end tests on every push (`.github/workflows/`).

## Project Structure

```
software/demo/
├── backend/                # ASP.NET Core Web API
│   ├── Activities/         # Club events feature: create/edit/join/cancel events, award gamification badges
│   │   ├── Commands/       # Write actions (create, edit, delete, join, cancel an event)
│   │   └── Queries/        # Read actions (list events, event details, attendees, attendance history)
│   ├── backend.Tests/      # xUnit test project, mirrors the folders below so each feature has matching tests
│   │   └── Testing/        # Shared test helpers 
│   ├── Controllers/        # API endpoints exposed to the frontend (auth, events, profiles)
│   ├── Core/                # Shared object-mapping configuration (DB entities <-> API responses)
│   ├── Data/                 # Database connection setup and initial seed data
│   ├── Migrations/            # History of database schema changes (auto-generated by EF Core)
│   ├── Models/                 # Database entities (users, roles, events, attendance, badges)
│   ├── Profiles/                # Member profile feature: view/update profile info and pictures
│   │   ├── Commands/             # Write actions (update profile, update profile picture)
│   │   └── Queries/               # Read actions (get profile)
│   ├── Properties/                 # Local run/launch configuration
│   ├── Users/                       # User registration logic
│   └── wwwroot/                      # Empty placeholder folder the .NET Web SDK requires to exist
│
├── frontend/                # React + TypeScript app
│   ├── public/               # Static assets served as-is
│   │   └── images/            # Icons, illustrations, and photos used in the UI
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout/         # Overall page frame (nav bar, footer, app wrapper)
│   │   │   └── router/         # Page routes and access control (must be logged in / must be admin)
│   │   ├── components/
│   │   │   └── ui/              # Small reusable building-block UI elements (buttons, dialogs, etc.)
│   │   ├── features/            # One folder per app section/page
│   │   │   ├── account/          # Login and registration
│   │   │   ├── activities/       # Browsing, viewing, joining, and (for admins) managing club events
│   │   │   │   ├── dashboard/     # Event list/browse view
│   │   │   │   ├── details/       # Single event page
│   │   │   │   └── form/          # Admin-only create/edit event form
│   │   │   ├── home/              # Landing page
│   │   │   ├── profile/           # Member profile page, badges, and event history
│   │   │   └── resources/         # Beginner-friendly fencing resources page
│   │   ├── lib/                   # App-wide logic not tied to a single page
│   │   │   ├── api/                # Shared HTTP client setup
│   │   │   ├── hooks/               # Reusable data-fetching logic
│   │   │   ├── schemas/             # Form input validation rules
│   │   │   ├── stores/              # Shared app state (filters, UI state, seen badges)
│   │   │   └── types/               # Shared TypeScript type definitions
│   │   └── test/                    # One-time test environment setup
│   └── tests/                        # End-to-end tests (Playwright)
│
└── uploads/
    └── profile-pictures/    # Member-uploaded avatar images, served back to the frontend
```

## Advanced Requirements Checklist

Per the assessment brief, only the top 3 advanced features listed here will be marked.

- [x] **State management library — Zustand**
  Used for client-side state that doesn't belong in server cache: activity filters (`useActivityFilterStore`), mobile nav UI state (`useUIStore`), and cross-page "unseen badge" tracking (`useGamificationStore`, persisted to `localStorage`).
- [x] **Theme switching (light/dark mode)**
  Implemented with `next-themes` and a `ThemeProvider`/mode-toggle component, switchable from the nav bar and persisted across sessions.
- [x] **End-to-end testing — Playwright**
  A Playwright suite (`frontend/tests/`) runs against the real backend with seeded auth, covering login/registration, browsing and RSVPing to activities, admin activity management, and profile editing. We used Playwright instead of Cypress for native TypeScript support and built-in parallelisation; coverage is equivalent end-to-end testing against the real API rather than mocks.

## Self-Reflection

If I were to do this project again, I would focus on setting up the frontend and backend testing structure earlier in the development process. Many of the tests were written after the main features had already been implemented, which meant some bugs were discovered later than they could have been. Adding tests earlier would have helped identify issues sooner, made refactoring safer, and improved the overall quality and maintainability of the project.

## AI Usage

See the `/specs` folder for AI prompts, agent instructions, and planning artifacts used during development, and the submission video for a walkthrough of how AI was used.
