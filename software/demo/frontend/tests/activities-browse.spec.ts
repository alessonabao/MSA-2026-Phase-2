import { test, expect } from "@playwright/test";
import { MEMBER_STORAGE_STATE } from "./testAccounts";

test.use({ storageState: MEMBER_STORAGE_STATE });

// Seeded activities (backend/Data/DbSeedData.cs) used as fixed reference points -
// read-only assertions, so multiple tests can rely on the same seeded titles safely.
const FOIL_OPEN = "Auckland Foil Open 2026"; // Foil, Intermediate, Competition
const EPEE_TRAINING = "Beginner Épée Training Session"; // Épée, Beginner, Training
const SABRE_SOCIAL = "Sabre Club Social Night"; // Sabre, Beginner, Social
const FOIL_QUALIFIER = "NZ National Foil Championship — Qualifier"; // Foil, Advanced, Competition

test("lists seeded activities on the dashboard", async ({ page }) => {
  await page.goto("/activities");

  await expect(page.getByText(FOIL_OPEN)).toBeVisible();
  await expect(page.getByText(SABRE_SOCIAL)).toBeVisible();
});

test("filters by weapon", async ({ page }) => {
  await page.goto("/activities");
  await expect(page.getByText(FOIL_OPEN)).toBeVisible();

  await page.getByRole("button", { name: "FOIL" }).click();

  await expect(page.getByText(FOIL_OPEN)).toBeVisible();
  await expect(page.getByText(SABRE_SOCIAL)).not.toBeVisible();
  await expect(page.getByText(EPEE_TRAINING)).not.toBeVisible();
});

test("filters by event type", async ({ page }) => {
  await page.goto("/activities");
  // Every event type is checked by default - uncheck Training and Social,
  // leaving only Competition.
  await page.getByLabel("Training").click();
  await page.getByLabel("Social").click();

  await expect(page.getByText(FOIL_OPEN)).toBeVisible();
  await expect(page.getByText(FOIL_QUALIFIER)).toBeVisible();
  await expect(page.getByText(EPEE_TRAINING)).not.toBeVisible();
  await expect(page.getByText(SABRE_SOCIAL)).not.toBeVisible();
});

test("filters by skill level", async ({ page }) => {
  await page.goto("/activities");
  await page.getByLabel("Beginner").click();

  await expect(page.getByText(EPEE_TRAINING)).toBeVisible();
  await expect(page.getByText(SABRE_SOCIAL)).toBeVisible();
  await expect(page.getByText(FOIL_OPEN)).not.toBeVisible();
});

test("clearing all filters restores the full list", async ({ page }) => {
  await page.goto("/activities");
  await page.getByRole("button", { name: "FOIL" }).click();
  await expect(page.getByText(SABRE_SOCIAL)).not.toBeVisible();

  await page.getByRole("button", { name: "Clear All Filters" }).click();

  await expect(page.getByText(SABRE_SOCIAL)).toBeVisible();
});

test("navigates from a card to that activity's details page", async ({ page }) => {
  await page.goto("/activities");

  // Scoped via the shadcn Card's data-slot attribute - there's one "View Event"
  // button per card, so an unscoped query would be ambiguous across activities.
  const card = page.locator('[data-slot="card"]', { hasText: FOIL_OPEN });
  await card.getByRole("button", { name: "View Event" }).click();

  await expect(page.getByRole("heading", { name: FOIL_OPEN })).toBeVisible();
  // Venue appears in both the description and sidebar sections of the details
  // page - .first() is enough to confirm it rendered at all.
  await expect(page.getByText("Hiwa Recreation Centre").first()).toBeVisible();
});
