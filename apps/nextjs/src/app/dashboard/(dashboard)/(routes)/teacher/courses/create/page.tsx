import { CreateCourseForm } from "./_components/create-course-form";

export default function Page() {
  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <CreateCourseForm />
      </div>
    </div>
  );
}
