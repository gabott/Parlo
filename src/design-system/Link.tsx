import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

type LinkProps = { children: ReactNode; className?: string; to: string; variant?: "text" | "button" };

export function Link({ children, className = "", to, variant = "text" }: LinkProps) {
  return <RouterLink className={`v2-link v2-link--${variant} ${className}`.trim()} to={to}>{children}</RouterLink>;
}
