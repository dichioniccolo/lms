import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { Banner } from "@acme/ui/components/banner";

import { getVideoUrl } from "~/app/_actions/courses/get-video-url";
import { getChapter } from "~/app/_api/teacher/get-chapter";
import { IconBadge } from "~/app/_components/icon-badge";
import { ChapterAccessForm } from "./_components/access-form";
import { ChapterActions } from "./_components/chapter-actions";
import { ChapterTitleDescriptionForm } from "./_components/title-description-form";
import { ChapterVideoForm } from "./_components/video-form";

interface Props {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default async function Page({ params: { courseId, chapterId } }: Props) {
  const { data: chapter } = await getChapter({ courseId, chapterId });

  if (!chapter) {
    redirect("/dashboard");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const isComplete = requiredFields.every(Boolean);

  const { data: videoUrl } = await getVideoUrl({ chapterId, courseId });

  return (
    <>
      {!chapter.published && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/teacher/courses/${courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields ({completedFields}/{totalFields})
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                published={chapter.published}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <ChapterTitleDescriptionForm
                chapterId={chapter.id}
                courseId={courseId}
                title={chapter.title}
                description={chapter.description}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccessForm
                chapterId={chapter.id}
                courseId={courseId}
                free={chapter.free}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>
            <ChapterVideoForm
              chapterId={chapter.id}
              courseId={courseId}
              videoUrl={videoUrl}
            />
          </div>
        </div>
      </div>
    </>
  );
}
