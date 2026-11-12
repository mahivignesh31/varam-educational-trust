import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomLessonClient } from "@/components/courses/custom-lesson-client";
import { RouteSkeleton } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Lesson",
  description: "A lesson opened from this browser's demonstration catalog.",
};

export default function Page() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <CustomLessonClient />
    </Suspense>
  );
}
