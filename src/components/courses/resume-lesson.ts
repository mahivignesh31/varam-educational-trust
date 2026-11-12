import { flatLessons } from "@/data/courses";
import type { Course, Lesson } from "@/types";

export function resumeLesson(
  course: Course,
  completedLessonIds: string[],
  lastLessonId?: string,
): Lesson | undefined {
  const lessons = flatLessons(course);
  if (!lessons.length) return undefined;
  if (lastLessonId) {
    const current = lessons.find((lesson) => lesson.id === lastLessonId);
    if (current && !completedLessonIds.includes(current.id)) return current;
  }
  return lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? lessons[0];
}
