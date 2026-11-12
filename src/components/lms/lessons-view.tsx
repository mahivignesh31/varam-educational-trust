"use client";

import Link from "next/link";
import { EmptyState } from "@/components/lms/empty-state";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { assignments } from "@/data/assignments";
import { flatLessons } from "@/data/courses";
import { lessonPath } from "@/lib/catalog";
import { formatMinutes } from "@/lib/format";

export function LessonsView() {
  const { catalog, enrolled } = useStudentWorkspace();
  const showingAll = enrolled.length === 0;
  const source = showingAll ? catalog : enrolled.map((item) => item.course);
  const hasLessons = source.some((course) => flatLessons(course).length > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Video Lessons">
        <p>Every course lists its lessons, study notes, and assignment. Open a lesson to read the notes and complete the work.</p>
      </PageHeader>
      {!hasLessons ? (
        <EmptyState
          title="No video lessons to show"
          body="There are no visible lessons in this browser. Restore a hidden course from Explore Courses if you hid one."
        >
          <Button asChild>
            <Link href="/lms/courses">Explore courses</Link>
          </Button>
        </EmptyState>
      ) : null}
      {showingAll && hasLessons ? (
        <p className="rounded-3xl border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground">
          You have not enrolled yet, so this list shows video lessons from every visible course. Enroll when you
          want a course in My Courses.
        </p>
      ) : null}
      <div className="space-y-8">
        {source.map((course) => {
          const lessons = flatLessons(course);
          const courseAssignments = assignments.filter((item) => item.courseSlug === course.slug || item.courseSlug === course.id);
          if (!lessons.length && !courseAssignments.length) return null;
          return (
            <section key={course.id} aria-labelledby={`lessons-${course.id}`}>
              <h2 id={`lessons-${course.id}`} className="font-display text-3xl">
                {course.title}
              </h2>
              <ul className="mt-3 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
                {lessons.map((lesson) => {
                  const shared = lesson.video.kind === "youtube" && Boolean(lesson.video.youtubeId);
                  return (
                    <li key={lesson.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">{lesson.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{formatMinutes(lesson.minutes)} · study notes</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={shared ? "blue" : "green"}>{shared ? "Video lesson" : "Lesson"}</Badge>
                        <Link
                          href={lessonPath(course, lesson.id)}
                          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[#008f46]"
                        >
                          Open lesson
                        </Link>
                      </div>
                    </li>
                  );
                })}
                {courseAssignments.map((assignment) => (
                  <li key={assignment.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{assignment.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatMinutes(assignment.minutes)} · written assignment</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="orange">Assignment</Badge>
                      <Link
                        href="/lms/assignments"
                        className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                      >
                        Open assignment
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
