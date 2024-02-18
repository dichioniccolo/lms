import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { auth } from "@acme/auth";

import { getDashboardCourses } from "~/app/_api/get-dashboard-courses";
import { CoursesList } from "~/app/_components/courses-list";
import { InfoCard } from "./_components/info-card";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses();

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In Corso"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completati"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
