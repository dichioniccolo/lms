"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { useServerAction } from "@acme/server-actions/client";
import { cn } from "@acme/ui";

import { completeChapter } from "~/app/_actions/chapters/complete-chapter";
import { useConfetti } from "~/hooks/use-confetti";

interface Props {
  courseId: string;
  chapterId: string;
  playbackId?: string | null;
  title: string;
  locked: boolean;
  nextChapterId?: string | null;
}

export function VideoPlayer({
  courseId,
  chapterId,
  playbackId,
  title,
  locked,
  nextChapterId,
}: Props) {
  const [ready, setReady] = useState(false);
  const confetti = useConfetti();
  const router = useRouter();

  const { action } = useServerAction(completeChapter, {
    onSuccess() {
      if (!nextChapterId) {
        confetti.open();
      }

      router.refresh();

      if (nextChapterId) {
        router.push(`/dashboard/courses/${courseId}/chapters/${nextChapterId}`);
      }
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  return (
    <div className="relative aspect-video">
      {!ready && !locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="text-secondary h-8 w-8 animate-spin" />
        </div>
      )}
      {locked ? (
        <div className="text-secondary absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800">
          <Lock className="h-8 w-8" />
          <p className="text-center">
            You need to purchase this course to unlock this video.
          </p>
        </div>
      ) : (
        <MuxPlayer
          title={title}
          className={cn({
            hidden: !ready,
          })}
          onCanPlay={() => setReady(true)}
          onEnded={() => action({ courseId, chapterId, completed: true })}
          autoPlay
          playbackId={playbackId!}
        />
      )}
    </div>
  );
}
