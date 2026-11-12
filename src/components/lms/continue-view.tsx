"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EmptyState } from "@/components/lms/empty-state";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { continueTarget, lessonPath } from "@/lib/catalog";

export function ContinueView() {
  const router = useRouter();
  const { enrolled, learningCatalog, enrolledIds, completedLessonIds, lastLesson } = useStudentWorkspace();
  const target = continueTarget(learningCatalog, enrolledIds, completedLessonIds, lastLesson);
  const href = target ? lessonPath(target.course, target.lesson.id) : "";

  useEffect(() => {
    if (!href) return;
    router.replace(href);
  }, [href, router]);

  if (!enrolled.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Continue Learning" />
        <EmptyState
          title="No course in progress"
          body="Enroll in a sample course to pick up a lesson. Progress stays in this browser."
        >
          <Button asChild>
            <Link href="/lms/courses">Explore courses</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  if (!target) {
    return (
      <div className="space-y-6">
        <PageHeader title="Continue Learning" />
        <EmptyState
          title="You are up to date"
          body="Every lesson in your enrolled courses is marked complete in this browser."
        >
          <Button asChild>
            <Link href="/lms/my-courses">Review my courses</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Continue Learning">
        <p>
          Opening {target.lesson.title} in {target.course.title}.
        </p>
      </PageHeader>
      <Button asChild>
        <Link href={href}>Open lesson</Link>
      </Button>
    </div>
  );
}
