"use client";

import type { DropzoneProps } from "react-dropzone";
import { useCallback, useState } from "react";
import axios from "axios";
import { AlertTriangle, Trash, UploadCloud } from "lucide-react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

import { humanFileSize } from "~/lib/utils";
import { createPresignedUrl } from "../_actions/files/create-presigned-url";

type FileStatus = "uploading" | "cancelled" | "error";

interface ProgressInfo {
  status: FileStatus;
  name: string;
  progress: number;
  size: number;
  abortController?: AbortController;
}

type Props = Pick<DropzoneProps, "accept" | "maxFiles"> & {
  type: "image" | "video" | "other";
  onChange(file: { name: string; url: string }): void;
};

export function FileUpload({ type, onChange, accept, maxFiles }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progresses, setProgresses] = useState<ProgressInfo[]>([]);

  const updateProgress = useCallback(
    (index: number, progress: Partial<ProgressInfo>) => {
      setProgresses((prevProgress) =>
        prevProgress.map((item, i) =>
          i === index ? { ...item, ...progress } : item,
        ),
      );
    },
    [],
  );

  const upload = useCallback(
    async (file: File, index: number) => {
      try {
        const { url, fields } = await createPresignedUrl(undefined, {
          type,
          contentType: file.type,
        });

        const formData = new FormData();
        Object.entries({ ...fields, file }).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const abortController = new AbortController();

        await axios.post(url, formData, {
          signal: abortController.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 100),
            );

            updateProgress(index, {
              abortController,
              progress: percentCompleted,
            });
          },
        });

        onChange({
          name: file.name,
          url: `${url}${fields.key}`,
        });
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "canceled") {
            toast.success(`Upload of file ${file.name} was cancelled`);
            updateProgress(index, {
              status: "cancelled",
            });
          } else {
            updateProgress(index, {
              status: "error",
            });
          }
        }
      }
    },
    [onChange, type, updateProgress],
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      setSelectedFiles(files);
      setProgresses(
        files.map((x) => ({
          status: "uploading",
          name: x.name,
          size: x.size,
          progress: 0,
        })),
      );

      await Promise.all(files.map(upload));
    },
    [upload],
  );

  const processingFiles = progresses.filter(
    (x) => x.status === "uploading" || x.status === "error",
  );

  return (
    <div>
      {selectedFiles.length === 0 || processingFiles.length === 0 ? (
        <Dropzone onDrop={uploadFiles} accept={accept} maxFiles={maxFiles}>
          {({ getRootProps, getInputProps }) => (
            <div
              tabIndex={-1}
              onKeyUp={() => {
                //
              }}
              role="button"
              className="border-border flex cursor-pointer flex-col items-center rounded-md border border-dashed p-4"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <UploadCloud size={21} className="mb-2" />

              <div className="z-10 flex flex-col justify-center gap-y-1 text-center text-xs">
                <span>Drag and drop or</span>
                <span className="font-semibold">browse</span>
              </div>
            </div>
          )}
        </Dropzone>
      ) : (
        processingFiles.map((progress, index) => (
          <div key={index} className="border-b px-4 py-2 first:border-t">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {progress.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {humanFileSize(progress.size)}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-x-2">
                {progress.status === "error" && (
                  <AlertTriangle className="text-red-500" />
                )}
                <button
                  disabled={progress.status === "cancelled"}
                  onClick={() => progress.abortController?.abort()}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <div
                className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                role="progressbar"
                aria-valuenow={progress.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-teal-500 text-center text-xs text-white transition duration-500"
                  style={{
                    width: `${progress.progress}%`,
                  }}
                ></div>
              </div>
              <div className="w-6 text-end">
                <span className="text-sm text-gray-800 dark:text-white">
                  {progress.progress}%
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
