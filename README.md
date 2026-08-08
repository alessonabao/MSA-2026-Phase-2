# EnGarde

EnGarde is a web platform designed for a student and beginner-friendly fencing club in Auckland. The club currently relies on Instagram and Instagram Messages to manage events, training sessions, and announcements, which creates several problems:
* Beginners struggle to keep up with club activities and find basic sport knowledge (scoring, rules) hard to access
* Members miss events due to buried messages

EnGarde addresses these pain points by providing a dedicated platform for event discovery, club communications, and member engagement.

For more information, visit the wiki of this repo: https://github.com/alessonabao/MSA-2026-Phase-2/wiki

## Live Deployment

- App: https://engarde-webapp-d3htcphje5eqh3d8.newzealandnorth-01.azurewebsites.net/
- API Docs: https://engarde-webapp-d3htcphje5eqh3d8.newzealandnorth-01.azurewebsites.net/scalar/

## Running Locally

### Prerequisites

Download and install these before you start:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v20+) and npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (used to run the SQL Server database via `docker-compose.yml`)
- Git

### 1. Start the database

The database runs in a SQL Server container defined by [`docker-compose.yml`](docker-compose.yml) at the repo root:

```bash
docker compose up -d
```

This starts SQL Server on `localhost:1433`. The default connection string in [`software/demo/backend/appsettings.json`](software/demo/backend/appsettings.json) already matches these container credentials, so no extra configuration is needed.

### 2. Run the backend

```bash
cd software/demo/backend
dotnet restore
dotnet run
```

The API starts at `http://localhost:5000`. On startup it automatically applies EF Core migrations and seeds the database (including the test accounts below), so no manual `dotnet ef database update` step is required. API docs are available at `http://localhost:5000/scalar`.

### 3. Run the frontend

```bash
cd software/demo/frontend
npm install
npm run dev
```

The app starts at `http://localhost:5173` and is configured (via `.env.development`) to call the backend at `http://localhost:5000/api`.

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

- **One platform instead of three separate tools**: most club software solves this problem in pieces: a booking app for events, a wiki for rules, a leaderboard app for engagement. EnGarde replaces the Instagram-posts-and-DMs workflow described above with a single flow: a beginner reads the Resources page (weapon breakdowns, footwork videos, equipment guide), RSVPs to their first event from the same app, and sees that event turn into a badge on their profile. No switching between a chat app, a calendar, and a separate wiki.
- **Participation-first gamification, not skill-first**: the original design (see `specs/browser-sessions/`) considered the "obvious" gamification for a competitive sport including XP for winning bouts, tournament leaderboards, and skill-based rankings. That was deliberately removed because ranking members by wins would intimidate exactly the beginners EnGarde is built for. Badges instead reward showing up (`AttendanceBadges.cs`) to your first club event, then your fifth so a brand-new member and a club veteran are both visibly making progress from day one, not just the members who are already good at fencing.
- **Attendance data is real, not a placeholder**: RSVPing to or cancelling an event immediately updates attendee lists, attendance history, and badge eligibility end-to-end. There's no mock data standing in for what is meant to be the app's core loop.
- **Admin actions are actually protected, not just hidden in the UI**: `ClubAdmin` and `Member` roles are enforced server-side (`[Authorize(Roles = ...)]`), so event management is a real permission boundary rather than a button that happens to be hidden from members.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Backend** | C# / .NET 10 &middot; ASP.NET Core Web API &middot; EF Core + SQL Server &middot; ASP.NET Core Identity &middot; AutoMapper &middot; MediatR &middot; Scalar API docs &middot; xUnit |
| **Frontend** | React 19 + TypeScript &middot; Vite &middot; React Router &middot; TanStack Query &middot; Zustand &middot; Tailwind CSS + shadcn/ui &middot; React Hook Form + Zod &middot; Vitest + Testing Library &middot; Playwright |
| **CI** | GitHub Actions &middot; unit tests (frontend + backend) + e2e tests on every push (`.github/workflows/`) |
| **CD** | GitHub Actions &middot; Azure App Service on every push to `main`, gated on Backend CI + Frontend CI passing (`.github/workflows/cd.yml`) |
| **Local Dev** | Docker Desktop + Docker Compose &middot; runs SQL Server locally (`docker-compose.yml`), matching production |

> The CD pipeline builds the frontend straight into the backend's `wwwroot`, then publishes both as a single Azure Web App.

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
- [x] **End-to-end testing with Playwright**
  A Playwright suite (`frontend/tests/`) runs against the real backend with seeded auth, covering login/registration, browsing and RSVPing to activities, admin activity management, and profile editing. Used with permission from Frank in place of the brief's suggested Cypress. Playwright was chosen because it's built TypeScript-first (no separate type-definition setup), runs tests across browser engines in parallel by default rather than as an add-on, and its auto-waiting model reduces the flaky, manually-timed waits that Cypress tests are prone to.

### Also implemented (not submitted for marking)

- **Security Measures — RBAC and password hashing**
  - *RBAC*: `Member` and `ClubAdmin` roles (`Roles.cs`) are enforced with `[Authorize(Roles = ...)]` on activity endpoints (`ActivitiesController.cs`), so only club executives can create, edit, or delete events, while members are limited to browsing and RSVPing. This matters because the API is the only thing standing between a member account and destructive admin actions — without server-side role checks, hiding an "Edit" button in the UI is not real access control.
  - *Password hashing*: user passwords are never stored or compared in plaintext — ASP.NET Core Identity's `UserManager<User>` hashes them (PBKDF2 with a per-user salt) before persisting, via `AddIdentityApiEndpoints<User>()` in `Program.cs`. This matters because the database (or a backup of it) is a realistic leak vector, and hashed, salted passwords keep a leak from directly exposing user credentials.

## Self-Reflection

If I were to do this project again, I would focus on setting up the frontend and backend testing structure earlier in the development process. Many of the tests were written after the main features had already been implemented, which meant some bugs were discovered later than they could have been. Adding tests earlier would have helped identify issues sooner, made refactoring safer, and improved the overall quality and maintainability of the project.

## Future Work

The following ideas came up during planning and development but were left out as too out of scope for the assessment timeline and requirements:

- **Digital membership card**: a scannable card issued on joining, for quick entry at the training venue.
- **Event discussion threads**: a comment section under each event for members to ask quick questions.
- **Beginner rules quiz**: a short test on core rules and terminology after working through the Resources section.
- **New event email notifications**: notify members by email when a new event is posted.
- **Event reminder emails**: remind members by email a day before an event they've RSVP'd to.

## AI Usage

See the `/specs` folder for AI prompts, agent instructions, and planning artifacts used during development, and the submission video for a walkthrough of how AI was used.
