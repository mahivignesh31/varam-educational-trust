"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { resumeLesson } from "@/components/courses/resume-lesson";
import { EmptyState } from "@/components/lms/empty-state";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Badge, Progress } from "@/components/ui/primitives";
import { flatLessons } from "@/data/courses";
import { courseProgress, lessonPath } from "@/lib/catalog";
import { formatHours, formatMinutes } from "@/lib/format";

export function MyCoursesView() {
  const { enrolled, completedLessonIds, lastLesson, unenroll, restoreCourse } = useStudentWorkspace();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const pending = enrolled.find((item) => item.course.id === pendingId);

  return (
    <div className="space-y-6">
      <PageHeader title="My Courses">
        <p>Courses you enrolled in, with the description, outcomes, and lessons for each one.</p>
      </PageHeader>
      {enrolled.length ? (
        <div className="space-y-6">
          {enrolled.map(({ course, hidden }) => {
            const progress = courseProgress(course, completedLessonIds);
            const lesson = resumeLesson(course, completedLessonIds, lastLesson[course.id]);
            return (
              <article key={course.id} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="blue">{course.category}</Badge>
                  <Badge>{course.difficulty}</Badge>
                  <Badge tone="green">Enrolled</Badge>
                </div>
                <h2 className="mt-3 font-display text-3xl">{course.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {course.instructor} · {formatHours(course.hours)} · {flatLessons(course).length} lessons
                </p>
                <div className="mt-4 max-w-xl">
                  <Progress value={progress} label="Your progress" />
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{course.description}</p>
                {course.outcomes.length ? (
                  <ul className="mt-4 max-w-3xl space-y-2">
                    {course.outcomes.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-6">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-5 space-y-3">
                  {course.modules.map((module) => (
                    <div key={module.id}>
                      <h3 className="font-semibold">{module.title}</h3>
                      <ol className="mt-1 space-y-1">
                        {module.lessons.map((item, index) => (
                          <li key={item.id}>
                            <Link href={lessonPath(course, item.id)} className="text-sm font-semibold text-brand-blue">
                              {index + 1}. {item.title}
                              <span className="ml-2 font-medium text-muted-foreground">{formatMinutes(item.minutes)}</span>
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {hidden ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        restoreCourse(course.id);
                        toast.success("Course restored.");
                      }}
                    >
                      Restore in the catalog
                    </Button>
                  ) : null}
                  {lesson ? (
                    <Button asChild>
                      <Link href={lessonPath(course, lesson.id)}>{progress === 100 ? "Review" : "Continue"}</Link>
                    </Button>
                  ) : null}
                  <Button type="button" variant="destructive" onClick={() => setPendingId(course.id)}>
                    Unenroll
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No courses yet"
          body="Enroll from Explore Courses. The list stays in this browser and is not an official class register."
        >
          <Button asChild>
            <Link href="/lms/courses">Explore courses</Link>
          </Button>
        </EmptyState>
      )}
      <ConfirmDialog
        open={pending !== undefined}
        onOpenChange={(open) => {
          if (!open) setPendingId(null);
        }}
        title="Unenroll from this course?"
        body={
          pending
            ? `${pending.course.title} leaves My Courses in this browser. Lesson ticks already saved on this device stay until you reset demonstration data.`
            : "The course leaves My Courses in this browser."
        }
        confirmLabel="Unenroll"
        destructive
        onConfirm={() => {
          if (!pendingId) return;
          unenroll(pendingId);
          toast.success("Removed from My Courses in this browser.");
        }}
      />
    </div>
  );
}
