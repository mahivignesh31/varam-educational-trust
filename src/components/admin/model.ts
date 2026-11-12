import { courses as seedCourses, flatLessons } from "@/data/courses";
import { galleryItems } from "@/data/gallery";
import { presentCourse, type CatalogState } from "@/lib/catalog";
import type { Course, Difficulty, Lesson } from "@/types";

let idNonce = 0;

export function browserId(prefix: string) {
  idNonce += 1;
  return `${prefix}-${Date.now().toString(36)}-${idNonce.toString(36)}`;
}

export function buildLocalLesson(id: string, title: string, summary: string): Lesson {
  return {
    id,
    title,
    minutes: 15,
    summary,
    objectives: ["Sample outcome added in this browser"],
    notes: ["Added in this browser for this demonstration."],
    video: { kind: "local" },
    materials: [
      {
        id: `${id}-material`,
        title: `${title} notes`,
        body: summary,
      },
    ],
  };
}

export function buildCustomCourse(input: {
  title: string;
  category: string;
  difficulty: Difficulty;
  hours: number;
  instructor: string;
  summary: string;
}): Course {
  const id = `custom-${Date.now().toString(36)}`;
  const summary = input.summary.trim();
  const title = input.title.trim();
  return {
    id,
    slug: id,
    title,
    category: input.category,
    difficulty: input.difficulty,
    instructor: input.instructor.trim(),
    hours: input.hours,
    summary,
    description: summary,
    outcomes: ["Sample outcome added in this browser"],
    thumbnail: "classroom",
    icon: "monitor",
    custom: true,
    modules: [
      {
        id: `${id}-module`,
        title: "Getting started",
        lessons: [
          buildLocalLesson(`${id}-a`, `${title} — getting started`, summary),
          buildLocalLesson(`${id}-b`, `${title} — practice`, summary),
        ],
      },
    ],
  };
}

export type LessonRow = {
  courseId: string;
  courseTitle: string;
  courseHidden: boolean;
  moduleTitle: string;
  lesson: Lesson;
};

export function visibleLessonRows(catalog: Course[]): LessonRow[] {
  return catalog.flatMap((course) =>
    course.modules.flatMap((section) =>
      section.lessons.map((lesson) => ({
        courseId: course.id,
        courseTitle: course.title,
        courseHidden: false,
        moduleTitle: section.title,
        lesson,
      })),
    ),
  );
}

export function hiddenLessonRows(state: CatalogState): LessonRow[] {
  const merged = new Map<string, Course>();
  for (const course of seedCourses) merged.set(course.id, course);
  for (const course of state.customCourses) merged.set(course.id, { ...course, custom: true });

  const rows: LessonRow[] = [];
  const seen = new Set<string>();
  for (const course of merged.values()) {
    const courseTitle = state.coursePatches[course.id]?.title ?? course.title;
    const courseHidden = state.deletedCourseIds.includes(course.id);
    const take = (moduleTitle: string, lesson: Lesson) => {
      if (!state.hiddenLessonIds.includes(lesson.id) || seen.has(lesson.id)) return;
      seen.add(lesson.id);
      rows.push({
        courseId: course.id,
        courseTitle,
        courseHidden,
        moduleTitle,
        lesson: { ...lesson, ...state.lessonPatches[lesson.id] },
      });
    };
    for (const section of course.modules) {
      for (const lesson of section.lessons) take(section.title, lesson);
    }
    for (const lesson of state.customLessons[course.id] ?? []) {
      take("Added in this browser", lesson);
    }
  }
  return rows;
}

export function hiddenCourses(state: CatalogState): Course[] {
  const merged = new Map<string, Course>();
  for (const course of seedCourses) merged.set(course.id, course);
  for (const course of state.customCourses) merged.set(course.id, { ...course, custom: true });
  return [...merged.values()]
    .filter((course) => state.deletedCourseIds.includes(course.id))
    .map((course) => presentCourse(course, state));
}

export function presentedGallery(state: Pick<CatalogState, "galleryPatches" | "hiddenGalleryIds">) {
  const seedIds = new Set(galleryItems.map((item) => item.id));
  const added = Object.entries(state.galleryPatches)
    .filter(([id, patch]) => !seedIds.has(id) && patch.src)
    .map(([id, patch]) => ({
      id,
      src: patch.src ?? "",
      title: patch.title ?? "Photograph",
      caption: patch.caption ?? "",
      category: patch.category ?? "Campus",
      alt: patch.alt ?? patch.title ?? "Campus photograph",
    }));
  return [...added, ...galleryItems].map((item) => ({
    ...item,
    title: state.galleryPatches[item.id]?.title ?? item.title,
    caption: state.galleryPatches[item.id]?.caption ?? item.caption,
    hidden: state.hiddenGalleryIds.includes(item.id),
  }));
}

export function browserProgress(catalog: Course[], completedLessonIds: string[]) {
  const lessons = catalog.flatMap((course) => flatLessons(course));
  if (!lessons.length) return 0;
  const done = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  return Math.round((done / lessons.length) * 100);
}

export function lessonHaystack(row: LessonRow) {
  return `${row.courseTitle} ${row.moduleTitle} ${row.lesson.title} ${row.lesson.summary}`.toLowerCase();
}
