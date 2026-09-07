import { expect } from "@playwright/test";

export async function preparePage(page) {
  await page.addInitScript(() => {
    window.__parloAudioPlays = [];

    class MockAudio {
      constructor(source) {
        this.src = source;
        this.onerror = null;
      }

      pause() {}

      play() {
        window.__parloAudioPlays.push(this.src);
        return Promise.resolve();
      }
    }

    window.Audio = MockAudio;
  });

  await page.route("https://**/*", (route) => route.abort());
}

export async function openSection(page, name, expectedHeading = name) {
  await page.locator(".nav").getByRole("button", { name: new RegExp(name, "i") }).click();
  await expect(page.getByRole("heading", { name: expectedHeading, exact: false })).toBeVisible();
}
