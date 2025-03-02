"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { useServerAction } from "@acme/server-actions/client";
import { useMounted } from "@acme/ui/hooks/use-mounted";

import { completeChapter } from "~/app/_actions/chapters/complete-chapter";

const Video = dynamic(
  () => import("~/app/_components/video").then((mod) => mod.Video),
  {
    ssr: false,
  },
);

interface Props {
  courseId: string;
  chapterId: string;
  title: string;
  videoUrl?: string | null;
  locked: boolean;
  nextChapterId?: string | null;
}

export function VideoPlayer({
  courseId,
  chapterId,
  videoUrl,
  locked,
  nextChapterId,
}: Props) {
  const router = useRouter();

  const { action } = useServerAction(completeChapter, {
    onSuccess() {
      // if (!nextChapterId) {
      //   confetti.open();
      // }

      router.refresh();

      if (nextChapterId) {
        router.push(`/dashboard/courses/${courseId}/chapters/${nextChapterId}`);
      }
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const mounted = useMounted();

  return (
    <div className="relative min-h-60">
      {!mounted && !locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="size-8 animate-spin text-secondary" />
        </div>
      )}
      {mounted && (
        <>
          {locked || !videoUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
              <Lock className="size-8" />
              <p className="text-center">
                Devi comprare il corso per essere abilitato a visualizzare il
                video.
              </p>
            </div>
          ) : (
            <Video
              src={videoUrl}
              onCompleted={() =>
                action({
                  courseId,
                  chapterId,
                  completed: true,
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}
