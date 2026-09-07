import type { ReactNode } from "react";

type FeedbackProps = { children: ReactNode; title: string; tone?: "success" | "error" | "info" };

export function Feedback({ children, title, tone = "info" }: FeedbackProps) {
  const liveRole = tone === "error" ? "alert" : "status";
  return <div className={`v2-feedback v2-feedback--${tone}`} role={liveRole}>
    <strong className="v2-feedback__title">{title}</strong><span>{children}</span>
  </div>;
}
