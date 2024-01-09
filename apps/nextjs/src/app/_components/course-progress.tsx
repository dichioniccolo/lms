import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "@acme/ui";
import { Progress } from "@acme/ui/components/ui/progress";

const colorVariants = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const backgroundColorVariants: Record<keyof typeof colorVariants, string> = {
  default: "bg-sky-700",
  success: "bg-emerald-700",
};

const sizeVariants = {
  default: "text-sm",
  sm: "text-xs",
};

const courseProgressVariants = cva("font-medium mt-2 text-sky-700", {
  variants: {
    variant: colorVariants,
    size: sizeVariants,
  },
});

type Props = {
  value: number;
} & VariantProps<typeof courseProgressVariants>;

export function CourseProgress({ value, variant, size }: Props) {
  return (
    <div>
      <Progress
        className={cn("h-2", backgroundColorVariants[variant ?? "default"])}
        value={value}
      />
      <p
        className={cn(
          courseProgressVariants({
            variant,
            size,
          }),
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
}
