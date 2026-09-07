import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AudioControl, Button, Card, Feedback, Field, Link, Progress, VisuallyHidden } from "../../../src/design-system";

function renderPrimitives() {
  return render(<MemoryRouter><main>
    <Card title="Practice controls">
      <Field label="Answer" hint="Use one word." error="Try again." />
      <Progress label="Lesson progress" value={2} max={4} />
      <Feedback title="Correct" tone="success">That answer is right.</Feedback>
      <Button>Continue</Button>
      <Link to="/learn">Back to Learn</Link>
      <AudioControl label="Play phrase" onPlay={() => undefined} />
      <VisuallyHidden>Extra context</VisuallyHidden>
    </Card>
  </main></MemoryRouter>);
}

describe("design-system primitives", () => {
  it("connects field labels, hints, and errors", () => {
    renderPrimitives();
    const field = screen.getByRole("textbox", { name: "Answer" });
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("Use one word. Try again.");
  });

  it("exposes progress and feedback without relying on color", () => {
    renderPrimitives();
    expect(screen.getByRole("progressbar", { name: "Lesson progress" })).toHaveAttribute("aria-valuetext", "50%");
    expect(screen.getByRole("status")).toHaveTextContent("CorrectThat answer is right.");
  });

  it("supports activation and native disabled behavior", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Continue</Button>);
    await user.tab();
    expect(screen.getByRole("button", { name: "Continue" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<Button disabled onClick={onClick}>Continue</Button>);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("runs the primitive collection without automated accessibility violations", async () => {
    const { container } = renderPrimitives();
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });
});
