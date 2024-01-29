"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/components/ui/button";
import { Checkbox } from "@acme/ui/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@acme/ui/components/ui/form";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updateChapter } from "~/app/_actions/chapters/update-chapter";

interface Props {
  courseId: string;
  chapterId: string;
  free: boolean;
}

const formSchema = z.object({
  free: z.coerce.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

export function ChapterAccessForm({ courseId, chapterId, free }: Props) {
  const router = useRouter();

  const { action, status } = useServerAction(updateChapter, {
    onSuccess() {
      toast.success("Chapter updated");
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
      free,
    },
  });

  const onSubmit = ({ free }: FormSchema) =>
    action({
      courseId,
      chapterId,
      values: {
        free,
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter access
        <Button onClick={toggleEdit} variant="ghost">
          {editing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit access
            </>
          )}
        </Button>
      </div>
      {!editing && (
        <p className={cn("mt-2 text-sm", !free && "italic text-slate-500")}>
          {free ? (
            <>This chapter is free for preview.</>
          ) : (
            <>This chapter is not free.</>
          )}
        </p>
      )}
      {editing && (
        <Form form={form} onSubmit={onSubmit} className="mt-4 space-y-4">
          <FormField<FormSchema>
            name="free"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription>
                    Check this box if you want to make this chapter free for
                    preview
                  </FormDescription>
                </div>
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
