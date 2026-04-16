import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

type HelpTooltipProps = {
  content: string;
  label?: string;
  className?: string;
  side?: "top" | "bottom";
  align?: "left" | "right";
};

export function HelpTooltip({
  content,
  label = "Ver ayuda",
  className,
  side = "bottom",
  align = "right",
}: HelpTooltipProps) {
  const positionClassName =
    side === "top"
      ? "bottom-[calc(100%+0.5rem)]"
      : "top-[calc(100%+0.5rem)]";
  const alignClassName = align === "left" ? "left-0" : "right-0";

  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      <button
        type="button"
        aria-label={label}
        className="inline-flex size-7 items-center justify-center rounded-full border border-border/80 bg-background/90 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        <CircleHelp className="size-4" />
      </button>

      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-[80] w-64 rounded-[1rem] border border-border/80 bg-popover px-3 py-2 text-left text-xs leading-5 text-popover-foreground opacity-0 shadow-[0_20px_50px_-30px_rgba(56,44,32,0.45)] transition duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          positionClassName,
          alignClassName,
        )}
      >
        {content}
      </span>
    </span>
  );
}
