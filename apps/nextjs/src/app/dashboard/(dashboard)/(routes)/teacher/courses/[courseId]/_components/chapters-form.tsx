"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import type { Chapter } from "@acme/db/types";
import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/components/ui/form";
import { Input } from "@acme/ui/components/ui/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { createChapter } from "~/app/_actions/chapters/create-chapter";
import { courseReorder } from "~/app/_actions/courses/course-reorder";
import { RequiredString } from "~/lib/validation";
import { ChaptersList } from "./chapters-list";

interface Props {
  courseId: string;
  chapters: Chapter[];
}

const formSchema = z.object({
  title: RequiredString,
});

type FormSchema = z.infer<typeof formSchema>;

export function ChaptersForm({ courseId, chapters }: Props) {
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => setIsCreating((x) => !x);

  const router = useRouter();

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      title: "",
    },
  });

  const { action: create, status: creationStatus } = useServerAction(
    createChapter,
    {
      onSuccess() {
        toast.success("Chapter created");
        router.refresh();
        form.setValue("title", "");
        toggleCreating();
      },
      onServerError(error) {
        error && toast.error(error);
      },
    },
  );

  const { action: reorder, status: reorderStatus } = useServerAction(
    courseReorder,
    {
      onSuccess() {
        toast.success("Chapters reordered");
      },
      onServerError(error) {
        error && toast.error(error);
      },
    },
  );

  const onSubmit = ({ title }: FormSchema) =>
    create({
      courseId,
      title,
    });

  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4">
      {reorderStatus === SubmissionStatus.PENDING && (
        <div className="rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form form={form} onSubmit={onSubmit} className="mt-4 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g. 'Introduction to the course'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={creationStatus === SubmissionStatus.PENDING}
          >
            {creationStatus === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",
            !chapters.length && "italic text-slate-500",
          )}
        >
          {!chapters.length && "No chapters"}
          <ChaptersList courseId={courseId} items={chapters} action={reorder} />
        </div>
      )}
      {!isCreating && (
        <p className="text-muted-foreground mt-4 text-xs">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
}
