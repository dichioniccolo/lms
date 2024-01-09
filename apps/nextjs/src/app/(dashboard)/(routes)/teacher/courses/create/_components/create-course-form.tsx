"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/ui/form";
import { Input } from "@acme/ui/components/ui/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import { createCourse } from "~/app/_actions/courses/create-course";
import { RequiredString } from "~/lib/validation";

const FormSchema = z.object({
  title: RequiredString.min(1, {
    message: "Please enter a title for your course",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export function CreateCourseForm() {
  const router = useRouter();
  const { action, status, validationErrors } = useServerAction(createCourse, {
    onSuccess(courseId) {
      toast.success("Course created");
      router.push(`/teacher/courses/${courseId}`);
    },
  });

  const form = useZodForm({
    schema: FormSchema,
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = ({ title }: FormSchemaType) => action({ title });

  return (
    <Form form={form} onSubmit={onSubmit} className="mt-8 space-y-8">
      <FormField<FormSchemaType>
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course title</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 'Advanced web development'" {...field} />
            </FormControl>
            <FormDescription>
              What will you teach in this course?
            </FormDescription>
            <FormMessage>{validationErrors?.title?.[0]}</FormMessage>
          </FormItem>
        )}
      />
      <div className="flex items-center gap-x-2">
        <Button type="submit" disabled={status === SubmissionStatus.PENDING}>
          {status === SubmissionStatus.PENDING && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Continue
        </Button>
      </div>
    </Form>
  );
}
