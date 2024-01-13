"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { z } from "zod";

import type { Category } from "@acme/db/types";
import { Button } from "@acme/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@acme/ui/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/components/ui/form";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

interface Props {
  courseId: string;
  categories: Category[];
  availableCategories: Category[];
}

const formSchema = z.object({
  categories: z.array(z.number()),
});

type FormSchema = z.infer<typeof formSchema>;

export function CategoriesForm({
  courseId,
  categories,
  availableCategories,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((x) => !x);

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      categories: categories.map((x) => x.id),
    },
  });

  const onSubmit = ({ categories }: FormSchema) => {
    console.log(categories);
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <Form form={form} onSubmit={onSubmit} className="mt-4 space-y-4">
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Open</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {availableCategories.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category.id}
                          checked={
                            !!form
                              .watch("categories")
                              .find((x) => x === category.id)
                          }
                          onCheckedChange={(y) => {
                            const categories = form.getValues("categories");
                            if (y) {
                              form.setValue("categories", [
                                ...categories,
                                category.id,
                              ]);
                            } else {
                              form.setValue(
                                "categories",
                                categories.filter((x) => x !== category.id),
                              );
                            }
                          }}
                        >
                          {category.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button
              type="submit"
              // disabled={status === SubmissionStatus.PENDING}
            >
              {/* {status === SubmissionStatus.PENDING && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )} */}
              Save
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
