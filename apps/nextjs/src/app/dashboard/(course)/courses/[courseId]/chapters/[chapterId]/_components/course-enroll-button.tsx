"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";

import { purchaseCourse } from "~/app/_actions/courses/purchase";
import { formatPrice } from "~/lib/utils";

interface Props {
  courseId: string;
  price: string;
}

export function CourseEnrollButton({ courseId, price }: Props) {
  const { action, status } = useServerAction(purchaseCourse, {
    onServerError(error) {
      error && toast.error(error);
    },
  });

  return (
    <Button
      onClick={() => action({ courseId })}
      disabled={status === SubmissionStatus.PENDING}
      size="sm"
      className="w-full md:w-auto"
    >
      {status === SubmissionStatus.PENDING && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Enroll for {formatPrice(parseFloat(price))}
    </Button>
  );
}
