"use server";

import { and, db, eq, like, schema } from "@acme/db";

export async function getPublishedCourses(title?: string | null) {
  const where = [eq(schema.courses.published, true)];

  if (title) {
    where.push(like(schema.courses.title, `%${title}%`));
  }

  const courses = await db
    .select({
      id: schema.courses.id,
      title: schema.courses.title,
      description: schema.courses.description,
      imageUrl: schema.courses.imageUrl,
    })
    .from(schema.courses)
    .where(and(...where));

  return courses;
}
