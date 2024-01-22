"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";

import { updateChapter } from "~/app/_actions/chapters/update-chapter";
import { FileUpload } from "~/app/_components/file-upload";
import { RequiredString } from "~/lib/validation";

interface Props {
  courseId: string;
  chapterId: string;
  videoUrl: string | null;
  playbackId: string | null;
}

const formSchema = z.object({
  videoUrl: RequiredString,
});

type FormSchema = z.infer<typeof formSchema>;

export function ChapterVideoForm({
  courseId,
  chapterId,
  videoUrl,
  playbackId,
}: Props) {
  const [editing, setEditing] = useState(false);

  const toggleEdit = () => setEditing((x) => !x);

  const router = useRouter();

  const { action } = useServerAction(updateChapter, {
    onSuccess() {
      toast.success("Chapter video updated");
      router.refresh();
      toggleEdit();
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onSubmit = ({ videoUrl }: FormSchema) =>
    action({
      courseId,
      chapterId,
      values: {
        videoUrl,
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {editing && <>Cancel</>}
          {!editing && !videoUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a video
            </>
          )}
          {!editing && videoUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!editing &&
        (!videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer playbackId={playbackId ?? ""} />
          </div>
        ))}
      {editing && (
        <div>
          <FileUpload
            type="video"
            onChange={({ url }) => onSubmit({ videoUrl: url })}
            accept={{
              "video/*": [],
            }}
            maxFiles={1}
          />
          <div className="text-muted-foreground mt-4 text-xs">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {videoUrl && !editing && (
        <div className="text-muted-foreground mt-2 text-xs">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
}