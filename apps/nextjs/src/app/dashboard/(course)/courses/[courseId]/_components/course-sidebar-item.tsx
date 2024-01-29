"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";

import { cn } from "@acme/ui";

interface Props {
  courseId: string;
  chapter: {
    id: string;
    title: string;
    free: boolean;
    progresses:
      | {
          completed: boolean;
        }[]
      | undefined;
  };
  purchased: boolean;
}

export function CourseSidebarItem({ purchased, courseId, chapter }: Props) {
  const pathname = usePathname();

  const isCompleted = chapter.progresses?.[0]?.completed;

  const Icon = isCompleted ? CheckCircle : !purchased ? Lock : PlayCircle;

  const isActive = pathname.includes(chapter.id);

  return (
    <Link
      href={`/dashboard/courses/${courseId}/chapters/${chapter.id}`}
      className={cn(
        "flex items-center gap-x-2 py-4 pl-6 text-sm font-medium text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        {
          "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700":
            isActive && !isCompleted,
          "text-emerald-700 hover:text-emerald-700": isCompleted && !isActive,
          "bg-emerald-200/20": isCompleted && isActive,
          "border-r-4 border-slate-700 transition-all": isActive,
          "border-r-4 border-emerald-700 transition-all": isCompleted,
        },
      )}
    >
      <span className="flex items-center gap-x-2">
        <Icon
          size={22}
          className={cn("text-slate-50", {
            "text-slate-700": isActive,
            "text-emerald-700": isCompleted,
          })}
        />
        {chapter.title}
      </span>
    </Link>
  );
}
