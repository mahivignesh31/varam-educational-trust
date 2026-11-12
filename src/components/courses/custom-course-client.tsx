"use client";

import { useSearchParams } from "next/navigation";
import { CourseDetailView } from "@/components/courses/course-detail-view";
import { EmptyState } from "@/components/lms/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CustomCourseClient() {
  const id = useSearchParams().get("id")?.trim() ?? "";
  if (!id) {
    return (
      <EmptyState
        heading="h1"
        title="Choose a course"
        body="This page opens a course that was added in this browser. Pick one from Explore Courses."
      >
        <Button asChild>
          <Link href="/lms/courses">Explore courses</Link>
        </Button>
      </EmptyState>
    );
  }
  return <CourseDetailView courseKey={id} />;
}
