import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FRONTEND_URL = "http://localhost:5173";
const BACKEND_URL = "http://localhost:5000";

/**
 * E2E tests drive the app against a real .NET backend + a seeded SQL Server database that is
 * separate from the developer's own `fencingclub` database (see webServer below), never mocked
 * API routes. See software/demo/frontend/README or /specs for the full rationale.
 */
export default defineConfig({
  testDir: "./tests",

  // Single shared database, no per-worker data isolation - serial execution avoids
  // cross-test data collisions entirely, which is a much simpler tradeoff than building
  // per-worker DB isolation for a suite this size.
  fullyParallel: false,
  workers: 1,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: FRONTEND_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  // The app's axios interceptor (src/lib/api/agent.ts) artificially delays every API
  // response by ~1s to simulate loading states - give auto-retrying assertions enough
  // headroom above that baseline instead of fighting the default 5s expect timeout.
  expect: {
    timeout: 10_000,
  },

  projects: [
    {
      // Logs in as the seeded Member and ClubAdmin accounts once and saves their
      // storageState, so the rest of the suite reuses an authenticated session instead
      // of logging in from scratch in every spec.
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],

  /* Start both the Vite dev server and the .NET backend automatically before running tests. */
  webServer: [
    {
      command: "npm run dev",
      url: FRONTEND_URL,
      // Never reuse an already-running dev server: it would be pointed at your real
      // fencingclub database, not the isolated/reset e2e database below, silently defeating
      // the point of seeding a known state. Stop your own `npm run dev` before running e2e.
      reuseExistingServer: false,
      stdout: "pipe",
      // VITE_API_URL normally comes from .env.development, which is gitignored and so
      // doesn't exist on CI runners - set it explicitly so the app doesn't crash on
      // import (src/lib/utils.ts reads it at module scope) when that file is absent.
      env: {
        ...process.env,
        VITE_API_URL: `${BACKEND_URL}/api`,
      },
    },
    {
      // Points at a SQL Server instance - the same local Docker container from
      // docker-compose.yml for local runs, or the mssql service container reusable-ci.yml
      // spins up in CI - using a database name dedicated to e2e so it never touches a
      // developer's own `fencingclub` database. E2E_RESET_DB=true (see Program.cs) drops
      // that database on every startup so each run starts from a clean, known-seeded state.
      command: "dotnet run",
      cwd: path.resolve(__dirname, "../backend"),
      // GET /api/account/user-info is [AllowAnonymous] and returns 204 when logged out -
      // a lightweight existing endpoint, no need for a dedicated health check.
      url: `${BACKEND_URL}/api/account/user-info`,
      reuseExistingServer: false,
      // Cold `dotnet run` (build + migrate + seed) can comfortably take longer than
      // Playwright's 60s webServer default, especially on the first run.
      timeout: 120_000,
      env: {
        ...process.env,
        ConnectionStrings__DefaultConnection:
          "Server=localhost,1433;Database=fencingclub_e2e;User Id=SA;Password=Password@1;TrustServerCertificate=True",
        E2E_RESET_DB: "true",
      },
      stdout: "pipe",
    },
  ],
});
