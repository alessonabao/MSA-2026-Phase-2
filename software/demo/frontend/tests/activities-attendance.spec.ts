import { test, expect, type Page } from "@playwright/test";
import { MEMBER_STORAGE_STATE } from "./testAccounts";

test.use({ storageState: MEMBER_STORAGE_STATE });

// Two distinct seeded activities so the two tests below never compete for the
// same attendance row, even though they share the seeded Member account and
// run serially against one database.
const SABRE_BOOTCAMP = "Sabre Beginner Bootcamp";
const EPEE_WORKSHOP = "Épée Intermediate Drilling Workshop";

async function openActivity(page: Page, title: string) {
  await page.goto("/activities");
  const card = page.locator('[data-slot="card"]', { hasText: title });
  await card.getByRole("button", { name: "View Event" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
}

test("joining an event shows Attending status, earns the First Touch badge, and lists the attendee", async ({
  page,
}) => {
  await openActivity(page, SABRE_BOOTCAMP);

  await page.getByRole("main").getByRole("button", { name: "Join Event" }).click();
  await expect(
    page.getByRole("main").getByRole("button", { name: "Cancel Attendance" }),
  ).toBeVisible();

  // Attendee list on the details page - the seeded Member ("Alesson") is now
  // the sole attendee.
  await page.getByRole("button", { name: /1 attendee/ }).click();
  const dialog = page.getByRole("dialog", { name: "Attendee Details" });
  await expect(dialog.getByText("Alesson")).toBeVisible();

  // Clicking the attendee navigates to their profile - which happens to be our
  // own, so this doubles as the assertion point for the join-triggered badge.
  await dialog.getByRole("button", { name: "Alesson" }).click();
  await expect(page.getByRole("heading", { name: "Alesson" })).toBeVisible();
  await expect(page.getByText("First Touch")).toBeVisible();

  // Clean up so this account's attendance count doesn't leak into other specs.
  await openActivity(page, SABRE_BOOTCAMP);
  await page
    .getByRole("main")
    .getByRole("button", { name: "Cancel Attendance" })
    .click();
});

test("the dashboard card's status badge reflects Attending, then Cancelled", async ({
  page,
}) => {
  await openActivity(page, EPEE_WORKSHOP);
  await page.getByRole("main").getByRole("button", { name: "Join Event" }).click();
  await expect(
    page.getByRole("main").getByRole("button", { name: "Cancel Attendance" }),
  ).toBeVisible();

  await page.goto("/activities");
  const card = page.locator('[data-slot="card"]', { hasText: EPEE_WORKSHOP });
  await expect(card.getByText("Attending")).toBeVisible();

  await card.getByRole("button", { name: "View Event" }).click();
  await page
    .getByRole("main")
    .getByRole("button", { name: "Cancel Attendance" })
    .click();
  await expect(
    page.getByRole("main").getByRole("button", { name: "Join Event" }),
  ).toBeVisible();

  await page.goto("/activities");
  await expect(card.getByText("Cancelled")).toBeVisible();
  await expect(card.getByText("Attending")).not.toBeVisible();
});
