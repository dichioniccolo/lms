"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Pencil, PlusCircle, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";

import { updateChapter } from "~/app/_actions/chapters/update-chapter";
import { FileUpload } from "~/app/_components/file-upload";
import { RequiredString } from "~/lib/validation";

const Video = dynamic(
  () => import("~/app/_components/video").then((mod) => mod.Video),
  {
    ssr: false,
  },
);

interface Props {
  courseId: string;
  chapterId: string;
  videoUrl: string | null;
}

const formSchema = z.object({
  videoUrl: RequiredString,
  videoContentType: RequiredString,
  videoContentLength: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export function ChapterVideoForm({ courseId, chapterId, videoUrl }: Props) {
  const [editing, setEditing] = useState(!videoUrl);

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

  const onSubmit = ({
    videoUrl,
    videoContentLength,
    videoContentType,
  }: FormSchema) =>
    action({
      courseId,
      chapterId,
      values: {
        videoUrl,
        videoContentLength,
        videoContentType,
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {editing && videoUrl && <>Cancel</>}
          {!editing && !videoUrl && (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add a video
            </>
          )}
          {!editing && videoUrl && (
            <>
              <Pencil className="mr-2 size-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!editing &&
        (!videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <VideoIcon className="size-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Video src={videoUrl} />
          </div>
        ))}
      {editing && (
        <div>
          <FileUpload
            type="video"
            onChange={({ url, contentSize, contentType }) =>
              onSubmit({
                videoUrl: url,
                videoContentType: contentType,
                videoContentLength: contentSize,
              })
            }
            accept={{
              "video/*": [],
            }}
            maxFiles={1}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {videoUrl && !editing && (
        <div className="mt-2 text-xs text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
}
