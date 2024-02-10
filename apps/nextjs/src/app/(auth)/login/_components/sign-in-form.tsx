"use client";

import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/components/ui/form";
import { Input } from "@acme/ui/components/ui/input";
import { Form } from "@acme/ui/components/zod-form";
import { useZodForm } from "@acme/ui/hooks/use-zod-form";

import type { UserAuthSchemaType } from "~/lib/validation";
import { login } from "~/app/_actions/users/login";
import { UserAuthSchema } from "~/lib/validation";

export function SignInForm() {
  const searchParams = useSearchParams();

  const { action, status } = useServerAction(login, {
    onSuccess() {
      toast.success("We sent you a login link. Be sure to check your spam too");
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onSubmit = ({ email }: UserAuthSchemaType) =>
    action({
      email,
      callbackUrl: searchParams?.get("redirect") ?? "/dashboard",
    });

  const form = useZodForm({
    schema: UserAuthSchema,
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="grid gap-2">
        <FormField<UserAuthSchemaType>
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={status === SubmissionStatus.PENDING}>
          {status === SubmissionStatus.PENDING && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          Sign In with Email
        </Button>
      </div>
    </Form>
  );
}
