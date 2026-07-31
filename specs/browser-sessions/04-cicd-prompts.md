# CI/CD Pipeline Prompts

AI tool used: Claude (claude.ai)

---

## Initial CI pipeline design

**Prompt:**

> Help me create a GitHub Actions CI pipeline for my project. I want separate CI for frontend and backend. Is it also possible to have a reusable template I can use for both?

**AI response summary:**
Claude designed a three-file GitHub Actions structure:

- `reusable-ci.yml` — reusable workflow called by both pipelines via `workflow_call`, with `project-type` input to conditionally run Node or .NET steps
- `frontend-ci.yml` — caller workflow triggering on `software/demo/frontend/**` path changes
- `backend-ci.yml` — caller workflow triggering on `software/demo/backend/**` path changes

Key technical constraint discovered: reusable workflows referenced with `./` must exist on the default branch (`main`) before they can be called from any other branch — including PRs. All three files must be pushed to `main` together before feature branch CI runs work.

---

## Frontend CI with Playwright

**Prompt:**

> I want to be able to build and test lints and run Playwright tests in my frontend-ci.yml.

**AI response summary:**
Claude built the frontend pipeline with four sequential steps: install dependencies (`npm ci`) → lint (`npm run lint`) → build (`tsc -b && vite build`) → install Playwright Chromium only (`npx playwright install --with-deps chromium`) → run tests (`npm run test:e2e`). Added `Upload Playwright report` step with `if: always()` so the HTML report uploads even when tests fail, enabling download from the Actions tab for debugging.

---

## Branch protection and ruleset

**Prompt:**

> I have added a ruleset for my main branch but I can still push changes from the feature branch to main even after creating the ruleset.

**AI response summary:**
Claude identified the ruleset had `"enforcement": "disabled"`. Changing to `"enforcement": "active"` enables it. Also identified that the required status check name `"frontend-ci"` did not match the actual job name `"CI"` registered by GitHub from the reusable workflow's `name: CI` field — causing the check to never be satisfied. Fixed by renaming the job in `reusable-ci.yml` to `"Frontend CI"` and updating the ruleset context to match.

---

## Playwright test failures

**Prompt:**

> My frontend-ci is failing — Firefox and WebKit browsers aren't installed.

**AI response summary:**
Claude identified two issues: (1) the CI only installs Chromium but `playwright.config.ts` runs tests on all three browsers. Fixed by adding `process.env.CI` check to scope to Chromium-only in CI. (2) The example tests from `npx playwright init` test `playwright.dev`, not the actual app. Fixed by updating `baseURL` in `playwright.config.ts` and adding a `webServer` block pointing to `npm run preview` so Playwright serves the built app during CI runs.

---

## .github folder location

**Prompt:**

> Invalid workflow reference — uses path not being found even though the file exists.

**AI response summary:**
Claude identified that GitHub requires `.github/workflows/` to be at the repository root, not nested inside `software/demo/.github/`. The folder was being created inside the project subfolder rather than at `MSA-2026-Phase-2/.github/`. Moved `.github/` to the repo root and updated all `paths` triggers in the workflow files to use full paths from repo root (e.g. `software/demo/frontend/**`).

---

## Backend CI

**Prompt:**

> Moving on to my backend-ci.yml — help me create a backend CI that restores dependencies and builds the backend.

**AI response summary:**
Claude created `backend-ci.yml` calling `reusable-ci.yml` with `project-type: backend`, `dotnet-version: "10.0.x"` (matching `net10.0` in `.csproj`), `build-command: dotnet build --no-restore --configuration Release`, and `test-command: echo "No test project yet"` as a placeholder. Added NuGet package caching step keyed on `*.csproj` file hash to skip re-downloading unchanged packages on repeat runs.
