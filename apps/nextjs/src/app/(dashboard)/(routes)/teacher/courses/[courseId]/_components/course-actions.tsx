"use client";

import { useRouter } from "next/navigation";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@acme/ui/components/ui/alert-dialog";
import { Button } from "@acme/ui/components/ui/button";

import { deleteCourse } from "~/app/_actions/courses/delete-course";
import { publishCourse } from "~/app/_actions/courses/publish-course";
import { unpublishCourse } from "~/app/_actions/courses/unpublish-course";
import { useConfetti } from "~/hooks/use-confetti";

interface Props {
  courseId: string;
  disabled: boolean;
  published: boolean;
}

export function CourseActions({ courseId, disabled, published }: Props) {
  const confetti = useConfetti();
  const router = useRouter();

  const { action: publish, status: publishState } = useServerAction(
    publishCourse,
    {
      onSuccess() {
        confetti.open();
        router.refresh();
      },
      onServerError(error) {
        error && toast.error(error);
      },
    },
  );
  const { action: unpublish, status: unpublishState } = useServerAction(
    unpublishCourse,
    {
      onSuccess() {
        toast.success("Course unpublished");
        router.refresh();
      },
      onServerError(error) {
        error && toast.error(error);
      },
    },
  );

  const { action: deleteAction, status: deletionStatus } =
    useServerAction(deleteCourse);

  const publishLoading =
    publishState === SubmissionStatus.PENDING ||
    unpublishState === SubmissionStatus.PENDING;

  const onTogglePublishingStatus = async () => {
    if (published) {
      unpublish({ courseId });
    } else {
      publish({ courseId });
    }
  };

  const onDelete = () =>
    deleteAction({
      courseId,
    });

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || publishLoading}
        onClick={onTogglePublishingStatus}
      >
        {publishLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {published ? "Unpublished" : "Publish"}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            disabled={deletionStatus === SubmissionStatus.PENDING}
          >
            {deletionStatus === SubmissionStatus.PENDING ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
