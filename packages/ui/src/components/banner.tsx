import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";

import { cn } from "..";

const bannerVariants = cva(
  "flex w-full items-center border p-4 text-center text-sm",
  {
    variants: {
      variant: {
        warning: "border-yellow-50 bg-yellow-200/80 text-primary",
        success: "border-emerald-800 bg-emerald-700 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  },
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant ?? "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="mr-2 size-4" />
      {label}
    </div>
  );
};
