import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomCourseClient } from "@/components/courses/custom-course-client";
import { RouteSkeleton } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Course",
  description: "A course opened from this browser's demonstration catalog.",
};

export default function Page() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <CustomCourseClient />
    </Suspense>
  );
}
