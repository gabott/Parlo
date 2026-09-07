import { expect, test } from "@playwright/test";
import { preparePage } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await preparePage(page);
  await page.goto("/");
});

test("mobile menu opens, navigates, closes, and content fits the viewport", async ({ page }) => {
  const menu = page.getByRole("button", { name: "☰" });
  await expect(menu).toBeVisible();
  await menu.click();

  await page.locator(".nav").getByRole("button", { name: /Vocabulary/i }).click();
  await expect(page.getByRole("heading", { name: /Vocabulary/i })).toBeVisible();
  await expect(page.locator(".layout")).not.toHaveClass(/menu-open/);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});

test("mobile overlay closes the open navigation", async ({ page }) => {
  await page.getByRole("button", { name: "☰" }).click();
  await expect(page.locator(".layout")).toHaveClass(/menu-open/);

  await page.locator(".overlay").click({ position: { x: 380, y: 100 } });
  await expect(page.locator(".layout")).not.toHaveClass(/menu-open/);
});
