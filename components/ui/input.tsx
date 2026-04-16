import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-background/92 px-2.5 py-1 text-base shadow-xs transition-[border-color,background-color,box-shadow] outline-none file:-my-1 file:-ml-2.5 file:mr-4 file:inline-flex file:h-[calc(100%+0.5rem)] file:items-center file:self-stretch file:rounded-l-[calc(var(--radius-lg)-1px)] file:border-0 file:border-r file:border-border/70 file:bg-secondary/80 file:px-4 file:py-0 file:text-sm file:font-medium file:leading-none file:text-foreground placeholder:text-muted-foreground/95 hover:border-border focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/45 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:hover:border-border dark:focus-visible:bg-input/40 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
