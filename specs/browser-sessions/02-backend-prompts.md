# Backend Development Prompts

AI tool used: Claude (claude.ai)

---

## EF Core and AppDbContext

**Prompt:**

> Create the AppDbContext with all entity configurations.

**AI response summary:**
Claude generated `AppDbContext` extending `IdentityDbContext<User>`. Key configurations: enums stored as strings via `HasConversion<string>()` for readable database values; composite unique indexes on `Registration(UserId, TournamentId)` and `UserBadge(UserId, BadgeId)`; three separate FK relationships on `Bout` all using `DeleteBehavior.Restrict` to prevent cascade cycle errors on PostgreSQL/SQLite; six default badge seed records hardcoded via `HasData()`.

---

## Seed data

**Prompt:**

> Can you create seeding data for my model? Have at least 10 events with weapon rotation between Foil, Épée, and Sabre, skill level rotation between Beginner/Intermediate/Advanced, type rotation between Competition/Training/Social, price free for Training and Social, and venues mostly in Auckland or New Zealand.

**AI response summary:**
Claude created `Seed.cs` with 12 `ClubActivity` records using relative date offsets (`DateTime.Now.AddMonths(-2)`) so data always stays relevant regardless of when the app is run. Venues include Auckland CBD, Kohimarama, Howick, Wellington, Christchurch, and Hamilton with real coordinates. Free events for all Training and Social types; paid events ($15–$40) for Competitions only.

---

## CQRS handlers with MediatR

**Prompt:**

> Create top comments for all my CQRS handler files explaining what each does, usage examples, and connected files.

**AI response summary:**
Claude documented `CreateActivity.cs`, `DeleteActivity.cs`, `EditActivity.cs`, `GetActivityDetails.cs`, `GetActivityList.cs`, `ActivitiesController.cs`, `BaseApiController.cs`, and `MappingProfiles.cs`. Each comment block includes: what the file does, a concrete usage example with code, and a connected files section explaining why each dependency exists (not just listing names). Key insight documented: `MappingProfiles.cs` enables the self-map `ClubActivity → ClubActivity` used by `EditActivity` for partial updates without manually assigning each field.

---

## Scalar API documentation

**Prompt:**

> What does "Expose Scalar API documentation UI instead of Swagger UI" mean?

**AI response summary:**
Claude explained that Scalar is a modern alternative to the default Swagger UI. Setup in .NET 10 requires one NuGet package (`Scalar.AspNetCore`) and two lines in `Program.cs`: `app.MapOpenApi()` and `app.MapScalarApiReference()`. The UI is served at `/scalar/v1` and auto-documents all controllers. This satisfies the MSA basic requirement in approximately 20 minutes of work.

---

## Postman testing setup

**Prompt:**

> What if I add this pre-request script in Postman for dynamic dates? I need startTime and endTime to always be between 6PM–9PM.

**AI response summary:**
Claude provided a Postman pre-request script using moment.js to generate dynamic dates and time-bounded random times:

```javascript
var moment = require("moment");
pm.environment.set(
  "activityDate",
  moment().add(100, "days").startOf("day").toISOString(true),
);
function randomTime(startHour, endHour) {
  var hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  var minutes = Math.random() < 0.5 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minutes}:00`;
}
pm.environment.set("startTime", randomTime(18, 20));
pm.environment.set("endTime", randomTime(20, 21));
```

Ranges are split so endTime is always after startTime within the 6–9pm window.

---

## Authentication and RBAC

**Prompt:**

> feat(auth): add login form with cookie-based authentication and protected events access

**AI response summary:**
Claude guided implementation of ASP.NET Core Identity with cookie-based auth, two roles (`Member`, `ClubAdmin`), `RequireAuth` and `RequireRole` route guards on the frontend, and `[Authorize(Roles = Roles.Member)]` / `[Authorize(Roles = Roles.ClubAdmin)]` attributes on backend endpoints. The `AccountController` handles login, register, and logout. Cookie authentication was chosen over JWT tokens for simplicity and because the app is served from the same origin.

---

## Bug fix: delete activity not working

**Prompt:**

> How come deleteActivity isn't getting deleted?

**AI response summary:**
Claude identified that `deleteActivity` in `useActivities.ts` was using `agent.post` instead of `agent.delete`. The mutation was calling `POST /activities/:id` (which hits the create endpoint with an id in the URL) instead of `DELETE /activities/:id`. Fix: change `agent.post` to `agent.delete` in the `deleteActivity` mutation function.
