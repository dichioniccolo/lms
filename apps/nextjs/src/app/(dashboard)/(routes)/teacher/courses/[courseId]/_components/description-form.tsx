"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { cn } from "@acme/ui";
import { TextareaAutosize } from "@acme/ui/components/textarea-autosize";
import { Button } from "@acme/ui/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/components/ui/form";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { updateCourse } from "~/app/_actions/courses/update-course";
import { RequiredString } from "~/lib/validation";

interface Props {
  courseId: string;
  description: string | null;
}

const formSchema = z.object({
  description: RequiredString,
});

type FormSchema = z.infer<typeof formSchema>;

export function DescriptionForm({ courseId, description }: Props) {
  const router = useRouter();

  const { action, status } = useServerAction(updateCourse, {
    onSuccess() {
      toast.success("Course description updated");
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
      description: description ?? "",
    },
  });

  const onSubmit = ({ description }: FormSchema) =>
    action({
      courseId,
      values: {
        description: description ?? "",
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course description
        <Button onClick={toggleEdit} variant="ghost">
          {editing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {editing && (
        <p
          className={cn("mt-2 text-sm", {
            "text-slate-5000 italic": !description,
          })}
        >
          {description ?? "No description"}
        </p>
      )}
      {editing && (
        <Form form={form} onSubmit={onSubmit} className="mt-4 space-y-4">
          <FormField<FormSchema>
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    placeholder="e.g. 'This course is about....'"
                    {...field}
                  />
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
