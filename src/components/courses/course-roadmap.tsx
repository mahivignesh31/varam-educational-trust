import type { ReactNode } from "react";
import { formatHours, formatMinutes } from "@/lib/format";
import type { Assignment, Course } from "@/types";

const partColors = [
  { marker: "bg-brand-green", chip: "text-brand-green", ring: "ring-brand-green/30" },
  { marker: "bg-brand-blue", chip: "text-brand-blue", ring: "ring-brand-blue/30" },
  { marker: "bg-brand-orange", chip: "text-brand-orange", ring: "ring-brand-orange/30" },
];

function Marker({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={`absolute left-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white ring-4 ring-card ${className}`}
    >
      {children}
    </span>
  );
}

export function CourseRoadmap({
  course,
  assignment,
  className = "",
}: {
  course: Course;
  assignment?: Assignment | null;
  className?: string;
}) {
  const modules = course.modules.filter((module) => module.lessons.length > 0);
  const lessonCount = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  if (!lessonCount) return null;

  let lessonNumber = 0;

  return (
    <section className={className} aria-labelledby="roadmap-heading">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_18px_50px_rgba(20,33,61,0.06)]">
        <div className="border-b border-border bg-secondary/60 px-6 py-7 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">Course roadmap</p>
          <h2 id="roadmap-heading" className="mt-2 font-display text-3xl sm:text-4xl">
            Every step of {course.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Begin at the first lesson and follow the line. Each stop is one lesson, and the path ends with the written assignment.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <li className="rounded-full bg-card px-3 py-1 text-foreground">{course.difficulty}</li>
            <li className="rounded-full bg-card px-3 py-1 text-foreground">{formatHours(course.hours)}</li>
            <li className="rounded-full bg-card px-3 py-1 text-foreground">
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
            </li>
            <li className="rounded-full bg-card px-3 py-1 text-foreground">{modules.length} parts</li>
          </ul>
        </div>

        <div className="relative px-4 py-8 sm:px-8">
          <div
            className="absolute top-8 bottom-8 left-9 w-px -translate-x-1/2 bg-gradient-to-b from-brand-green via-brand-blue to-brand-orange sm:left-[3.25rem]"
            aria-hidden="true"
          />
          <ol className="space-y-8">
            <li className="relative pl-14">
              <Marker className="bg-brand-green">Go</Marker>
              <div className="rounded-3xl border border-brand-green/25 bg-accent/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">Start</p>
                <h3 className="mt-1 font-display text-2xl">Open {course.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {course.summary} The first lesson is {modules[0].lessons[0].title}.
                </p>
              </div>
            </li>

            {modules.map((module, moduleIndex) => {
              const color = partColors[moduleIndex % partColors.length];
              return (
                <li key={module.id} className="space-y-4">
                  <div className="relative pl-14">
                    <Marker className={`${color.marker} !rounded-2xl text-xs`}>P{moduleIndex + 1}</Marker>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${color.chip}`}>
                        Part {moduleIndex + 1}
                      </p>
                      <h3 className="mt-1 font-display text-2xl">{module.title}</h3>
                    </div>
                  </div>
                  <ol className="space-y-4">
                    {module.lessons.map((lesson) => {
                      lessonNumber += 1;
                      const number = lessonNumber;
                      return (
                        <li key={lesson.id} className="relative pl-14">
                          <span
                            className={`absolute left-1 top-5 z-10 grid h-8 w-8 place-items-center rounded-full bg-card text-xs font-semibold ring-4 ring-card ${color.chip} ${color.ring} ring-offset-0 border border-current`}
                          >
                            {number}
                          </span>
                          <article className="rounded-3xl border border-border bg-background/70 p-5">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h4 className="font-display text-xl">{lesson.title}</h4>
                              <p className="text-xs font-semibold text-brand-blue">{formatMinutes(lesson.minutes)}</p>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
                          </article>
                        </li>
                      );
                    })}
                  </ol>
                </li>
              );
            })}

            <li className="relative pl-14">
              <Marker className="bg-brand-orange">End</Marker>
              <div className="rounded-3xl border border-brand-orange/30 bg-[#fff4e8] p-5 text-brand-navy dark:bg-brand-orange/15 dark:text-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Finish</p>
                <h3 className="mt-1 font-display text-2xl">{assignment ? assignment.title : "Review the last lesson"}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-navy/80 dark:text-muted-foreground">
                  {assignment
                    ? assignment.prompt
                    : "Read back through the lessons you marked complete before you leave the course."}
                </p>
                {assignment ? (
                  <p className="mt-3 text-xs font-semibold text-brand-orange">{formatMinutes(assignment.minutes)} · written assignment</p>
                ) : null}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
