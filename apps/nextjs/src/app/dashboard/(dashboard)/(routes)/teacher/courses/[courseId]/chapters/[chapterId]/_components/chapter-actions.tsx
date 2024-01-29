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

import { deleteChapter } from "~/app/_actions/chapters/delete-chapter";
import { publishChapter } from "~/app/_actions/chapters/publish-chapter";
import { unpublishChapter } from "~/app/_actions/chapters/unpublish-chapter";

interface Props {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  published: boolean;
}

export function ChapterActions({
  disabled,
  courseId,
  chapterId,
  published,
}: Props) {
  const router = useRouter();

  const { action: publish, status: publishState } = useServerAction(
    publishChapter,
    {
      onSuccess() {
        toast.success("Chapter published");
        router.refresh();
      },
      onServerError(error) {
        error && toast.error(error);
      },
    },
  );
  const { action: unpublish, status: unpublishState } = useServerAction(
    unpublishChapter,
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
    useServerAction(deleteChapter);

  const publishLoading =
    publishState === SubmissionStatus.PENDING ||
    unpublishState === SubmissionStatus.PENDING;

  const onTogglePublishingStatus = async () => {
    if (published) {
      unpublish({ courseId, chapterId });
    } else {
      publish({ courseId, chapterId });
    }
  };

  const onDelete = () =>
    deleteAction({
      courseId,
      chapterId,
    });

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || publishLoading}
        onClick={onTogglePublishingStatus}
      >
        {publishLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {published ? "Unpublished" : "Publish"}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            disabled={deletionStatus === SubmissionStatus.PENDING}
          >
            {deletionStatus === SubmissionStatus.PENDING ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash className="size-4" />
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
