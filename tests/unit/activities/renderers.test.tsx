import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { activityRendererRegistry, AudioTextSelectRenderer, GuidedSpeakingRenderer, MeaningSelectRenderer, SentenceBuildRenderer, TypedRecallRenderer } from "../../../src/activities/registry";

vi.mock("../../../src/speak", () => ({ speak: vi.fn() }));
const base = { activityId: "activity.test", itemId: "item.test" };

describe("activity renderers", () => {
  it("registers every Increment 5 activity kind", () => {
    expect(Object.keys(activityRendererRegistry).sort()).toEqual(["audio_text_select", "dictation", "guided_speaking", "matching", "meaning_select", "presentation", "sentence_build", "text_audio_select", "typed_recall"]);
  });
  it("announces incorrect feedback, permits retry, and locks a correct choice", async () => {
    const user = userEvent.setup(); const onSubmit = vi.fn();
    render(<MeaningSelectRenderer {...base} prompt="Morning?" options={["Bonsoir", "Bonjour"]} answer="Bonjour" feedback={{ Bonsoir: "Bonsoir is for evening." }} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Bonsoir" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Bonsoir is for evening");
    await user.click(screen.getByRole("button", { name: "Bonjour" }));
    expect(screen.getByRole("status")).toHaveTextContent("Correct");
    expect(onSubmit.mock.calls.map(call => call[0].envelope.kind)).toEqual(["meaning_select", "meaning_select"]);
    expect(screen.getByRole("button", { name: "Bonsoir" })).toBeDisabled();
  });
  it("builds a sentence without drag and emits token response", async () => {
    const user = userEvent.setup(); const onSubmit = vi.fn();
    render(<SentenceBuildRenderer {...base} prompt="Build it" tokens={["À", "demain", "!"]} answer="À demain !" onSubmit={onSubmit} />);
    for (const token of ["À", "demain", "!"]) await user.click(screen.getByRole("button", { name: token }));
    await user.click(screen.getByRole("button", { name: "Check sentence" }));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ envelope: { kind: "sentence_build", response: ["À", "demain", "!"] }, evaluation: { outcome: "correct" } });
  });
  it("lets a sentence builder recover from a wrong order", async () => {
    const user = userEvent.setup(); const onSubmit = vi.fn();
    render(<SentenceBuildRenderer {...base} prompt="Build a greeting" tokens={["Bonjour", "!"]} answer="Bonjour !" onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "!" })); await user.click(screen.getByRole("button", { name: "Bonjour" }));
    await user.click(screen.getByRole("button", { name: "Check sentence" })); await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByLabelText("Your sentence")).toHaveTextContent("Choose words below");
    await user.click(screen.getByRole("button", { name: "Bonjour" })); await user.click(screen.getByRole("button", { name: "!" }));
    await user.click(screen.getByRole("button", { name: "Check sentence" }));
    expect(screen.getByRole("status")).toHaveTextContent("Well built"); expect(onSubmit).toHaveBeenCalledTimes(2);
  });
  it("scores typed recall and structured speaking self-review", async () => {
    const user = userEvent.setup(); const typed = vi.fn(); const speaking = vi.fn();
    const { rerender } = render(<TypedRecallRenderer {...base} prompt="Type hello" answers={["Bonjour !"]} policy={{ accents: "required", punctuation: "optional" }} onSubmit={typed} />);
    await user.type(screen.getByRole("textbox", { name: "Type hello" }), "bonjour"); await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(typed.mock.calls[0][0].evaluation.outcome).toBe("correct");
    rerender(<GuidedSpeakingRenderer {...base} prompt="Speak" model="Bonjour" onSubmit={speaking} />);
    await user.click(screen.getByRole("checkbox", { name: /fits the situation/ })); await user.click(screen.getByRole("checkbox", { name: /understand my words/ })); await user.click(screen.getByRole("button", { name: "Submit self-review" }));
    expect(speaking.mock.calls[0][0]).toMatchObject({ envelope: { kind: "guided_speaking" }, evaluation: { outcome: "correct" } });
  });
  it("lets typed recall recover from a wrong answer", async () => {
    const user = userEvent.setup(); const onSubmit = vi.fn();
    render(<TypedRecallRenderer {...base} prompt="Type tomorrow" answers={["À demain !"]} policy={{ accents: "required", punctuation: "optional" }} onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox", { name: "Type tomorrow" });
    await user.type(input, "Au revoir"); await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(screen.getByRole("button", { name: "Try again" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(input).toHaveValue(""); expect(input).toHaveFocus();
    await user.type(input, "À demain"); await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(screen.getByRole("status")).toHaveTextContent("Correct");
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });
  it("accepts an unaccented equivalent when recall uses a forgiving policy", async () => {
    const user = userEvent.setup(); const onSubmit = vi.fn();
    render(<TypedRecallRenderer {...base} prompt="Type tomorrow" answers={["À demain !"]} policy={{ accents: "forgiving", punctuation: "optional" }} onSubmit={onSubmit} />);
    await user.type(screen.getByRole("textbox", { name: "Type tomorrow" }), "A demain"); await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(screen.getByRole("status")).toHaveTextContent("Correct");
    expect(onSubmit.mock.calls[0][0].evaluation).toMatchObject({ outcome: "correct", matchedAnswer: "À demain !" });
  });
  it("exposes normal and slow audio controls", () => {
    render(<AudioTextSelectRenderer {...base} audio="Bonjour" options={["Bonjour", "Bonsoir"]} answer="Bonjour" onSubmit={() => undefined} />);
    expect(screen.getByRole("button", { name: "Play the hidden French expression" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Play the hidden French expression slowly" })).toBeVisible();
  });
  it("reinforces listening meaning and usage after a correct answer", async () => {
    const user = userEvent.setup();
    render(<AudioTextSelectRenderer {...base} audio="À demain !" options={["Au revoir !", "À demain !"]} answer="À demain !" feedback={{ "À demain !": "À demain means ‘See you tomorrow.’ Use it when leaving someone you will see the next day." }} onSubmit={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "À demain !" }));
    expect(screen.getByRole("status")).toHaveTextContent("See you tomorrow");
    expect(screen.getByRole("status")).toHaveTextContent("when leaving");
  });
  it("provides a transcript fallback for learning but blocks an assessment with missing audio", () => {
    const { rerender } = render(<AudioTextSelectRenderer {...base} audio="Bonjour" audioAvailable={false} options={["Bonjour", "Bonsoir"]} answer="Bonjour" onSubmit={() => undefined} />);
    expect(screen.getByRole("status")).toHaveTextContent("accessible transcript");
    rerender(<AudioTextSelectRenderer {...base} audio="Bonjour" audioAvailable={false} assessment options={["Bonjour", "Bonsoir"]} answer="Bonjour" onSubmit={() => undefined} />);
    expect(screen.getByRole("alert")).toHaveTextContent("assessment item cannot continue");
  });
});
