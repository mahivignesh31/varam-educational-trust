"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ActionLink } from "@/components/auth/action-link";
import { courseCover } from "@/components/course-icon";
import { CourseRoadmap } from "@/components/courses/course-roadmap";
import { resumeLesson } from "@/components/courses/resume-lesson";
import { Button } from "@/components/ui/button";
import { Badge, Progress } from "@/components/ui/primitives";
import { assignments } from "@/data/assignments";
import { flatLessons } from "@/data/courses";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { assembleQuizzes, courseProgress, findPresentedCourse, lessonPath } from "@/lib/catalog";
import { useAuth } from "@/lib/auth";
import { loginPath } from "@/lib/login-path";
import { formatHours, formatMinutes } from "@/lib/format";
import type { AssessmentCategory } from "@/types";

const categoryLabel: Record<AssessmentCategory, string> = {
  practice: "Practice",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
  final: "Final",
};

export function CourseDetailView({ courseKey }: { courseKey: string }) {
  const {
    catalogState,
    enrolledIds,
    completedLessonIds,
    lastLesson,
    enroll,
    restoreCourse,
  } = useStudentWorkspace();
  const router = useRouter();
  const { session } = useAuth();
  const found = findPresentedCourse(courseKey, catalogState);

  if (!found) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-4xl">Course not in this browser</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          That address does not match a sample course or a course added in this browser.
        </p>
        <Button asChild>
          <Link href="/lms/courses">Explore courses</Link>
        </Button>
      </div>
    );
  }

  const { course, hidden } = found;
  const cover = courseCover(course.icon);
  const enrolled = enrolledIds.includes(course.id);
  const progress = courseProgress(course, completedLessonIds);
  const lesson = resumeLesson(course, completedLessonIds, lastLesson[course.id]);
  const quizzes = assembleQuizzes(catalogState).filter(
    (quiz) => quiz.courseSlug === course.slug || quiz.courseSlug === course.id,
  );

  function enrollIn() {
    if (!session) {
      router.push(loginPath(`/lms/courses/${course.slug}`));
      return;
    }
    enroll(course.id);
    toast.success("Enrolled.");
  }

  return (
    <div className="space-y-8">
      {hidden ? (
        <div className="rounded-3xl border border-border bg-muted p-4 text-sm leading-6">
          <p className="font-semibold text-foreground">This course is hidden in this browser.</p>
          <p className="mt-1 text-muted-foreground">
            It stays out of Explore Courses until you restore it. The sample on the public site is unchanged.
          </p>
          <Button
            type="button"
            className="mt-3"
            onClick={() => {
              restoreCourse(course.id);
              toast.success("Course restored in this browser.");
            }}
          >
            Restore
          </Button>
        </div>
      ) : null}
      <header className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative h-56">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority
            sizes="(min-width: 1024px) 72rem, 100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">{course.category}</Badge>
            <Badge tone={course.difficulty === "Beginner" ? "green" : course.difficulty === "Intermediate" ? "blue" : "muted"}>
              {course.difficulty}
            </Badge>
            {enrolled ? <Badge tone="green">Enrolled</Badge> : null}
            {course.custom ? <Badge tone="orange">Added in this browser</Badge> : null}
          </div>
          <h1 className="font-display text-4xl">{course.title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{course.summary}</p>
          <p className="text-sm text-muted-foreground">
            {course.instructor} · {formatHours(course.hours)} · {flatLessons(course).length} lessons
          </p>
          <Progress value={progress} label={enrolled ? "Your progress" : "Lesson ticks in this browser"} />
          <div className="flex flex-wrap gap-2">
            {enrolled && lesson ? (
              <Button asChild>
                <ActionLink href={lessonPath(course, lesson.id)}>{progress === 100 ? "Review lessons" : "Continue"}</ActionLink>
              </Button>
            ) : null}
            {!enrolled ? (
              <Button type="button" onClick={enrollIn}>
                Enroll
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/lms/courses">All courses</Link>
            </Button>
          </div>
        </div>
      </header>
      <section className="space-y-3" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="font-display text-3xl">
          Overview
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{course.description}</p>
        {course.outcomes.length ? (
          <ul className="max-w-3xl space-y-2">
            {course.outcomes.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6">
                <Check className="mt-1 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
      <CourseRoadmap
        course={course}
        assignment={assignments.find((item) => item.courseSlug === course.slug || item.courseSlug === course.id)}
      />
      <section className="space-y-4" aria-labelledby="outline-heading">
        <h2 id="outline-heading" className="font-display text-3xl">
          Module outline
        </h2>
        <div className="space-y-4">
          {course.modules.map((module) => (
            <article key={module.id} className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-2xl">{module.title}</h3>
              {module.lessons.length ? (
                <ol className="mt-3 space-y-2">
                  {module.lessons.map((item, index) => (
                    <li key={item.id}>
                      <ActionLink
                        href={lessonPath(course, item.id)}
                        className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 hover:bg-muted"
                      >
                        <span className="text-sm font-semibold">
                          {index + 1}. {item.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">{formatMinutes(item.minutes)}</span>
                      </ActionLink>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">This module has no visible lessons in this browser.</p>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="space-y-4" aria-labelledby="assessments-heading">
        <h2 id="assessments-heading" className="font-display text-3xl">
          Sample assessments
        </h2>
        {quizzes.length ? (
          <ul className="grid gap-3">
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <ActionLink
                  href={`/lms/quiz/${quiz.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-card px-5 py-4 hover:bg-muted"
                >
                  <span>
                    <span className="block font-semibold">{quiz.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {quiz.questions.length} questions · {formatMinutes(quiz.minutes)}
                    </span>
                  </span>
                  <Badge tone="blue">{categoryLabel[quiz.category]}</Badge>
                </ActionLink>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            No practice paper is attached to this course yet.
          </p>
        )}
      </section>
    </div>
  );
}
