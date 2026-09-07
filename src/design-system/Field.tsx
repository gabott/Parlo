import { useId } from "react";
import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { error?: string; hint?: string; label: string };

export function Field({ error, hint, id: providedId, label, ...props }: FieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return <div className="v2-field">
    <label className="v2-field__label" htmlFor={id}>{label}</label>
    {hint && <p className="v2-field__hint" id={hintId}>{hint}</p>}
    <input className="v2-field__control" id={id} aria-describedby={describedBy} aria-invalid={Boolean(error)} {...props} />
    {error && <p className="v2-field__error" id={errorId}>{error}</p>}
  </div>;
}
