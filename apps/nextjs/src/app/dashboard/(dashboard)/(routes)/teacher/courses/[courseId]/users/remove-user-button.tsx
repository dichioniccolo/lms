"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@acme/ui/components/ui/alert-dialog";
import { Button } from "@acme/ui/components/ui/button";

import { removeUser } from "~/app/_actions/courses/remove-user";

interface Props {
  courseId: string;
  userId: string;
}

export function RemoveUserButton({ courseId, userId }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { action, status } = useServerAction(removeUser, {
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={status === SubmissionStatus.PENDING}
        >
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove the invited user?
          </AlertDialogTitle>
        </AlertDialogHeader>
        This action cannot be undone
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              action({
                courseId,
                userId,
              });
            }}
          >
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
