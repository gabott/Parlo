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
  await expect(page.getByText(/10 initial phrases · 27 initial items/)).toBeVisible();

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
  for (const [index, tokens] of [[0, ["Bonne", "journée", "!"]], [1, ["À", "demain", "!"]]]) {
    const builder = page.locator(".sentence-builder").nth(index);
    for (const token of tokens) await builder.locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
    await builder.getByRole("button", { name: "Check sentence" }).click();
  }
  const greetingBuilder = page.locator(".sentence-builder").nth(2);
  for (const token of ["!", "Bonjour"]) await greetingBuilder.locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await greetingBuilder.getByRole("button", { name: "Check sentence" }).click();
  await greetingBuilder.getByRole("button", { name: "Try again" }).click();
  for (const token of ["Bonjour", "!"]) await greetingBuilder.locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await greetingBuilder.getByRole("button", { name: "Check sentence" }).click();
  await page.getByRole("textbox", { name: /See you tomorrow/ }).fill("Au revoir"); await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: "Try again" }).click();
  await page.getByRole("textbox", { name: /See you tomorrow/ }).fill("A demain"); await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("group", { name: /Choose your final words/ }).getByRole("button", { name: "Bonne soirée !" }).click();
  await page.getByRole("button", { name: /Continue to Speak/ }).click();
  await expect(page.getByRole("heading", { name: "Make the phrases yours" })).toBeVisible();
  await page.getByRole("button", { name: "Skip optional speaking" }).click();
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
  await expect(page.getByRole("link", { name: /Next: Names and alphabet/ })).toHaveAttribute("href", "/learn/a1/unit/first-contact/lesson/names-alphabet");
  await page.reload();
  await expect(page.getByRole("heading", { name: /enter and leave a simple French interaction/ })).toBeVisible();
});

test("Lesson 2 teaches alphabet groups, name spelling, and completes its check", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/lesson/names-alphabet");
  await page.getByRole("group", { name: "You arrive during the day." }).getByRole("button", { name: "Bonjour !" }).click();
  await page.getByRole("group", { name: "You leave and will return tomorrow." }).getByRole("button", { name: "À demain !" }).click();
  await page.getByRole("button", { name: /Continue to Meet/ }).click();
  await page.getByRole("group", { name: /What does Ira provide/ }).getByRole("button", { name: "Its spelling" }).click();
  await page.getByRole("button", { name: /Continue to Alphabet/ }).click();
  for (let index = 0; index < 4; index += 1) await page.getByRole("button", { name: "I practised this group" }).click();
  await page.getByRole("button", { name: /Continue to Contrast/ }).click();
  for (const [index, letter] of ["G", "I", "P", "T", "U", "N", "Z"].entries()) await page.locator(".listening-activity").nth(index).getByRole("button", { name: letter, exact: true }).click();
  await page.getByRole("button", { name: /Continue to Spell/ }).click();
  await page.getByRole("textbox", { name: /L – É – A/ }).fill("Lea"); await page.getByRole("button", { name: "Check answer" }).first().click();
  await page.getByRole("button", { name: "Try again" }).click(); await page.getByRole("textbox", { name: /L – É – A/ }).fill("Léa"); await page.getByRole("button", { name: "Check answer" }).first().click();
  await page.getByRole("textbox", { name: /A – M – I – R/ }).fill("Amir"); await page.getByRole("button", { name: "Check answer" }).last().click();
  await page.getByRole("button", { name: /Continue to Use/ }).click();
  const builder = page.locator(".sentence-builder");
  for (const token of ["Ça", "s’écrit", "…"]) await builder.locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await builder.getByRole("button", { name: "Check sentence" }).click();
  await page.getByRole("textbox", { name: /How is that spelled/ }).fill("Comment ca s'ecrit"); await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: /Continue to Check/ }).click();
  await page.locator(".listening-activity").nth(0).getByRole("button", { name: "G", exact: true }).click();
  await page.locator(".listening-activity").nth(1).getByRole("button", { name: "U", exact: true }).click();
  await page.getByRole("group", { name: /Choose ‘How is that spelled/ }).getByRole("button", { name: "Comment ça s’écrit ?" }).click();
  await page.getByRole("textbox", { name: /S – O – F – I – A/ }).fill("Sofia"); await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: "Check my lesson result" }).click();
  await expect(page.getByRole("heading", { name: /recognize French letters and spell a name/ })).toBeVisible();
});

test("Lesson 3 teaches core French sound contrasts and completes its check", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/lesson/core-sound-map");
  await expect(page).toHaveTitle("Core sound map · Parlo");
  await page.locator(".listening-activity").nth(0).getByRole("button", { name: "G", exact: true }).click();
  await page.locator(".listening-activity").nth(1).getByRole("button", { name: "U", exact: true }).click();
  await page.getByRole("button", { name: /Continue to Meet/ }).click();
  await expect(page.getByRole("heading", { name: "A pronunciation workshop" })).toBeVisible();
  await expect(page.getByAltText(/Camille models a French mouth shape/)).toBeVisible();
  await page.getByRole("group", { name: /What is Maya listening for/ }).getByRole("button", { name: "A changing vowel sound" }).click();
  await page.getByRole("button", { name: /Continue to Oral vowels/ }).click();
  for (const [index, word] of ["rue", "roue", "été", "était"].entries()) await page.locator(".listening-activity").nth(index).getByRole("button", { name: word, exact: true }).click();
  await page.getByRole("button", { name: /Continue to Nasal vowels/ }).click();
  for (const [index, word] of ["sans", "son", "sain"].entries()) await page.locator(".listening-activity").nth(index).getByRole("button", { name: word, exact: true }).click();
  await page.getByRole("button", { name: /Continue to French R/ }).click();
  await page.locator(".listening-activity").nth(0).getByRole("button", { name: "merci", exact: true }).click();
  await page.locator(".listening-activity").nth(1).getByRole("button", { name: "au revoir", exact: true }).click();
  await page.getByRole("button", { name: /Continue to Speak/ }).click();
  await page.getByRole("button", { name: /Continue to Check/ }).click();
  for (const [index, word] of ["rue", "roue", "été", "son", "au revoir"].entries()) await page.locator(".listening-activity").nth(index).getByRole("button", { name: word, exact: true }).click();
  await page.getByRole("button", { name: "Check my lesson result" }).click();
  await expect(page.getByRole("heading", { name: /hear key French sound contrasts/ })).toBeVisible();
});

test("Lesson 4 teaches courtesy through context, retrieval, and a complete exchange", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/lesson/courtesy");
  await expect(page).toHaveTitle("Courtesy · Parlo");
  await page.getByRole("group", { name: /Someone helps you/ }).getByRole("button", { name: "Merci." }).click();
  await page.getByRole("group", { name: /You are leaving/ }).getByRole("button", { name: "Au revoir." }).click();
  await page.getByRole("button", { name: /Continue to Meet/ }).click();
  await expect(page.getByAltText(/Ana politely receives/)).toBeVisible();
  await page.getByRole("group", { name: /What happens/ }).getByRole("button", { name: /politely asks for and receives/ }).click();
  await page.getByRole("button", { name: /Continue to Meaning/ }).click();
  for (const [index, answer] of ["Merci.", "S’il vous plaît.", "Excusez-moi.", "Pardon.", "De rien.", "Merci beaucoup."].entries()) await page.locator(".activity-stack .lesson-question").nth(index).getByRole("button", { name: answer, exact: true }).click();
  await page.getByRole("button", { name: /Continue to Listen/ }).click();
  await page.locator(".listening-activity").nth(0).getByRole("button", { name: "pardon", exact: true }).click();
  await page.locator(".listening-activity").nth(1).getByRole("button", { name: "merci beaucoup", exact: true }).click();
  await page.getByRole("textbox", { name: "Type what you hear." }).nth(0).fill("Merci");
  await page.getByRole("button", { name: "Check answer" }).nth(0).click();
  await page.getByRole("textbox", { name: "Type what you hear." }).nth(1).fill("S'il vous plait");
  await page.getByRole("button", { name: "Check answer" }).nth(1).click();
  await page.getByRole("button", { name: /Continue to Build/ }).click();
  const builders = page.locator(".sentence-builder");
  for (const token of ["Excusez-moi", "."]) await builders.nth(0).locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await builders.nth(0).getByRole("button", { name: "Check sentence" }).click();
  for (const token of ["Merci", "beaucoup", "."]) await builders.nth(1).locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await builders.nth(1).getByRole("button", { name: "Check sentence" }).click();
  for (const token of ["S’il", "vous", "plaît", "."]) await builders.nth(2).locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await builders.nth(2).getByRole("button", { name: "Check sentence" }).click();
  await page.getByRole("button", { name: /Continue to Use/ }).click();
  for (const [index, answer] of ["Bonjour.", "Le document, s’il vous plaît.", "Merci beaucoup."].entries()) await page.locator(".activity-stack .lesson-question").nth(index).getByRole("button", { name: answer, exact: true }).click();
  await page.getByRole("button", { name: /Continue to Check/ }).click();
  await page.getByRole("group", { name: /accidentally bump/ }).getByRole("button", { name: "Pardon." }).click();
  const response = page.getByRole("group", { name: "Choose your response." });
  await response.getByRole("button", { name: "S’il vous plaît." }).click();
  await response.getByRole("button", { name: "De rien." }).click();
  await page.getByRole("textbox", { name: /polite interruption/ }).fill("Excusez-moi");
  await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("group", { name: /complete polite classroom exchange/ }).getByRole("button", { name: "Bonjour. Le document, s’il vous plaît. Merci." }).click();
  await page.getByRole("button", { name: "Check my lesson result" }).click();
  await expect(page.getByRole("heading", { name: /handle a polite everyday exchange/ })).toBeVisible();
});

test("Lesson 5 teaches classroom repair and completes the required response", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/lesson/classroom-survival");
  await expect(page).toHaveTitle("Classroom survival · Parlo");
  await page.getByRole("group", { name: /interrupt politely/ }).getByRole("button", { name: "Excusez-moi." }).click();
  await page.getByRole("group", { name: /polite request/ }).getByRole("button", { name: "S’il vous plaît." }).click();
  await page.getByRole("button", { name: /Continue to Meet/ }).click();
  await expect(page.getByAltText(/Alex asks for clarification/)).toBeVisible();
  await page.getByRole("group", { name: /How does Alex/ }).getByRole("button", { name: /repeat more slowly/ }).click();
  await page.getByRole("button", { name: /Continue to Choose/ }).click();
  const meaningAnswers = ["Je ne comprends pas.", "Pouvez-vous répéter, s’il vous plaît ?", "Plus lentement, s’il vous plaît.", "Qu’est-ce que ça veut dire ?", "Comment dit-on “book” en français ?", "Je comprends."];
  for (const [index, answer] of meaningAnswers.entries()) await page.locator(".activity-stack .lesson-question").nth(index).getByRole("button", { name: answer, exact: true }).click();
  await page.getByRole("button", { name: /Continue to Listen/ }).click();
  for (const [index, answer] of ["Slower speech", "The meaning of a word", "Repeat the information"].entries()) await page.locator(".listening-activity").nth(index).getByRole("button", { name: answer, exact: true }).click();
  await page.getByRole("button", { name: /Continue to Build/ }).click();
  const builders = page.locator(".sentence-builder");
  for (const token of ["Je", "ne comprends", "pas", "."]) await builders.nth(0).locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await builders.nth(0).getByRole("button", { name: "Check sentence" }).click();
  for (const token of ["Pouvez-vous", "répéter", ",", "s’il vous plaît", "?"]) await builders.nth(1).locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await builders.nth(1).getByRole("button", { name: "Check sentence" }).click();
  await page.getByRole("textbox", { name: /What does that mean/ }).fill("Qu'est-ce que ça veut dire");
  await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("button", { name: /Continue to Use/ }).click();
  for (const [index, answer] of ["Plus lentement, s’il vous plaît.", "Je comprends.", "Qu’est-ce que ça veut dire ?"].entries()) await page.locator(".activity-stack .lesson-question").nth(index).getByRole("button", { name: answer, exact: true }).click();
  await page.getByRole("button", { name: /Continue to Check/ }).click();
  await page.getByRole("group", { name: /speaker is too fast/ }).getByRole("button", { name: "Plus lentement, s’il vous plaît." }).click();
  await page.getByRole("textbox", { name: /I don’t understand/ }).fill("Je ne comprends pas");
  await page.getByRole("button", { name: "Check answer" }).click();
  const exitBuilder = page.locator(".sentence-builder");
  for (const token of ["Pouvez-vous", "répéter", ",", "s’il vous plaît", "?"]) await exitBuilder.locator(".sentence-builder__tokens").getByRole("button", { name: token, exact: true }).click();
  await exitBuilder.getByRole("button", { name: "Check sentence" }).click();
  await page.getByRole("group", { name: /Choose Alex's two responses/ }).getByRole("button", { name: /Plus lentement.*Merci.*Je comprends/ }).click();
  await page.getByRole("button", { name: "Check my lesson result" }).click();
  await expect(page.getByRole("heading", { name: /keep a difficult conversation going/ })).toBeVisible();
});

test("Unit 1 integrated review connects all five lesson skills", async ({ page }) => {
  await page.goto("/learn/a1/unit/first-contact/review");
  await expect(page).toHaveTitle("First contact review · Parlo");
  await expect(page.getByAltText(/Léa asks Lucas/)).toBeVisible();
  await page.getByRole("group", { name: /time of day/ }).getByRole("button", { name: "Evening" }).click();
  await page.getByRole("button", { name: /Continue to Greetings/ }).click();
  for (const [index,answer] of ["Bonsoir !","À demain !","Bonne soirée !"].entries()) await page.locator(".lesson-question").nth(index).getByRole("button",{name:answer,exact:true}).click();
  await page.getByRole("button", { name: /Continue to Names & sounds/ }).click();
  await page.getByRole("textbox", { name: /name you hear/ }).fill("Léa"); await page.getByRole("button", { name: "Check answer" }).click();
  await page.getByRole("group", { name: /ask Lucas to spell/ }).getByRole("button", { name: /Pouvez-vous épeler/ }).click();
  await page.getByRole("group", { name: "Which word do you hear?" }).getByRole("button", { name: "rue" }).click();
  await page.getByRole("group", { name: /Which nasal/ }).getByRole("button", { name: "son" }).click();
  await page.getByRole("button", { name: /Continue to Courtesy/ }).click();
  for (const [index,answer] of ["Merci.","Excusez-moi.","De rien."].entries()) await page.locator(".lesson-question").nth(index).getByRole("button",{name:answer,exact:true}).click();
  await page.getByRole("button", { name: /Continue to Repair/ }).click();
  await page.getByRole("group", { name: /instruction was too fast/ }).getByRole("button", { name: /Plus lentement/ }).click();
  await page.getByRole("textbox", { name: /I don’t understand/ }).fill("Je ne comprends pas"); await page.getByRole("button", { name: "Check answer" }).click();
  const builder=page.locator(".sentence-builder"); for(const token of ["Pouvez-vous","répéter",",","s’il vous plaît","?"]) await builder.locator(".sentence-builder__tokens").getByRole("button",{name:token,exact:true}).click(); await builder.getByRole("button",{name:"Check sentence"}).click();
  await page.getByRole("button", { name: /Continue to Scenario/ }).click();
  for (const [index,answer] of ["Bonsoir !","Le document, s’il vous plaît.","Merci.","Pouvez-vous répéter, s’il vous plaît ?","Je comprends.","Bonne soirée !"].entries()) await page.locator(".activity-stack .lesson-question").nth(index).getByRole("button",{name:answer,exact:true}).click();
  await page.getByRole("button", { name: /Finish review/ }).click();
  await expect(page.getByRole("heading", { name: /Unit 1 skills worked together/ })).toBeVisible();
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
