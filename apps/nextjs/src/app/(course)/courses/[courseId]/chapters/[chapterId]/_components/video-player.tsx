import { useCallback, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@acme/ui";

import { useConfetti } from "~/hooks/use-confetti";

interface Props {
  playbackId: string;
  courseId: string;
  chapterId: string;
  locked: boolean;
  title: string;
}

export function VideoPlayer({ playbackId, title, locked }: Props) {
  const [ready, setReady] = useState(false);
  const confetti = useConfetti();

  const onEnded = useCallback(() => {
    // TODO: Record progress in the backend
    // TODO: Redirect the user to the next chapter if there is one or Show confetti if the user has watched the whole course
  }, []);

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
          onEnded={onEnded}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
}
