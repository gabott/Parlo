import { expect, test } from "@playwright/test";
import { openSection, preparePage } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await preparePage(page);
  await page.goto("/");
});

test("dashboard and every existing section remain reachable", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Bienvenue/i })).toBeVisible();
  await expect(page.getByText(/A1 to B2\+/i)).toBeVisible();

  await openSection(page, "Basics");
  await openSection(page, "Vocabulary");
  await openSection(page, "Grammar");
  await openSection(page, "Phrases");
  await openSection(page, "Practice");
  await openSection(page, "Videos", "Videos & resources");
  await openSection(page, "TEF Exam", "TEF Canada");
  await openSection(page, "Dashboard", "Bienvenue");
});

test("vocabulary search and theme filter preserve current behavior", async ({ page }) => {
  await openSection(page, "Vocabulary");

  const search = page.getByPlaceholder("Search a word…");
  await search.fill("bonjour");
  await expect(page.locator(".vocab-card")).toHaveCount(1);
  await expect(page.locator(".vocab-card")).toContainText("bonjour");

  await search.fill("");
  await page.locator("select.select").selectOption("Famille");
  await expect(page.locator(".vocab-card")).toHaveCount(10);
  await expect(page.locator(".vocab-card").first()).toContainText("famille");
});

test("grammar topic opens, answers a drill, and returns to the list", async ({ page }) => {
  await openSection(page, "Grammar");

  await page.getByRole("button", { name: /Le verbe « être »/i }).click();
  await expect(page.getByRole("heading", { name: /Le verbe « être »/i })).toBeVisible();
  await page.getByRole("button", { name: "est", exact: true }).click();
  await expect(page.getByText(/Correct/i)).toBeVisible();

  await page.getByRole("button", { name: /All topics/i }).click();
  await expect(page.getByRole("heading", { name: /Grammar/i })).toBeVisible();
});

test("practice quiz can finish and restart", async ({ page }) => {
  await openSection(page, "Practice");
  await page.getByRole("button", { name: /Quiz/i }).click();

  for (let question = 0; question < 5; question += 1) {
    await page.locator(".options .option").first().click();
    const nextLabel = question < 4 ? /Next question/i : /See results/i;
    await page.getByRole("button", { name: nextLabel }).click();
  }

  await expect(page.getByRole("heading", { name: /Quiz complete/i })).toBeVisible();
  await page.getByRole("button", { name: /Try again/i }).click();
  await expect(page.getByText("Question 1 of 5")).toBeVisible();
});

test("pronunciation button requests the expected local audio asset", async ({ page }) => {
  await openSection(page, "Vocabulary");
  await page.locator(".vocab-card").first().getByTitle("Listen").click();

  const audioSources = await page.evaluate(() => window.__parloAudioPlays);
  expect(audioSources).toHaveLength(1);
  expect(audioSources[0]).toMatch(/\/audio\/[^/]+\.mp3$/);
});

test("current main screens fit the desktop viewport without horizontal overflow", async ({ page }) => {
  const sections = ["Dashboard", "Basics", "Vocabulary", "Grammar", "Phrases", "Practice", "TEF Exam"];

  for (const section of sections) {
    if (section !== "Dashboard") {
      await openSection(page, section, section === "TEF Exam" ? "TEF Canada" : section);
    }

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasOverflow, `${section} should not overflow horizontally`).toBe(false);
  }
});
