import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { asc, db, schema } from "@acme/db";
import { Banner } from "@acme/ui/components/banner";

import { getCourse } from "~/app/_api/teacher/get-course";
import { IconBadge } from "~/app/_components/icon-badge";
import { AttachmentsForm } from "./_components/attachments-form";
import { CategoriesForm } from "./_components/categories-form";
import { ChaptersForm } from "./_components/chapters-form";
import { CourseActions } from "./_components/course-actions";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { CourseTitleDescriptionForm } from "./_components/title-description-form";

interface Props {
  params: {
    courseId: string;
  };
}

export default async function Page({ params: { courseId } }: Props) {
  const { data: course } = await getCourse({ courseId });

  if (!course) {
    redirect("/dashboard/teacher/courses");
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
    course.chapters.some((x) => x.published),
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
            disabled={!isComplete}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <CourseTitleDescriptionForm
              courseId={course.id}
              title={course.title}
              description={course.description}
            />
            <ImageForm courseId={course.id} imageUrl={course.imageUrl} />
            {categories.length > 0 && (
              <CategoriesForm
                courseId={course.id}
                categories={course.categories.map((x) => x.category)}
                availableCategories={categories}
              />
            )}
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm courseId={course.id} chapters={course.chapters} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm courseId={course.id} price={course.price} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resource & Attachments</h2>
              </div>
              <AttachmentsForm
                courseId={course.id}
                attachments={course.attachments}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
