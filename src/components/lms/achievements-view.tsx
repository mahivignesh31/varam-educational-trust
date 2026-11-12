"use client";

import Link from "next/link";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Badge, Card, CardContent } from "@/components/ui/primitives";
import { courseProgress, findPresentedCourse } from "@/lib/catalog";

export function AchievementsView() {
  const { enrolled, completedLessonIds, attempts, courseCompletedAt, catalogState } = useStudentWorkspace();
  const firstLesson = completedLessonIds.length > 0;
  const passedQuiz = attempts.some((attempt) => attempt.percent >= 60);
  const courseComplete =
    enrolled.some(({ course }) => courseProgress(course, completedLessonIds) === 100) ||
    Object.keys(courseCompletedAt).some((id) => {
      const found = findPresentedCourse(id, catalogState);
      return Boolean(found && courseProgress(found.course, completedLessonIds) === 100);
    });
  const threeCourses = enrolled.length >= 3;

  const badges = [
    {
      id: "first-lesson",
      title: "First lesson",
      earned: firstLesson,
      detail: firstLesson
        ? "You marked a lesson complete in this browser."
        : "Mark any lesson complete to earn this.",
      href: "/lms/lessons",
      action: "Open video lessons",
    },
    {
      id: "passed-quiz",
      title: "First passed quiz",
      earned: passedQuiz,
      detail: passedQuiz
        ? "A saved attempt reached 60% or more."
        : "A sample quiz saved at 60% or more earns this.",
      href: "/lms/practice",
      action: "Open practice tests",
    },
    {
      id: "course-complete",
      title: "Course complete",
      earned: courseComplete,
      detail: courseComplete
        ? "A course is still at 100% from lesson ticks in this browser."
        : "Mark every lesson in a course complete to earn this.",
      href: "/lms/my-courses",
      action: "Review my courses",
    },
    {
      id: "three-enrollments",
      title: "Three enrollments",
      earned: threeCourses,
      detail: threeCourses
        ? "Three courses are in My Courses on this device."
        : `${enrolled.length} of 3 enrollments so far.`,
      href: "/lms/courses",
      action: "Explore courses",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Achievements">
        <p>
          Demonstration badges. They reflect progress stored in this browser. They are not official awards.
        </p>
      </PageHeader>
      <ul className="grid gap-4 md:grid-cols-2">
        {badges.map((badge) => (
          <li key={badge.id}>
            <Card className={badge.earned ? "border-brand-green" : undefined}>
              <CardContent className="space-y-3">
                <Badge tone="orange">Demonstration badge</Badge>
                <h2 className="font-display text-2xl">{badge.title}</h2>
                <p className="text-sm font-semibold text-secondary-foreground">
                  {badge.earned ? "Earned in this browser" : "Not earned yet"}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">{badge.detail}</p>
                <Link
                  href={badge.href}
                  className="inline-flex text-sm font-semibold text-secondary-foreground underline-offset-4 hover:underline"
                >
                  {badge.action}
                </Link>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
