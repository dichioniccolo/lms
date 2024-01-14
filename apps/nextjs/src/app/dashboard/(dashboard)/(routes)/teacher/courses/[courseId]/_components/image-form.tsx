"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { useServerAction } from "@acme/server-actions/client";
import { Image } from "@acme/ui/components/image";
import { Button } from "@acme/ui/components/ui/button";

import { updateCourse } from "~/app/_actions/courses/update-course";
import { FileUpload } from "~/app/_components/file-upload";

interface Props {
  courseId: string;
  imageUrl: string | null;
}

export function ImageForm({ courseId, imageUrl }: Props) {
  const router = useRouter();

  const { action } = useServerAction(updateCourse, {
    onSuccess() {
      toast.success("Course image updated");
      router.refresh();
      toggleEdit();
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const [editing, setEditing] = useState(false);

  const toggleEdit = () => setEditing((x) => !x);

  const onSubmit = ({ url }: { name: string; url: string }) =>
    action({
      courseId,
      values: {
        imageUrl: url,
      },
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {editing && "Cancel"}
          {!editing && !imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}
          {!editing && imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!editing &&
        (!imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={imageUrl}
            />
          </div>
        ))}
      {editing && (
        <div>
          <FileUpload
            type="image"
            onChange={onSubmit}
            accept={{
              "image/*": [],
            }}
            maxFiles={1}
          />
          <div className="text-muted-foreground mt-4 text-xs">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}
