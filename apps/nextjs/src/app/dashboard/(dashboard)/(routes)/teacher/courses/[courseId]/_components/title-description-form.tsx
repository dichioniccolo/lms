"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { TextareaAutosize } from "@acme/ui/components/textarea-autosize";
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

import { updateCourse } from "~/app/_actions/courses/update-course";
import { RequiredString } from "~/lib/validation";

interface Props {
  courseId: string;
  title: string;
  description: string | null;
}

const formSchema = z.object({
  title: RequiredString,
  description: RequiredString,
});

type FormSchema = z.infer<typeof formSchema>;

export function CourseTitleDescriptionForm({
  courseId,
  title,
  description,
}: Props) {
  const { action, status } = useServerAction(updateCourse, {
    onSuccess() {
      toast.success("Course title and description updated");
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

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
      values: {
        title,
        description,
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course title and description
      </div>
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
          <Button type="submit" disabled={status === SubmissionStatus.PENDING}>
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
