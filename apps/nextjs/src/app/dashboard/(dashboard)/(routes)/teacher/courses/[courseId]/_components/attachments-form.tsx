"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

import type { Attachment } from "@acme/db/types";
import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";

import { createAttachment } from "~/app/_actions/courses/create-attachment";
import { deleteAttachment } from "~/app/_actions/courses/delete-attachment";
import { FileUpload } from "~/app/_components/file-upload";

interface Props {
  courseId: string;
  attachments: Attachment[];
}

export function AttachmentsForm({ courseId, attachments }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((x) => !x);

  const router = useRouter();

  const { action } = useServerAction(createAttachment, {
    onSuccess() {
      toast.success("Attachment uploaded");
      router.refresh();
      toggleEdit();
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onSubmit = ({ name, url }: { name: string; url: string }) =>
    action({
      courseId,
      name,
      url,
    });

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {attachments.length === 0 && (
            <p className="mt-2 text-sm italic text-slate-500">
              No attachments yet
            </p>
          )}
          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <AttachmentForm
                  key={attachment.id}
                  courseId={courseId}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            type="other"
            onChange={({ name, url }) => onSubmit({ name, url })}
          />
          <div className="text-muted-foreground mt-4 text-xs">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
}

interface AttachmentProps {
  courseId: string;
  attachment: Attachment;
}

export function AttachmentForm({ courseId, attachment }: AttachmentProps) {
  const router = useRouter();

  const { action, status } = useServerAction(deleteAttachment, {
    onSuccess() {
      toast.success("Attachment deleted");
      router.refresh();
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onSubmit = () =>
    action({
      courseId,
      id: attachment.id,
    });

  return (
    <div className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700">
      <File className="mr-2 h-4 w-4 flex-shrink-0" />
      <p className="line-clamp-1 text-xs">{attachment.name}</p>
      {status === SubmissionStatus.PENDING && (
        <div className="ml-2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      <button
        onClick={onSubmit}
        className="ml-auto transition hover:opacity-75"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
