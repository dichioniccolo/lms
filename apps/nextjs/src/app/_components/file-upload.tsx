import { toast } from "sonner";

import type { OurFileRouter } from "../api/uploadthing/core";
import { UploadDropzone } from "~/lib/uploadthing";

interface Props {
  endpoint: keyof OurFileRouter;
  onChange(url?: string): void;
}

export function FileUpload({ endpoint, onChange }: Props) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(e) => toast.error(e.message)}
    />
  );
}
