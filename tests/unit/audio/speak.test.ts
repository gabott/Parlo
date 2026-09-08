import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { speak } from "../../../src/speak";

describe("French audio playback", () => {
  beforeEach(() => {
    vi.stubGlobal("SpeechSynthesisUtterance", class { lang = ""; rate = 1; voice = null; constructor(public text: string) {} });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("falls back only once when missing audio reports both error paths", async () => {
    const speech = { cancel: vi.fn(), getVoices: () => [], speak: vi.fn() };
    vi.stubGlobal("speechSynthesis", speech);
    class MissingAudio {
      onerror: (() => void) | null = null;
      pause() {}
      play() {
        queueMicrotask(() => this.onerror?.());
        return Promise.reject(new Error("missing"));
      }
    }
    vi.stubGlobal("Audio", MissingAudio);

    speak("Phrase without a file");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(speech.speak).toHaveBeenCalledOnce();
  });
});
