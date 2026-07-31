import { test as setup, expect, type Page } from "@playwright/test";
import {
  ADMIN,
  ADMIN_STORAGE_STATE,
  MEMBER,
  MEMBER_STORAGE_STATE,
} from "./testAccounts";

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  // The form uses mode: "onTouched", so react-hook-form doesn't compute isValid
  // (which the submit button's disabled state depends on) until a field blurs -
  // .fill() alone never blurs the last-filled field, so the button would stay
  // disabled forever without this.
  await page.getByPlaceholder("Password").press("Tab");
  // Scoped to <main>: the submit button is a sibling of <form> (associated via
  // the HTML `form` attribute, not DOM nesting - see LoginForm.tsx's CardFooter),
  // so a `form` locator can't reach it. NavBar (outside <main>) has its own
  // "Login" link button, which is what makes an unscoped query ambiguous.
  await page.getByRole("main").getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/activities/);
}

setup("authenticate as member", async ({ page }) => {
  await login(page, MEMBER.email, MEMBER.password);
  await page.context().storageState({ path: MEMBER_STORAGE_STATE });
});

setup("authenticate as admin", async ({ page }) => {
  await login(page, ADMIN.email, ADMIN.password);
  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
