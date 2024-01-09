import type { LucideIcon } from "lucide-react";

import { IconBadge } from "~/app/_components/icon-badge";

interface Props {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export function InfoCard({ label, icon, variant, numberOfItems }: Props) {
  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3">
      <IconBadge variant={variant} icon={icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
}
