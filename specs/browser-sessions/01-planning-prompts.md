# Planning Prompts

AI tool used: Claude (claude.ai)

---

## Project concept and direction

**Prompt:**

> I recently joined my university fencing club as a beginner and realised I kept struggling to find beginner-friendly resources about the rules, scoring system, and equipment. I also noticed that club events and training sessions were shared across different chat groups, making it easy for new members to miss information. I’m thinking of building a web app that combines fencing event management with a dedicated resources section for beginner fencers. Would this be a strong direction for the MSA Phase 2 project?

**AI response summary:**
Claude confirmed that this was a strong and authentic project direction because it originated from a real problem experienced as a beginner fencer. The proposed app would allow club members to browse upcoming training sessions, competitions, and social events, while also providing a beginner-focused resources hub containing explanations of fencing rules, the point system, weapon types, equipment guidance, and other introductory material. Claude noted that the idea demonstrates clear user empathy, a specific target audience, and an identifiable real-world need, making it a compelling full-stack project for MSA Phase 2.

---

## Choosing advanced requirements

**Prompt:**

> I want to identify advanced requirements that would strengthen my project and make it more engaging for users. The application is a fencing club platform focused on helping beginner fencers discover resources, participate in events, and engage with the club community. Can you help me brainstorm advanced features that fit the project direction?

**AI response summary:**
Claude recommended several advanced requirements that aligned with the project's architecture and user goals:

1. Dark/light mode (theme switching) — easy win with shadcn's ThemeProvider
2. Security Measures — RBAC (Member/ClubAdmin roles) and password hashing via ASP.NET Identity
3. Client-side state management — Introduce a state management library such as Zustand to manage shared application state, including user authentication state, profile information, event participation status, and other data accessed across multiple components.

---

## Gamification justification

**Prompt:**

> How does En Garde relate to the theme of gamification?

**AI response summary:**
Claude framed the connection: fencing already has a natural scoring culture. EnGarde formalises this into a gamification system — XP awarded for winning bouts, logging training, and entering tournaments; badges for milestones; streaks for consistent training; and a leaderboard for club-wide rankings. The HCI angle addresses real motivation problems in sports clubs (attendance drops, beginners feeling disconnected). One-sentence pitch: "EnGarde applies gamification to a fencing club management platform, turning everyday club activities into a progression system with XP, levels, badges, streaks, and leaderboards — keeping members engaged year-round, not just on competition day."

---

## Data model planning

**Prompt:**

> Start with the data model as C# entity classes.

**AI response summary:**
Claude designed the full entity model: `User` (extends IdentityUser with XP, Level, Streak, LastActiveDate), `Tournament`, `Registration`, `Bout`, `TrainingLog`, `Badge`, `UserBadge`, `Announcement`. Key decisions: XP/Level/Streak live directly on `User` for simpler leaderboard queries; `Registration` has a composite unique index on `(UserId, TournamentId)` to prevent double-registrations; `Bout` uses three separate FK relationships to `User` with `DeleteBehavior.Restrict` to avoid EF Core cascade cycle errors.

---

## XP and badge system design

**Prompt:**

> Create a core gamification logic service that handles XP awards, streak tracking, level calculation, and badge unlocking.

**AI response summary:**
Claude created `XPService.cs` with centralised XP values (50 XP per bout win, 10 per loss, 20 per tournament entry, 15 per training hour), level formula (`Level = XP / 200 + 1`), streak logic (resets if gap > 1 day, bonus XP at 7-day milestones), and badge condition checking against `BadgeCondition` enum (XPThreshold, BoutsWon, TournamentsEntered, StreakDays, TrainingHours). Six seed badges were defined with realistic thresholds.
