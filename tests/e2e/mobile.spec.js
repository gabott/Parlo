import { expect, test } from "@playwright/test";
import { preparePage } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await preparePage(page);
  await page.goto("/");
});

test("mobile menu opens, navigates, closes, and content fits the viewport", async ({ page }) => {
  const menu = page.getByRole("button", { name: "Open navigation" });
  await expect(menu).toBeVisible();
  await menu.click();

  await page.locator(".nav").getByRole("link", { name: /Vocabulary/i }).click();
  await expect(page.getByRole("heading", { name: /Vocabulary/i })).toBeVisible();
  await expect(page.locator(".layout")).not.toHaveClass(/menu-open/);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});

test("mobile overlay closes the open navigation", async ({ page }) => {
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator(".layout")).toHaveClass(/menu-open/);

  await page.locator(".overlay").click({ position: { x: 380, y: 100 } });
  await expect(page.locator(".layout")).not.toHaveClass(/menu-open/);
});

test("Lesson 1 player remains usable without horizontal overflow", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/lesson/greetings");
  await expect(page.getByRole("heading", { name: "A morning at language school" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Lesson steps" })).toBeVisible();
  await page.getByRole("button", { name: "They are arriving" }).click();
  await expect(page.getByRole("button", { name: /Continue to Notice/ })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("Lesson 2 player remains usable without horizontal overflow", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/lesson/names-alphabet");
  await expect(page.getByRole("heading", { name: "Bring back two greetings" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Lesson steps" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("Lesson 3 player remains usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/a1/unit/first-contact/lesson/core-sound-map");
  await expect(page.getByRole("heading", { name: "Core sound map" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("Lesson 4 player remains usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/a1/unit/first-contact/lesson/courtesy");
  await expect(page.getByRole("heading", { name: "Courtesy" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("Lesson 5 player remains usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/a1/unit/first-contact/lesson/classroom-survival");
  await expect(page.getByRole("heading", { name: "Classroom survival" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("Unit 1 review remains usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/a1/unit/first-contact/review");
  await expect(page.getByRole("heading", { name: "First contact review" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("Unit 1 assessment remains usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/a1/unit/first-contact/assessment");
  await expect(page.getByRole("heading", { name: "Handle a first-contact exchange" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});
