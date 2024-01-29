"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
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

import { updateChapter } from "~/app/_actions/chapters/update-chapter";
import { Editor } from "~/app/_components/editor";
import { RequiredString } from "~/lib/validation";

interface Props {
  courseId: string;
  chapterId: string;
  title: string;
  description: string | null;
}

const formSchema = z.object({
  title: RequiredString,
  description: RequiredString,
});

type FormSchema = z.infer<typeof formSchema>;

export function ChapterTitleDescriptionForm({
  courseId,
  chapterId,
  title,
  description,
}: Props) {
  const router = useRouter();

  const { action, status } = useServerAction(updateChapter, {
    onSuccess() {
      toast.success("Chapter title and description updated");
      router.refresh();
      toggleEdit();
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const [editing, setEditing] = useState(false);

  const toggleEdit = () => setEditing((x) => !x);

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      title,
      description: description ?? "",
    },
  });

  const onSubmit = ({ title, description }: FormSchema) =>
    action({
      courseId,
      chapterId,
      values: {
        title,
        description,
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course title and description
        <Button onClick={toggleEdit} variant="ghost">
          {editing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit title or description
            </>
          )}
        </Button>
      </div>
      {editing && (
        <Form form={form} onSubmit={onSubmit} className="mt-4 space-y-4">
          <FormField<FormSchema>
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g. 'Advanced web development'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<FormSchema>
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button
              type="submit"
              disabled={status === SubmissionStatus.PENDING}
            >
              {status === SubmissionStatus.PENDING && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
