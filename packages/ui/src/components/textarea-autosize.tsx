import type { TextareaAutosizeProps as ReactTextareaAutosizeProps } from "react-textarea-autosize";
import React from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

import { cn } from "../lib/utils";

export type TextareaAutosizeProps = ReactTextareaAutosizeProps;

const TextareaAutosize = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(({ className, ...props }, ref) => {
  return (
    <ReactTextareaAutosize
      className={cn(
        "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

TextareaAutosize.displayName = "TextareaAutosize";

export { TextareaAutosize };
