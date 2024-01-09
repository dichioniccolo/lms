"use client";

import { usePathname } from "next/navigation";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";

import { cn } from "@acme/ui";
import { Link } from "@acme/ui/components/link";

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

  const Icon = !purchased ? Lock : isCompleted ? CheckCircle : PlayCircle;

  const isActive = pathname.includes(chapter.id);

  return (
    <Link
      href={`/courses/${courseId}/chapters/${chapter.id}`}
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-medium text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        {
          "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700":
            isActive && !isCompleted,
          "text-emerald-700 hover:text-emerald-700": isCompleted && !isActive,
          "bg-emerald-200/20": isCompleted && isActive,
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
      <span
        className={cn(
          "ml-auto h-full border-2 border-slate-700 opacity-0 transition-all",
          {
            "opacity-100": isActive,
            "border-emerald-700": isCompleted,
          },
        )}
      />
    </Link>
  );
}
