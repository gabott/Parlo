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
  await expect(page.getByText(/10 initial phrases · 14 initial items/)).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Greetings and farewells" })).toBeVisible();
});

test("Lesson 1 review flow presents context, audio, and explanatory feedback", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/lesson/greetings");
  await expect(page.getByRole("heading", { name: "Greetings and farewells" })).toBeVisible();
  await expect(page.getByRole("img", { name: /Sofia and Ira greet each other/ })).toBeVisible();
  await page.getByRole("button", { name: "Show French" }).click();
  await expect(page.getByRole("button", { name: "Play Sofia's line", exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "They are arriving" }).click();
  await page.getByRole("button", { name: /Continue to Notice/ }).click();
  await page.getByRole("group", { name: /Daytime: you are entering/ }).getByRole("button", { name: "Bonjour !" }).click();
  await page.getByRole("group", { name: /Evening: you are leaving/ }).getByRole("button", { name: "Bonne soirée !" }).click();
  await page.getByRole("button", { name: /Continue to Choose/ }).click();
  const firstPractice = page.getByRole("group", { name: "It is 9:00 a.m. You greet your teacher." });
  await firstPractice.getByRole("button", { name: "Bonsoir !" }).click();
  await expect(firstPractice.getByRole("alert")).toContainText("evening greeting");
  expect(await page.evaluate(() => window.__parloAudioPlays.at(-1))).toMatch(/\/audio\/a6daa39c0\.mp3$/);
  await firstPractice.getByRole("button", { name: "Bonjour !" }).click();
  await expect(firstPractice.getByRole("status")).toContainText("Bonjour is the polite daytime greeting");
  expect(await page.evaluate(() => window.__parloAudioPlays.at(-1))).toMatch(/\/audio\/a49e315a5\.mp3$/);
});

test("complete Lesson 1 exposes listening, building, speaking, and exit stages", async ({ page }) => {
  await page.goto("/learn/a1");
  await page.getByRole("button", { name: "Start A1" }).click();
  await page.goto("/learn/a1/unit/first-contact/lesson/greetings");
  await page.getByRole("button", { name: "They are arriving" }).click();
  await page.getByRole("button", { name: /Continue to Notice/ }).click();
  await page.getByRole("group", { name: /Daytime: you are entering/ }).getByRole("button", { name: "Bonjour !" }).click();
  await page.getByRole("group", { name: /Evening: you are leaving/ }).getByRole("button", { name: "Bonne soirée !" }).click();
  await page.getByRole("button", { name: /Continue to Choose/ }).click();
  for (const item of [
    ["It is 9:00 a.m. You greet your teacher.", "Bonjour !"], ["You leave a store.", "Au revoir !"],
    ["You greet a close friend informally.", "Salut !"], ["It is evening and you enter a restaurant.", "Bonsoir !"],
  ]) await page.getByRole("group", { name: item[0] }).getByRole("button", { name: item[1] }).click();
  await page.getByRole("button", { name: /Continue to Listen/ }).click();
  await expect(page.getByRole("heading", { name: "Hear the difference" })).toBeVisible();
  const listeningAnswers = ["Bonjour !", "À demain !", "Bonne soirée !", "Salut !"];
  for (let index = 0; index < listeningAnswers.length; index += 1) await page.locator(".listening-activity").nth(index).getByRole("button", { name: listeningAnswers[index] }).click();
  await page.getByRole("button", { name: /Continue to Build/ }).click();
  await expect(page.getByRole("heading", { name: "Bring the expressions back from memory" })).toBeVisible();
  for (const [index, tokens] of [[0, ["Bonne", "journée", "!"]], [1, ["À", "demain", "!"]], [2, ["Bonjour", "!"]]]) {
    const builder = page.locator(".sentence-builder").nth(index);
    for (const token of tokens) await builder.locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
    await builder.getByRole("button", { name: "Check sentence" }).click();
  }
  await page.getByRole("textbox", { name: /See you tomorrow/ }).fill("Au revoir"); await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: "Try again" }).click();
  await page.getByRole("textbox", { name: /See you tomorrow/ }).fill("À demain"); await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("group", { name: /Choose your final words/ }).getByRole("button", { name: "Bonne soirée !" }).click();
  await page.getByRole("button", { name: /Continue to Speak/ }).click();
  await expect(page.getByRole("heading", { name: "Make the phrases yours" })).toBeVisible();
  for (let index = 0; index < 2; index += 1) {
    const speaking = page.locator(".speaking-practice").nth(index);
    await speaking.getByRole("button", { name: "Record my answer" }).click();
    await speaking.getByRole("checkbox", { name: /fits the situation/ }).check();
    await speaking.getByRole("checkbox", { name: /understand my words/ }).check();
    await speaking.getByRole("button", { name: "Submit self-review" }).click();
  }
  await page.getByRole("button", { name: /Continue to Check/ }).click();
  await expect(page.getByRole("heading", { name: "Can you use it without hints?" })).toBeVisible();
  await page.locator(".listening-activity").getByRole("button", { name: "Bonsoir !" }).click();
  await page.getByRole("group", { name: /polite arrival/ }).getByRole("button", { name: "Bonjour !" }).click();
  await page.getByRole("group", { name: /leave during the day/ }).getByRole("button", { name: "Bonne journée !" }).click();
  await page.getByRole("textbox", { name: /See you soon/ }).fill("A bientot");
  await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: "Check my lesson result" }).click();
  await expect(page.getByText(/One short review before retrying/)).toBeVisible();
  await page.getByRole("button", { name: "Retry lesson check" }).click();
  await page.locator(".listening-activity").getByRole("button", { name: "Bonsoir !" }).click();
  await page.getByRole("group", { name: /polite arrival/ }).getByRole("button", { name: "Bonjour !" }).click();
  await page.getByRole("group", { name: /leave during the day/ }).getByRole("button", { name: "Bonne journée !" }).click();
  await page.getByRole("textbox", { name: /See you soon/ }).fill("À bientôt");
  await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: "Check my lesson result" }).click();
  await expect(page.getByRole("heading", { name: /enter and leave a simple French interaction/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /enter and leave a simple French interaction/ })).toBeVisible();
});

test("guest enrollment saves Lesson 1 attempts across refresh and can be deleted", async ({ page }) => {
  await page.goto("/learn/a1");
  await page.getByRole("button", { name: "Start A1" }).click();
  await expect(page.getByRole("heading", { name: "A1 is active on this device" })).toBeVisible();
  await page.goto("/learn/a1/unit/first-contact/lesson/greetings");
  await page.getByRole("button", { name: "They are arriving" }).click();
  await expect(page.getByText(/Position saved · 1 attempts/)).toBeVisible();
  await page.getByRole("button", { name: /Continue to Notice/ }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Arrival is different from a leaving wish" })).toBeVisible();
  await page.goto("/learn/a1");
  await page.getByRole("button", { name: "Delete local progress" }).click();
  await expect(page.getByRole("group", { name: "Confirm local progress deletion" })).toBeVisible();
  await page.getByRole("button", { name: "Yes, delete" }).click();
  await expect(page.getByRole("button", { name: "Start A1" })).toBeVisible();
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
