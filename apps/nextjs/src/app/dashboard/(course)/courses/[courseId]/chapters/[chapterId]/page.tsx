import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { Banner } from "@acme/ui/components/banner";
import { Separator } from "@acme/ui/components/ui/separator";

import { getChapter } from "~/app/_api/get-chapter";
import { Preview } from "~/app/_components/editor-preview";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { VideoPlayer } from "./_components/video-player";

interface Props {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default async function Page({ params: { courseId, chapterId } }: Props) {
  const result = await getChapter(courseId, chapterId);

  if (!result) {
    redirect("/dashboard");
  }

  const { course, chapter, mux, attachments, nextChapter, isUnlocked } = result;

  const userProgress = chapter.progresses[0];

  return (
    <div>
      {userProgress?.completed && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {!isUnlocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="mx-auto flex max-w-4xl flex-col pb-20">
        <div className="p-4">
          <VideoPlayer
            courseId={courseId}
            chapterId={chapterId}
            title={chapter.title}
            locked={!isUnlocked}
            playbackId={mux?.playbackId}
            nextChapterId={nextChapter?.id}
          />
        </div>
        <div>
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
            {isUnlocked || userProgress ? (
              <CourseProgressButton
                courseId={courseId}
                chapterId={chapterId}
                nextChapterId={nextChapter?.id}
                completed={userProgress?.completed}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price} />
            )}
          </div>
          <Separator />
          {chapter.description && (
            <div>
              <Preview value={chapter.description} />
            </div>
          )}
          {attachments.length > 0 && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={attachment.id}
                    className="flex w-full items-center rounded-md border bg-sky-200 p-3 text-sky-700 hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
