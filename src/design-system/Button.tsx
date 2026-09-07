import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ children, className = "", type = "button", variant = "primary", ...props }: ButtonProps) {
  return <button className={`v2-button v2-button--${variant} ${className}`.trim()} type={type} {...props}>{children}</button>;
}
