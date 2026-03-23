import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-border bg-input text-primary accent-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60",
        className,
      )}
      {...props}
    />
  );
}
