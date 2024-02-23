"use client";

import { Loader2 } from "lucide-react";
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

import { updateCourse } from "~/app/_actions/courses/update-course";

interface Props {
  courseId: string;
  price: string | null;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export function PriceForm({ courseId, price }: Props) {
  const { action, status } = useServerAction(updateCourse, {
    onSuccess() {
      toast.success("Course price updated");
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      price: parseFloat(price ?? "0"),
    },
  });

  const onSubmit = ({ price }: FormSchema) =>
    action({
      courseId,
      values: {
        price: price.toString(),
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course price
      </div>
      <Form form={form} onSubmit={onSubmit} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Set a price for your course"
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
