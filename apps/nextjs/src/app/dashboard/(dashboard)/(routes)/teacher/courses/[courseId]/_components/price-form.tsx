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
import { formatPrice } from "~/lib/utils";

interface Props {
  courseId: string;
  price: number | null;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export function PriceForm({ courseId, price }: Props) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const { action, status } = useServerAction(updateCourse, {
    onSuccess() {
      toast.success("Course price updated");
      router.refresh();
      toggleEdit();
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      price: price ?? undefined,
    },
  });

  const onSubmit = ({ price }: FormSchema) =>
    action({
      courseId,
      values: {
        price,
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course price
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn("mt-2 text-sm", !price && "italic text-slate-500")}>
          {price ? formatPrice(price) : "No price"}
        </p>
      )}
      {isEditing && (
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
