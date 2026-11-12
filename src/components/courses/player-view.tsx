"use client";

import { Check, Circle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { SampleReel } from "@/components/courses/sample-reel";
import { downloadNotes } from "@/components/lms/download-notes";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { findLesson, flatLessons } from "@/data/courses";
import { coursePath, findPresentedCourse, lessonPath } from "@/lib/catalog";
import { formatMinutes } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PlayerView({ courseKey, lessonId }: { courseKey: string; lessonId: string }) {
  const {
    catalogState,
    completedLessonIds,
    enrolledIds,
    enroll,
    restoreCourse,
    restoreLesson,
    setLastLesson,
    toggleLesson,
  } = useStudentWorkspace();
  const found = courseKey ? findPresentedCourse(courseKey, catalogState) : undefined;
  const course = found?.course;
  const lesson = course && lessonId ? findLesson(course, lessonId) : undefined;
  const courseId = course?.id;
  const activeLessonId = lesson?.id;

  useEffect(() => {
    if (!courseId || !activeLessonId) return;
    setLastLesson(courseId, activeLessonId);
  }, [activeLessonId, courseId, setLastLesson]);

  if (!courseKey || !lessonId) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-4xl">Choose a lesson</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Open a lesson from Video Lessons or from a course outline. This page needs both a course and a lesson.
        </p>
        <Button asChild>
          <Link href="/lms/lessons">Video lessons</Link>
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-4xl">Course not in this browser</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          That course id does not match a sample course or a course added in this browser.
        </p>
        <Button asChild>
          <Link href="/lms/courses">Explore courses</Link>
        </Button>
      </div>
    );
  }

  if (!lesson && catalogState.hiddenLessonIds.includes(lessonId)) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-4xl">Lesson hidden in this browser</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Restore it to show the lesson in {course.title} again.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              restoreLesson(lessonId);
              toast.success("Lesson restored in this browser.");
            }}
          >
            Restore lesson
          </Button>
          <Button asChild variant="outline">
            <Link href={coursePath(course)}>Back to course</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-4xl">Lesson not on this course</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {course.title} does not include that lesson in this browser.
        </p>
        <Button asChild>
          <Link href={coursePath(course)}>Back to course</Link>
        </Button>
      </div>
    );
  }

  const lessons = flatLessons(course);
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = index > 0 ? lessons[index - 1] : undefined;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined;
  const done = completedLessonIds.includes(lesson.id);
  const enrolled = enrolledIds.includes(course.id);
  const youtubeId = lesson.video.kind === "youtube" ? lesson.video.youtubeId : undefined;

  return (
    <div className="space-y-6">
      {found?.hidden ? (
        <div className="rounded-3xl border border-border bg-muted p-4 text-sm leading-6">
          <p className="font-semibold">This course is hidden in this browser.</p>
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
      <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <nav
          aria-label="Lessons"
          className="order-2 rounded-3xl border border-border bg-card p-3 lg:sticky lg:top-24 lg:order-1 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
        >
          {course.modules.map((module) => (
            <div key={module.id} className="mb-4 last:mb-0">
              <h2 className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {module.title}
              </h2>
              <ul className="mt-2 space-y-1">
                {module.lessons.map((item) => {
                  const complete = completedLessonIds.includes(item.id);
                  const current = item.id === lesson.id;
                  return (
                    <li key={item.id}>
                      <Link
                        href={lessonPath(course, item.id)}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "flex items-start gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-muted",
                          current && "bg-accent text-accent-foreground",
                        )}
                      >
                        {complete ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                        )}
                        <span>
                          <span className="sr-only">{complete ? "Completed. " : "Not completed. "}</span>
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <article className="order-1 space-y-6 lg:order-2">
          <header className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <Link href={coursePath(course)} className="font-semibold text-secondary-foreground underline-offset-4 hover:underline">
                {course.title}
              </Link>
              <span> · {formatMinutes(lesson.minutes)}</span>
            </p>
            <h1 className="font-display text-4xl">{lesson.title}</h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
          </header>
          {youtubeId ? (
            <div className="space-y-2">
              <div className="aspect-video overflow-hidden rounded-3xl bg-[#14213D]">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?start=${lesson.video.start ?? 0}&rel=0`}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {lesson.video.credit ?? "This recording is played from YouTube. Varam does not host it."}
              </p>
            </div>
          ) : (
            <SampleReel key={lesson.id} frames={[lesson.title, ...lesson.notes]} />
          )}
          <section className="space-y-3" aria-labelledby="objectives-heading">
            <h2 id="objectives-heading" className="font-display text-3xl">
              Objectives
            </h2>
            {lesson.objectives.length ? (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
                {lesson.objectives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">This lesson has no objectives listed.</p>
            )}
          </section>
          <section className="space-y-3" aria-labelledby="materials-heading">
            <h2 id="materials-heading" className="font-display text-3xl">
              Study materials
            </h2>
            {lesson.materials.length ? (
              <ul className="space-y-3">
                {lesson.materials.map((material) => (
                  <li
                    key={material.id}
                    className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold">{material.title}</p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        A text file made in this browser. Not a PDF from a server.
                      </p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => downloadNotes(material.title, material.body)}>
                      Download .txt
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">This lesson has no study notes attached.</p>
            )}
          </section>
          <div className="space-y-2">
            <Button type="button" onClick={() => toggleLesson(course.id, lesson.id)}>
              {done ? "Mark as not completed" : "Mark as completed"}
            </Button>
            <p className="text-xs text-muted-foreground">Saved only in this browser.</p>
            {!enrolled ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  enroll(course.id);
                  toast.success("Enrolled in this browser.");
                }}
              >
                Enroll in this course
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {previous ? (
              <Button asChild variant="outline" className="h-auto py-2">
                <Link href={lessonPath(course, previous.id)}>
                  <span className="text-left">
                    <span className="block text-xs font-medium">Previous</span>
                    <span className="block max-w-xs truncate">{previous.title}</span>
                  </span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href={coursePath(course)}>Back to course</Link>
              </Button>
            )}
            {next ? (
              <Button asChild className="h-auto py-2">
                <Link href={lessonPath(course, next.id)}>
                  <span className="text-left">
                    <span className="block text-xs font-medium">Next</span>
                    <span className="block max-w-xs truncate">{next.title}</span>
                  </span>
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/lms/my-courses">My courses</Link>
              </Button>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
