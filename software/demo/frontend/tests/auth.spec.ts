import { test, expect } from "@playwright/test";
import { MEMBER, MEMBER_STORAGE_STATE } from "./testAccounts";

// Fixed, non-seeded credentials - safe to reuse every run because the e2e database is
// wiped and reseeded before the whole suite starts (see webServer in playwright.config.ts).
const NEW_MEMBER = {
  name: "E2E New Member",
  email: "e2e-newmember@test.com",
  password: "EnGarde!3",
};

test.describe("logged out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("redirects to /login when visiting a protected route", async ({ page }) => {
    await page.goto("/activities");
    await expect(page).toHaveURL(/\/login/);
  });

  test("registers a new account and can immediately log in with it", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.getByPlaceholder(/portia knight/i).fill(NEW_MEMBER.name);
    await page.getByPlaceholder(/upi@aucklanduni/i).fill(NEW_MEMBER.email);
    // exact: true - Playwright's getByLabel does substring matching by default,
    // so "Password" would otherwise also match "Confirm Password".
    await page.getByLabel("Password", { exact: true }).fill(NEW_MEMBER.password);
    await page.getByLabel("Confirm Password").fill(NEW_MEMBER.password);
    // mode: "onTouched" - the submit button stays disabled until the last field blurs.
    await page.getByLabel("Confirm Password").press("Tab");
    await page
      .getByRole("main")
      .getByRole("button", { name: "Create Account" })
      .click();

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByText("Registered successfully. Please log in."),
    ).toBeVisible();

    await page.getByPlaceholder("Email").fill(NEW_MEMBER.email);
    await page.getByPlaceholder("Password").fill(NEW_MEMBER.password);
    await page.getByPlaceholder("Password").press("Tab");
    await page
      .getByRole("main")
      .getByRole("button", { name: "Login" })
      .click();

    await expect(page).toHaveURL(/\/activities/);
  });

  test("shows an error and stays on the page for invalid credentials", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill(MEMBER.email);
    await page.getByPlaceholder("Password").fill("the-wrong-password");
    await page.getByPlaceholder("Password").press("Tab");
    await page
      .getByRole("main")
      .getByRole("button", { name: "Login" })
      .click();

    await expect(page.getByText("Invalid email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("authenticated as Member", () => {
  test.use({ storageState: MEMBER_STORAGE_STATE });

  test("logs out and returns to a logged-out state", async ({ page }) => {
    await page.goto("/activities");
    await page.getByRole("banner").getByRole("button", { name: "Logout" }).click();

    // NavBar's handleLogout navigates to "/" on success, but there's a known race with
    // RequireAuth's own reactive redirect to "/login" (both fire off the same ["user"]
    // query invalidation) - landing on either is an acceptably "logged out" outcome here.
    // Flagged separately as an app bug; not fixed as part of this E2E task.
    await expect(page).toHaveURL(/\/(login)?$/);
    await expect(
      page.getByRole("banner").getByRole("button", { name: "Login" }),
    ).toBeVisible();
  });

  test("is redirected away from the ClubAdmin-only create-activity route", async ({
    page,
  }) => {
    await page.goto("/activities/createActivity");
    await expect(page).toHaveURL(/\/activities$/);
  });
});
