import { NextResponse } from "next/server";

import { auth } from "@acme/auth";
import { and, db, eq, exists, or, schema } from "@acme/db";

import { rangeOfFile } from "~/app/_actions/files/range-of-file";

interface Params {
  params: { courseId: string; chapterId: string };
}

const CHUNK_SIZE_IN_BYTES = 1024 * 1024 * 4; // 10 MB

export async function GET(
  request: Request,
  { params: { courseId, chapterId } }: Params,
) {
  const range = request.headers.get("range");

  if (!range) {
    return new NextResponse("Range must be provided", {
      status: 422,
    });
  }

  const session = await auth();

  const user = session?.user;

  if (!user) {
    return new NextResponse("You must be logged in to view this content", {
      status: 401,
    });
  }

  const chapter = await db.query.chapters.findFirst({
    where: and(
      eq(schema.chapters.published, true),
      eq(schema.chapters.id, chapterId),
      eq(schema.chapters.courseId, courseId),
      or(
        eq(schema.chapters.free, true),
        exists(
          db
            .select()
            .from(schema.usersCourses)
            .where(
              and(
                eq(schema.chapters.courseId, schema.usersCourses.courseId),
                eq(schema.usersCourses.userId, user.id),
              ),
            ),
        ),
      ),
    ),
    columns: {
      id: true,
      videoUrl: true,
      videoContentLength: true,
      videoContentType: true,
    },
  });

  if (!chapter) {
    return new NextResponse("You do not have access to this video", {
      status: 403,
    });
  }

  if (!chapter.videoUrl) {
    return new NextResponse("You do not have access to this video", {
      status: 404,
    });
  }

  const { videoContentLength, videoContentType } = chapter;

  if (!videoContentLength) {
    return new NextResponse(null, {
      status: 404,
    });
  }

  const chunkStart = Number(range.replace(/\D/g, ""));
  const chunkEnd = Math.min(
    chunkStart + CHUNK_SIZE_IN_BYTES,
    videoContentLength - 1,
  );

  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${videoContentLength}`,
    "Accept-Ranges": "bytes",
    "Content-Length": `${contentLength}`,
    "Content-Type": `${videoContentType}`,
  };

  const video = await rangeOfFile(
    chapter.videoUrl,
    `bytes=${chunkStart}-${chunkEnd}`,
  );

  return new NextResponse(video.Body?.transformToWebStream(), {
    status: 206,
    headers,
  });
}
