import { CourseCard } from "./course-card";

interface Props {
  items: {
    course: {
      description: string | null;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      ownerId: string;
      title: string;
      imageUrl: string | null;
      price: number;
      published: boolean;
      categories: {
        category: {
          name: string;
        };
      }[];
      chapters: unknown[];
    };
    progress: number;
  }[];
}

export function CoursesList({ items }: Props) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {items.map((item) => (
          <CourseCard
            key={item.course.id}
            course={item.course}
            progress={item.progress}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-muted-foreground mt-10 text-center text-sm">
          No courses found
        </div>
      )}
    </div>
  );
}
