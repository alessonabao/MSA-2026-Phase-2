import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import { ADMIN_STORAGE_STATE, MEMBER_STORAGE_STATE } from "./testAccounts";

const AVATAR_PATH = fileURLToPath(new URL("./fixtures/avatar.png", import.meta.url));

test.describe("editing your own profile", () => {
  test.use({ storageState: MEMBER_STORAGE_STATE });

  test("completing bio, weapon, skill level, and a picture earns the Profile Complete badge", async ({
    page,
  }) => {
    await page.goto("/activities");
    await page.getByRole("banner").getByRole("link", { name: "Profile" }).click();

    await page.getByRole("button", { name: "Edit Profile" }).click();
    const dialog = page.getByRole("dialog", { name: "Edit Profile" });

    await dialog
      .getByLabel("Bio")
      .fill("Loves competitive fencing and teaching newcomers.");
    await dialog.getByLabel("Weapon of Choice").click();
    await page.getByRole("option", { name: "Foil" }).click();
    await dialog.getByLabel("Skill Level").click();
    await page.getByRole("option", { name: "Beginner" }).click();
    await page.locator('input[type="file"]').setInputFiles(AVATAR_PATH);

    await dialog.getByRole("button", { name: "Save Changes" }).click();
    await expect(dialog).not.toBeVisible();

    // Completing the profile is a one-way trip (permanent badge, no un-complete
    // action in the UI), so there's nothing to clean up afterward.
    await expect(page.getByText("Profile Complete")).toBeVisible();

    // Reload to confirm the edits actually persisted server-side, not just in
    // client-side cache.
    await page.reload();
    await expect(
      page.getByText("Loves competitive fencing and teaching newcomers."),
    ).toBeVisible();
    // Scoped to <main>: the footer's "beginner resources" copy would otherwise
    // also match "Beginner" via Playwright's default substring/case-insensitive
    // text matching.
    await expect(page.getByRole("main").getByText("Foil")).toBeVisible();
    await expect(page.getByRole("main").getByText("Beginner")).toBeVisible();
    await expect(page.getByText("Profile Complete")).toBeVisible();
  });
});

test.describe("viewing another member's profile", () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  test("shows their badges and timeline without any edit controls", async ({
    page,
    browser,
  }) => {
    // Grab the seeded Member's own profile URL via a short-lived second
    // context, rather than hardcoding their user id.
    const memberContext = await browser.newContext({
      storageState: MEMBER_STORAGE_STATE,
    });
    const memberPage = await memberContext.newPage();
    await memberPage.goto("/activities");
    await memberPage
      .getByRole("banner")
      .getByRole("link", { name: "Profile" })
      .click();
    const memberProfileUrl = memberPage.url();
    await memberContext.close();

    await page.goto(memberProfileUrl);

    await expect(page.getByRole("heading", { name: "Alesson" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Edit Profile" }),
    ).not.toBeVisible();
    await expect(page.getByRole("tab", { name: "Badges" })).toBeVisible();
    await expect(
      page.getByRole("tab", { name: "Event Timeline" }),
    ).toBeVisible();
  });
});
