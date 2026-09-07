import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & { children: ReactNode; title?: string };

export function Card({ children, className = "", title, ...props }: CardProps) {
  return <section className={`v2-card ${className}`.trim()} {...props}>{title && <h2 className="v2-card__title">{title}</h2>}{children}</section>;
}
