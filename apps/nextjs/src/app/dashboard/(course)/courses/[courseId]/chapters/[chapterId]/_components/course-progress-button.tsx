"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";

import { completeChapter } from "~/app/_actions/chapters/complete-chapter";
import { useConfetti } from "~/hooks/use-confetti";

interface Props {
  courseId: string;
  chapterId: string;
  completed?: boolean;
  nextChapterId?: string | null;
}

export function CourseProgressButton({
  courseId,
  chapterId,
  completed,
  nextChapterId,
}: Props) {
  const router = useRouter();

  const confetti = useConfetti();
  const { action, status } = useServerAction(completeChapter, {
    onSuccess() {
      if (!nextChapterId) {
        confetti.open();
      }

      toast.success("Aggiornato con successo");

      router.refresh();
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const Icon = completed ? XCircle : CheckCircle;

  return (
    <Button
      onClick={() =>
        action({
          courseId,
          chapterId,
          completed: !completed,
        })
      }
      disabled={status === SubmissionStatus.PENDING}
      variant={completed ? "outline" : "default"}
      className="w-full md:w-auto"
    >
      {completed ? "Imposta come incompleto" : "Imposta come completato"}
      <Icon className="ml-2 size-4" />
    </Button>
  );
}
