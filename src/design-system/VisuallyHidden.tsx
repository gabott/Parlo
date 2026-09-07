import type { HTMLAttributes, ReactNode } from "react";

export function VisuallyHidden({ children, className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return <span className={`v2-visually-hidden ${className}`.trim()} {...props}>{children}</span>;
}
