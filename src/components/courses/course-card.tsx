import Image from "next/image";
import Link from "next/link";
import { courseCover, courseIconMap } from "@/components/course-icon";
import { Badge, Card, CardContent, Progress } from "@/components/ui/primitives";
import { coursePath } from "@/lib/catalog";
import { formatHours } from "@/lib/format";
import { flatLessons } from "@/data/courses";
import type { Course, Difficulty } from "@/types";

function difficultyTone(difficulty: Difficulty): "green" | "blue" | "muted" {
  if (difficulty === "Beginner") return "green";
  if (difficulty === "Intermediate") return "blue";
  return "muted";
}

export function CourseCard({
  course,
  progress,
  href,
  children,
}: {
  course: Course;
  progress?: number;
  href?: string;
  children?: React.ReactNode;
}) {
  const Icon = courseIconMap[course.icon];
  const cover = courseCover(course.icon);
  const lessons = flatLessons(course).length;
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-44">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1280px) 22rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-blue shadow">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{course.category}</Badge>
          <Badge tone={difficultyTone(course.difficulty)}>{course.difficulty}</Badge>
          {course.custom ? <Badge tone="orange">Added in this browser</Badge> : null}
        </div>
        <h2 className="mt-3 font-display text-2xl">
          <Link href={href ?? coursePath(course)} className="hover:text-secondary-foreground">
            {course.title}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{course.instructor}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatHours(course.hours)} · {lessons} {lessons === 1 ? "lesson" : "lessons"}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{course.summary}</p>
        {typeof progress === "number" ? (
          <div className="mt-4">
            <Progress value={progress} label="Progress" />
          </div>
        ) : null}
        {children ? <div className="mt-auto flex flex-wrap gap-2 pt-4">{children}</div> : null}
      </CardContent>
    </Card>
  );
}
