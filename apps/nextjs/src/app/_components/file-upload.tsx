"use client";

import type { AxiosProgressEvent, CancelTokenSource } from "axios";
import type { DropzoneProps } from "react-dropzone";
import { useCallback, useState } from "react";
import axios from "axios";
import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import Dropzone from "react-dropzone";

import { ProgressBar } from "@acme/ui/components/progress-bar";
import { ScrollArea } from "@acme/ui/components/ui/scroll-area";

import { createPresignedUrl } from "../_actions/files/create-presigned-url";

interface FileUploadProgress {
  progress: number;
  file: File;
  source: CancelTokenSource | null;
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

const colors = {
  image: {
    bgColor: "bg-purple-600",
    fillColor: "fill-purple-600",
  },
  pdf: {
    bgColor: "bg-blue-400",
    fillColor: "fill-blue-400",
  },
  audio: {
    bgColor: "bg-amber-400",
    fillColor: "fill-amber-400",
  },
  video: {
    bgColor: "bg-green-400",
    fillColor: "fill-green-400",
  },
  other: {
    bgColor: "bg-slate-400",
    fillColor: "fill-slate-400",
  },
} satisfies Record<FileTypes, { bgColor: string; fillColor: string }>;

type Props = Pick<DropzoneProps, "accept" | "maxFiles"> & {
  acl: "public" | "private";
  onChange(file: {
    name: string;
    url: string;
    contentType: string;
    contentSize: number;
  }): void;
};

export function FileUpload({ acl, onChange, accept, maxFiles }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filesToUpload, setFilesToupload] = useState<FileUploadProgress[]>([]);

  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return {
        icon: <FileImage size={40} className={colors.image.fillColor} />,
        color: colors.image.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return {
        icon: <File size={40} className={colors.pdf.fillColor} />,
        color: colors.pdf.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Audio)) {
      return {
        icon: <AudioWaveform size={40} className={colors.audio.fillColor} />,
        color: colors.audio.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Video)) {
      return {
        icon: <Video size={40} className={colors.video.fillColor} />,
        color: colors.video.bgColor,
      };
    }

    return {
      icon: <FolderArchive size={40} className={colors.other.fillColor} />,
      color: colors.other.bgColor,
    };
  };

  const getFileType = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return FileTypes.Image;
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return FileTypes.Pdf;
    }

    if (file.type.includes(FileTypes.Audio)) {
      return FileTypes.Audio;
    }

    if (file.type.includes(FileTypes.Video)) {
      return FileTypes.Video;
    }

    return FileTypes.Other;
  };

  const onUploadProgress = (
    progressEvent: AxiosProgressEvent,
    file: File,
    cancelSource: CancelTokenSource,
  ) => {
    const progress = Math.round(
      (progressEvent.loaded / (progressEvent.total ?? 0)) * 100,
    );

    if (progress === 100) {
      setUploadedFiles((prevFiles) => [...prevFiles, file]);

      setFilesToupload((prevFiles) =>
        prevFiles.filter((x) => x.file.name !== file.name),
      );

      return;
    }

    setFilesToupload((prevFiles) =>
      prevFiles.map((x) =>
        x.file.name === file.name
          ? { ...x, progress, source: cancelSource }
          : x,
      ),
    );
  };

  const uploadImageToServer = useCallback(
    async (
      file: File,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
      cancelSource: CancelTokenSource,
    ) => {
      const { url, fields } = await createPresignedUrl(undefined, {
        acl,
        type: getFileType(file),
        contentType: file.type,
      });

      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.post(url, formData, {
        onUploadProgress,
        cancelToken: cancelSource.token,
      });

      onChange({
        name: file.name,
        url: `${url}${fields.key}`,
        contentType: file.type,
        contentSize: file.size,
      });
    },
    [acl, onChange],
  );

  const removeFile = (file: File) => {
    setFilesToupload((prevFiles) =>
      prevFiles.filter((x) => x.file.name !== file.name),
    );

    setUploadedFiles((prevFiles) =>
      prevFiles.filter((x) => x.name !== file.name),
    );
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFilesToupload((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({ progress: 0, file, source: null })),
      ]);

      const fileUploadBatch = acceptedFiles.map((file) => {
        const formData = new FormData();
        formData.append("file", file);

        const cancelSource = axios.CancelToken.source();

        return uploadImageToServer(
          file,
          (event) => onUploadProgress(event, file, cancelSource),
          cancelSource,
        );
      });

      try {
        await Promise.all(fileUploadBatch);
      } catch (e) {
        console.error("Error uploading files: ", e);
      }
    },
    [uploadImageToServer],
  );

  return (
    <div>
      <Dropzone onDrop={onDrop} accept={accept} maxFiles={maxFiles}>
        {({ getRootProps, getInputProps }) => (
          <>
            <div
              {...getRootProps()}
              className="rounded-lglg relative flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 py-6 hover:bg-slate-100"
            >
              <div className="text-center">
                <div className="mx-auto max-w-min rounded-md border p-2">
                  <UploadCloud size={20} />
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold">Drag and drop or</span>
                </p>
                <p className="text-xs text-muted">Click to upload files</p>
              </div>
            </div>

            <input {...getInputProps()} />
          </>
        )}
      </Dropzone>
      {/* <div>
        <label
          {...getRootProps()}
          className="rounded-lglg relative flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 py-6 hover:bg-slate-100"
        >
          <div className="text-center">
            <div className="mx-auto max-w-min rounded-md border p-2">
              <UploadCloud size={20} />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-semibold">Drag and drop or</span>
            </p>
            <p className="text-xs text-muted">Click to upload files</p>
          </div>
        </label>

        <input
          {...getInputProps()}
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={accept} maxFiles={maxFiles}
        />
      </div> */}

      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="my-2 mt-6 text-sm font-medium text-muted-foreground">
              Files to upload
            </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileToUpload, index) => {
                const { icon, color } = getFileIconAndColor(fileToUpload.file);
                return (
                  <div
                    key={index}
                    className="group flex justify-between gap-2 overflow-hidden rounded-lg border border-slate-100 pr-2 hover:pr-0"
                  >
                    <div className="flex flex-1 items-center p-2">
                      <div className="text-white">{icon}</div>
                      <div className="ml-2 w-full space-y-1">
                        <div className="flex justify-between text-sm">
                          <p className="text-muted-foreground">
                            {fileToUpload.file.name.slice(0, 25)}
                          </p>
                          <span className="text-xs">
                            {fileToUpload.progress}%
                          </span>
                        </div>
                        <ProgressBar
                          progress={fileToUpload.progress}
                          className={color}
                        />
                      </div>
                    </div>
                    <button
                      className="hidden cursor-pointer items-center justify-center bg-destructive px-2 text-destructive-foreground transition-all group-hover:flex"
                      onClick={() => {
                        if (fileToUpload.source) {
                          fileToUpload.source.cancel("Upload cancelled");
                        }

                        removeFile(fileToUpload.file);
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div>
          <p className="my-2 mt-6 text-sm font-medium text-muted-foreground">
            Uploaded Files
          </p>
          <div className="space-y-2 pr-3">
            {uploadedFiles.map((file, index) => {
              const { icon } = getFileIconAndColor(file);

              return (
                <div
                  key={index}
                  className="group flex justify-between gap-2 overflow-hidden rounded-lg border border-slate-100 pr-2 hover:pr-0"
                >
                  <div className="flex flex-1 items-center p-2">
                    <div className="text-white">{icon}</div>
                    <div className="ml-2 w-full space-y-1">
                      <div className="flex justify-between text-sm">
                        <p className="text-muted-foreground">
                          {file.name.slice(0, 25)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// type FileStatus = "uploading" | "cancelled" |  "error";

// interface ProgressInfo {
//   status: FileStatus;
//   name: string;
//   progress: number;
//   size: number;
//   abortController?: AbortController;
// }

// type Props = Pick<DropzoneProps, "accept" | "maxFiles"> & {
//   type: "image" | "video" | "other";
//   onChange(file: {
//     name: string;
//     url: string;
//     contentType: string;
//     contentSize: number;
//   }): void;
// };

// export function FileUpload({ type, onChange, accept, maxFiles }: Props) {
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [progresses, setProgresses] = useState<ProgressInfo[]>([]);

//   const updateProgress = useCallback(
//     (index: number, progress: Partial<ProgressInfo>) => {
//       setProgresses((prevProgress) =>
//         prevProgress.map((item, i) =>
//           i === index ? { ...item, ...progress } : item,
//         ),
//       );
//     },
//     [],
//   );

//   const upload = useCallback(
//     async (file: File, index: number) => {
//       try {
//         const { url, fields } = await createPresignedUrl(undefined, {
//           type,
//           contentType: file.type,
//         });

//         const formData = new FormData();
//         Object.entries({ ...fields, file }).forEach(([key, value]) => {
//           formData.append(key, value);
//         });

//         const abortController = new AbortController();

//         await axios.post(url, formData, {
//           signal: abortController.signal,
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / (progressEvent.total ?? 100),
//             );

//             updateProgress(index, {
//               abortController,
//               progress: percentCompleted,
//             });
//           },
//         });

//         onChange({
//           name: file.name,
//           url: `${url}${fields.key}`,
//           contentType: file.type,
//           contentSize: file.size,
//         });
//       } catch (e) {
//         if (e instanceof Error) {
//           if (e.message === "canceled") {
//             toast.success(`Upload of file ${file.name} was cancelled`);
//             updateProgress(index, {
//               status: "cancelled",
//             });
//           } else {
//             updateProgress(index, {
//               status: "error",
//             });
//           }
//         }
//       }
//     },
//     [onChange, type, updateProgress],
//   );

//   const uploadFiles = useCallback(
//     async (files: File[]) => {
//       setSelectedFiles(files);
//       setProgresses(
//         files.map((x) => ({
//           status: "uploading",
//           name: x.name,
//           size: x.size,
//           progress: 0,
//         })),
//       );

//       await Promise.all(files.map(upload));
//     },
//     [upload],
//   );

//   const processingFiles = progresses.filter(
//     (x) => x.status === "uploading" || x.status === "error",
//   );

//   return (
//     <div>
//       {selectedFiles.length === 0 || processingFiles.length === 0 ? (
//         <Dropzone onDrop={uploadFiles} accept={accept} maxFiles={maxFiles}>
//           {({ getRootProps, getInputProps }) => (
//             <div
//               tabIndex={-1}
//               onKeyUp={() => {
//                 //
//               }}
//               role="button"
//               className="flex cursor-pointer flex-col items-center rounded-md border border-dashed border-border p-4"
//               {...getRootProps()}
//             >
//               <input {...getInputProps()} />
//               <UploadCloud size={21} className="mb-2" />

//               <div className="z-10 flex flex-col justify-center gap-y-1 text-center text-xs">
//                 <span>Drag and drop or</span>
//                 <span className="font-semibold">browse</span>
//               </div>
//             </div>
//           )}
//         </Dropzone>
//       ) : (
//         processingFiles.map((progress, index) => (
//           <div key={index} className="border-b px-4 py-2 first:border-t">
//             <div className="mb-2 flex items-center justify-between">
//               <div className="flex items-center gap-x-3">
//                 <div>
//                   <p className="text-sm font-medium text-gray-800 dark:text-white">
//                     {progress.name}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-500">
//                     {humanFileSize(progress.size)}
//                   </p>
//                 </div>
//               </div>
//               <div className="inline-flex items-center gap-x-2">
//                 {progress.status === "error" && (
//                   <AlertTriangle className="text-red-500" />
//                 )}
//                 <button
//                   disabled={progress.status === "cancelled"}
//                   onClick={() => progress.abortController?.abort()}
//                 >
//                   <Trash className="size-4 text-red-500" />
//                 </button>
//               </div>
//             </div>
//             <div className="flex items-center gap-x-3 whitespace-nowrap">
//               <div
//                 className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
//                 role="progressbar"
//                 aria-valuenow={progress.progress}
//                 aria-valuemin={0}
//                 aria-valuemax={100}
//               >
//                 <div
//                   className="flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-teal-500 text-center text-xs text-white transition duration-500"
//                   style={{
//                     width: `${progress.progress}%`,
//                   }}
//                 ></div>
//               </div>
//               <div className="w-6 text-end">
//                 <span className="text-sm text-gray-800 dark:text-white">
//                   {progress.progress}%
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
