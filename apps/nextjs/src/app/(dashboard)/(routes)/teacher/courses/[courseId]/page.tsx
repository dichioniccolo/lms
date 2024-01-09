import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { and, asc, db, eq, schema } from "@acme/db";
import { Banner } from "@acme/ui/components/banner";

import { getCurrentUser } from "~/app/_api/get-user";
import { IconBadge } from "~/app/_components/icon-badge";
import { CourseActions } from "./_components/course-actions";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { TitleForm } from "./_components/title-form";

interface Props {
  params: {
    courseId: string;
  };
}

export default async function Page({ params: { courseId } }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  const course = await db.query.courses.findFirst({
    where: and(
      eq(schema.courses.id, courseId),
      eq(schema.courses.ownerId, user.id),
    ),
    with: {
      // chapters: {
      //   orderBy: asc(schema.chapters.position),
      // },
      // attachments: {
      //   orderBy: desc(schema.attachments.createdAt),
      // },
      // categories: {
      //   orderBy: asc(schema.categories.name),
      // },
    },
  });

  if (!course) {
    return redirect("/teacher/courses");
  }

  const categories = await db.query.categories.findMany({
    orderBy: asc(schema.categories.name),
  });

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    // course.categories.some((x) => x.courseId === course.id),
    // course.chapters.some((x) => x.published),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.published && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields ({completedFields}/{totalFields})
            </span>
          </div>
          <CourseActions
            courseId={course.id}
            published={course.published}
            disabled={isComplete}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm courseId={course.id} title={course.title} />
            <DescriptionForm
              courseId={course.id}
              description={course.description}
            />
            <ImageForm courseId={course.id} imageUrl={course.imageUrl} />
            <div>category form</div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <div>chapters form</div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <div>price form</div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resource & Attachments</h2>
              </div>
              <div>attachments form</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
