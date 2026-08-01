# EnGarde

EnGarde is a web platform designed for a student and beginner-friendly fencing club in Auckland. The club currently relies on Instagram and Instagram Messages to manage events, training sessions, and announcements, which creates several problems:
* Beginners struggle to keep up with club activities and find basic sport knowledge (scoring, rules) hard to access
* Members miss events due to buried messages
* Club executives find it difficult to track attendance

EnGarde addresses these pain points by providing a dedicated platform for event discovery, club communications, and member engagement.

For more information, visit the wiki of this repo: https://github.com/alessonabao/MSA-2026-Phase-2/wiki

## Live Deployment

- App: https://engarde-webapp-d3htcphje5eqh3d8.newzealandnorth-01.azurewebsites.net/
- API Docs: https://engarde-webapp-d3htcphje5eqh3d8.newzealandnorth-01.azurewebsites.net/scalar/

## Test Credentials

These accounts are seeded automatically on backend startup (`DbSeedData.cs`) so markers can log in without registering:

| Role | Email | Password |
| --- | --- | --- |
| Member | `alesson@test.com` | `EnGarde!2` |
| Club Admin | `fencingclub@test.com` | `EnGarde!2` |

The Member account can browse events, RSVP, and earn badges. The Club Admin account can additionally create, edit, and delete events.

## Screenshots
### Home / Landing Page
<img width="2560" height="4154" alt="image" src="https://github.com/user-attachments/assets/0d12fde3-6051-49ca-b3a4-1718ad850558" />

### Activities Dashboard (browse + filters)
<img width="2560" height="2586" alt="image" src="https://github.com/user-attachments/assets/8a0d5b0b-85cd-4af5-a1c3-912dda6c2652" />

### Activity Details
<img width="2560" height="2274" alt="image" src="https://github.com/user-attachments/assets/ceb8341c-f6ab-4503-8f92-47fbd9553b3c" />

### Login
<img width="2560" height="1964" alt="image" src="https://github.com/user-attachments/assets/b7f15c10-7a37-4385-b5e2-d2bc891660f5" />

### Register
<img width="2560" height="2146" alt="image" src="https://github.com/user-attachments/assets/2ae61d53-8b18-4560-9c90-8afb5155c0d4" />

### Member Profile (badges + event history)
<img width="2560" height="2564" alt="image" src="https://github.com/user-attachments/assets/3733769d-c3d9-4806-9bd2-0270d4fe4058" />

### Member Update Profile
<img width="2560" height="2564" alt="image" src="https://github.com/user-attachments/assets/f5485f72-9ca4-46d1-ace9-9f086b4e03a0" />

### Admin: Dashboard
<img width="2560" height="2567" alt="image" src="https://github.com/user-attachments/assets/f8bfc92d-6735-4330-9b5f-ad2a4cb33f55" />

### Admin: Create
<img width="2560" height="3186" alt="image" src="https://github.com/user-attachments/assets/afcb0d3e-4473-4aa5-8327-b2f0cf4e6bff" />

### Admin: Delete
<img width="2556" height="1082" alt="image" src="https://github.com/user-attachments/assets/ec98c650-f9d4-4567-9c22-42645604d2a9" />

### Mobile Navigation Menu (open state)
<img width="340" height="640" alt="image" src="https://github.com/user-attachments/assets/9ef7b357-6b9e-425c-89ee-3990a5851344" /> <img width="340" height="640" alt="image" src="https://github.com/user-attachments/assets/b997b14a-32d9-481f-aaeb-4669b9fda5d8" />

### Light vs. Dark Mode
<img width="2560" height="2488" alt="image" src="https://github.com/user-attachments/assets/4456785b-2a71-4611-a95a-03ef9761465e" />
<img width="2560" height="2485" alt="image" src="https://github.com/user-attachments/assets/5dd1db07-1d1f-405d-875a-e70d003a68e1" />



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
