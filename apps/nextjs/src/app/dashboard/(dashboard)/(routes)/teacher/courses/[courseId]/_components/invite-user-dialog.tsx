import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/components/ui/dialog";
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

import { inviteUser } from "~/app/_actions/courses/invite-user";
import { RequiredEmail } from "~/lib/validation";

const InviteUserSchema = z.object({
  email: RequiredEmail,
});

type InviteUserSchema = z.infer<typeof InviteUserSchema>;

interface Props {
  courseId: string;
}

export function InviteUserDialog({
  courseId,
  children,
}: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);

  const { action, status, validationErrors } = useServerAction(inviteUser, {
    onSuccess: () => {
      toast.success("User invited");
      setOpen(false);
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onSubmit = ({ email }: InviteUserSchema) =>
    action({
      courseId,
      email,
    });

  const form = useZodForm({
    schema: InviteUserSchema,
    defaultValues: {
      email: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>Invite a user to the course.</DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 text-left"
        >
          <FormField<InviteUserSchema>
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="user@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{validationErrors?.email?.[0]}</FormMessage>
              </FormItem>
            )}
          />
          <Button disabled={status === SubmissionStatus.PENDING}>
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Invite
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
