import { expect, test } from "@playwright/test";
import { preparePage } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await preparePage(page);
});

test("library routes support direct loading and refresh", async ({ page }) => {
  await page.goto("/library/vocabulary");
  await expect(page.getByRole("heading", { name: /Vocabulary/i })).toBeVisible();
  await expect(page).toHaveURL(/\/library\/vocabulary$/);
  await expect(page).toHaveTitle("Vocabulary · Parlo");

  await page.reload();
  await expect(page.getByRole("heading", { name: /Vocabulary/i })).toBeVisible();
  await expect(page).toHaveURL(/\/library\/vocabulary$/);
});

test("browser back and forward restore portal sections", async ({ page }) => {
  await page.goto("/");
  await page.locator(".nav").getByRole("link", { name: "Basics" }).click();
  await page.locator(".nav").getByRole("link", { name: "Grammar" }).click();
  await expect(page).toHaveURL(/\/library\/grammar$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/library\/basics$/);
  await expect(page.getByRole("heading", { name: /Basics/i })).toBeVisible();

  await page.goForward();
  await expect(page).toHaveURL(/\/library\/grammar$/);
  await expect(page.getByRole("heading", { name: /Grammar/i })).toBeVisible();
});

test("learn preview is reachable and preserves the current Library", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.getByRole("heading", { name: /Learn French with a clear path/i })).toBeVisible();
  await expect(page).toHaveTitle("Learn Preview · Parlo");

  await page.getByRole("link", { name: /Explore the current Library/i }).click();
  await expect(page).toHaveURL(/\/library\/basics$/);
  await expect(page.getByRole("heading", { name: /Basics/i })).toBeVisible();
});

test("learn preview exposes accessible V2 progress and feedback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/learn");

  const progress = page.getByRole("progressbar", { name: "Preview foundation" });
  await expect(progress).toHaveAttribute("aria-valuenow", "2");
  await expect(progress).toHaveAttribute("aria-valuetext", "67%");

  await page.getByRole("button", { name: "Check readiness" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Ready to learn");

  const transitionDuration = await page.locator(".v2-progress__bar").evaluate(
    (element) => getComputedStyle(element).transitionDuration,
  );
  expect(Number.parseFloat(transitionDuration)).toBeLessThan(0.001);
});

test("compiled A1 manifest and lazy Unit 1 bundle drive Learn routes", async ({ page }) => {
  await page.goto("/learn/a1");
  await expect(page.getByRole("heading", { name: "Beginner A1" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Unit 1 · French sounds and first contact/ })).toBeVisible();
  await expect(page).toHaveTitle("Beginner A1 · Parlo");

  await page.getByRole("link", { name: "View unit outline" }).click();
  await expect(page).toHaveURL(/\/learn\/a1\/unit\/first-contact$/);
  await expect(page.getByRole("heading", { name: "French sounds and first contact" })).toBeVisible();
  await expect(page.locator(".lesson-outline > li")).toHaveCount(7);
  await expect(page.getByText(/8 initial phrases · 5 initial items/)).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Greetings and farewells" })).toBeVisible();
});

test("Lesson 1 review flow presents context, audio, and explanatory feedback", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/lesson/greetings");
  await expect(page.getByRole("heading", { name: "Greetings and farewells" })).toBeVisible();
  await expect(page.getByRole("img", { name: /Sofia and Ira greet each other/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play Sofia saying Bonjour" })).toBeVisible();

  await page.getByRole("button", { name: "Bonsoir !" }).click();
  await expect(page.getByRole("alert")).toContainText("Use bonjour during the day");
  await page.getByRole("button", { name: "Bonjour !" }).click();
  await expect(page.getByRole("status")).toContainText("Bonjour is the polite daytime greeting");
});

test("unknown routes show a recoverable not-found page", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page).toHaveTitle("Page not found · Parlo");

  await page.getByRole("link", { name: /Return to dashboard/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: /Bienvenue/i })).toBeVisible();
});

test("route navigation moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.locator(".nav").getByRole("link", { name: "Phrases" }).click();
  await expect(page.locator("main")).toBeFocused();
});
