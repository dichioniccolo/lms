"use client";

import type { DropResult } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import type { Chapter } from "@acme/db/types";
import { cn } from "@acme/ui";
import { Link } from "@acme/ui/components/link";
import { Badge } from "@acme/ui/components/ui/badge";
import { useMounted } from "@acme/ui/hooks/use-mounted";

interface Props {
  courseId: string;
  items: Chapter[];
  action(x: {
    courseId: string;
    list: { id: string; position: number }[];
  }): void;
}

export function ChaptersList({ courseId, items, action }: Props) {
  const isMounted = useMounted();
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setChapters(
      items.toSorted((a, b) => (a.position ?? 9999) - (b.position ?? 9999)),
    );
  }, [items]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const items = Array.from(chapters);

      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem!);

      const startIndex = Math.min(
        result.source.index,
        result.destination.index,
      );
      const endIndex = Math.max(result.source.index, result.destination.index);

      const updatedChapters = items.slice(startIndex, endIndex + 1);

      setChapters(items);

      const bulkUpdateData = updatedChapters.map((chapter) => ({
        id: chapter.id,
        position: items.findIndex((x) => x.id === chapter.id) + 1,
      }));

      action({
        courseId,
        list: bulkUpdateData,
      });
    },
    [action, chapters, courseId],
  );

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700",
                      chapter.published &&
                        "border-sky-200 bg-sky-100 text-sky-700",
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300",
                        chapter.published &&
                          "border-r-sky-200 hover:bg-sky-200",
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="size-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {chapter.free && <Badge>Free</Badge>}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          chapter.published && "bg-sky-700",
                        )}
                      >
                        {chapter.published ? "Published" : "Draft"}
                      </Badge>
                      <Link
                        href={`/dashboard/teacher/courses/${courseId}/chapters/${chapter.id}`}
                      >
                        <Pencil className="size-4 cursor-pointer transition hover:opacity-75" />
                      </Link>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
