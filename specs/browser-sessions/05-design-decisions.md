# Design Decisions

AI tool used: Claude (claude.ai)

---

## Why EnGarde uses a fencing club domain

The project uses a fencing club domain because it provides a meaningful context where event management, learning resources, and gamification features naturally fit together.

The domain was chosen because:

1. Fencing already has a natural ranking and scoring culture — XP, leaderboards, achievement badges, and progression tiers align with how fencers already track improvement, making gamification feel authentic rather than artificially added.
2. The domain is personal and based on a real user experience — As a member of the Auckland University Fencing Club, Alesson experienced the challenges beginner fencers face when learning rules, understanding scoring systems, and finding relevant resources. This helped guide genuine design decisions based on actual user needs.
3. The competition format naturally supports progression mechanics — Fencing structures such as training sessions, competitions, pools, and direct elimination provide opportunities to introduce achievements, milestones, and participation tracking without creating unnecessary game mechanics.

---

## Why cookie-based auth over JWT

ASP.NET Core Identity's cookie authentication was chosen over JWT tokens because:

- The frontend and backend are served from the same origin in both dev and production, so cross-origin cookie restrictions do not apply
- Cookies are automatically included in requests by the browser — no manual `Authorization` header management in `agent.ts`
- The `HttpOnly` cookie flag prevents JavaScript from reading the auth token, which is a security advantage over localStorage-stored JWTs

---

## Why CQRS with MediatR

CQRS with MediatR was chosen because it provides a clean separation between application logic and API controllers, making the codebase easier to maintain and extend.

The pattern was adopted because:

- Each handler (`CreateActivity`, `DeleteActivity`, etc.) is independently testable without a controller
- Adding new features does not require modifying existing handlers — just adding new ones
- The `BaseApiController` pattern keeps controllers thin and consistent across the app

---

## Why TimeOnly and DateOnly for time fields

`ClubActivity` uses `DateOnly` for the date and `TimeOnly` for `StartTime`/`EndTime` rather than embedding everything in a single `DateTime`. This is because:

- A fencing session's time is just a clock time — it has no meaningful timezone component
- `TimeOnly` prevents the confusion of a `DateTime` where the date part of `StartTime` is meaningless
- Both types are supported by EF Core and serialise cleanly to `"HH:mm:ss"` strings over the API, which map directly to `<input type="time">` on the frontend

---

## Why shadcn/ui over MUI or Mantine

shadcn/ui was chosen as the component library because:

- Components are copied into the project rather than imported as a black box — full customisability
- Built on Radix UI primitives, which are accessible by default
- Tailwind-based styling integrates with the existing Tailwind setup without a separate CSS-in-JS runtime
- Dark/light mode support is built in via CSS variables, satisfying the theme switching advanced requirement with minimal extra work

---

## NavBar grid layout decision

The NavBar uses `grid grid-cols-3` rather than `flex` with `position: absolute` for centring the navigation links. The absolute approach was tried first but caused the ModeToggle and Login button to stack incorrectly on the left side. The three-column grid gives each section — logo, nav, actions — exactly one third of the header width, guaranteeing the nav is mathematically centred regardless of how wide the logo or action areas are.

---

## ERD design: no standalone Badge master table

Badge definitions (code, title, description, threshold) are hardcoded in `ActivityBadgeCodes.cs` rather than stored in a database `Badge` table. This decision was made because:

- Badge tiers are fixed business rules, not user-configurable data
- Hardcoding avoids a join on every attendance check
- `UserBadge` denormalises the code/title/description at award time, so the record is self-contained and readable without a FK lookup

---

## Attendance status as boolean not enum

`ActivityAttendance.IsCancelled` uses a `bool` rather than an enum (`Pending`, `Confirmed`, `Cancelled`). For this application a member either has an active RSVP or a cancelled one — there is no intermediate pending state. Using a boolean keeps the model simple. Rejoining after cancelling flips `IsCancelled` back to `false` rather than inserting a new row, enforced by a unique index on `(ActivityId, UserId)`.

---

## Resources page: dark editorial design

The Resources page uses a hardcoded dark background (`bg-[#0a0a0a]`) independent of the app's light/dark toggle. This was a deliberate design choice — the fencing resources content has an editorial, authoritative feel that suits a consistently dark canvas. The decision was documented in the README noting it as a justified design-only exception, with the rest of the app fully respecting the theme toggle.
