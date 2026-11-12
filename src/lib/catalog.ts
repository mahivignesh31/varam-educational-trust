import { seedAnnouncements } from "@/data/announcements";
import { flatLessons, seedCourseSlugs, seedLessonIds, courses as seedCourses } from "@/data/courses";
import { galleryItems } from "@/data/gallery";
import { quizzes as seedQuizzes } from "@/data/quizzes";
import type {
  Announcement,
  Course,
  CoursePatch,
  GalleryItem,
  Lesson,
  LessonPatch,
  Question,
  Quiz,
} from "@/types";

export interface CatalogState {
  coursePatches: Record<string, CoursePatch>;
  deletedCourseIds: string[];
  customCourses: Course[];
  lessonPatches: Record<string, LessonPatch>;
  hiddenLessonIds: string[];
  customLessons: Record<string, Lesson[]>;
  extraQuestions: { id: string; quizId: string; question: Question }[];
  hiddenQuestionIds: string[];
  announcementExtras: Announcement[];
  announcementPatches: Record<string, Partial<Announcement>>;
  deletedAnnouncementIds: string[];
  galleryPatches: Record<string, { title?: string; caption?: string; src?: string; alt?: string; category?: string }>;
  hiddenGalleryIds: string[];
}

export function presentCourse(course: Course, state: CatalogState): Course {
  const patch = state.coursePatches[course.id] ?? {};
  const extras = (state.customLessons[course.id] ?? []).filter(
    (lesson) => !state.hiddenLessonIds.includes(lesson.id),
  );
  const modules = course.modules.map((module) => ({
    ...module,
    lessons: module.lessons
      .filter((lesson) => !state.hiddenLessonIds.includes(lesson.id))
      .map((lesson) => ({ ...lesson, ...state.lessonPatches[lesson.id] })),
  }));
  if (extras.length) {
    modules.push({
      id: `${course.id}-added`,
      title: "Added in this browser",
      lessons: extras.map((lesson) => ({
        ...lesson,
        ...state.lessonPatches[lesson.id],
      })),
    });
  }
  return {
    ...course,
    title: patch.title ?? course.title,
    summary: patch.summary ?? course.summary,
    description: patch.description ?? course.description,
    category: patch.category ?? course.category,
    difficulty: patch.difficulty ?? course.difficulty,
    instructor: patch.instructor ?? course.instructor,
    hours: patch.hours ?? course.hours,
    modules,
  };
}

export function assembleCatalog(state: CatalogState) {
  const seed = seedCourses
    .filter((course) => !state.deletedCourseIds.includes(course.id))
    .map((course) => presentCourse(course, state));
  const custom = state.customCourses
    .filter((course) => !state.deletedCourseIds.includes(course.id))
    .map((course) => presentCourse({ ...course, custom: true }, state));
  return [...seed, ...custom];
}

export function findPresentedCourse(idOrSlug: string, state: CatalogState) {
  const source =
    seedCourses.find((course) => course.slug === idOrSlug || course.id === idOrSlug) ??
    state.customCourses.find((course) => course.slug === idOrSlug || course.id === idOrSlug);
  if (!source) return undefined;
  return {
    course: presentCourse(source, state),
    hidden: state.deletedCourseIds.includes(source.id),
  };
}

export function courseProgress(course: Course, completedLessonIds: string[]) {
  const lessons = flatLessons(course);
  if (!lessons.length) return 0;
  const done = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  return Math.round((done / lessons.length) * 100);
}

export function completedCount(course: Course, completedLessonIds: string[]) {
  return flatLessons(course).filter((lesson) => completedLessonIds.includes(lesson.id)).length;
}

export function learningHours(catalog: Course[], completedLessonIds: string[]) {
  const minutes = catalog
    .flatMap((course) => flatLessons(course))
    .filter((lesson) => completedLessonIds.includes(lesson.id))
    .reduce((sum, lesson) => sum + lesson.minutes, 0);
  return Math.round((minutes / 60) * 10) / 10;
}

export function coursePath(course: Course) {
  if (course.custom || !seedCourseSlugs.has(course.slug)) {
    return `/lms/custom?id=${encodeURIComponent(course.id)}`;
  }
  return `/lms/courses/${course.slug}`;
}

export function lessonPath(course: Course, lessonId: string) {
  if (course.custom || !seedLessonIds.has(lessonId)) {
    return `/lms/custom-lesson?course=${encodeURIComponent(course.id)}&lesson=${encodeURIComponent(lessonId)}`;
  }
  return `/lms/learn/${course.slug}/${lessonId}`;
}

export function continueTarget(catalog: Course[], enrolledIds: string[], completedLessonIds: string[], lastLesson: Record<string, string>) {
  const enrolled = catalog.filter((course) => enrolledIds.includes(course.id));
  for (const course of enrolled) {
    const lessons = flatLessons(course);
    const last = lastLesson[course.id];
    const lastLessonItem = lessons.find((lesson) => lesson.id === last);
    if (lastLessonItem && !completedLessonIds.includes(lastLessonItem.id)) {
      return { course, lesson: lastLessonItem };
    }
    const next = lessons.find((lesson) => !completedLessonIds.includes(lesson.id));
    if (next) return { course, lesson: next };
  }
  return undefined;
}

export function assembleQuizzes(state: Pick<CatalogState, "extraQuestions" | "hiddenQuestionIds">) {
  return seedQuizzes.map((quiz) => ({
    ...quiz,
    questions: [
      ...quiz.questions.filter((question) => !state.hiddenQuestionIds.includes(question.id)),
      ...state.extraQuestions
        .filter((item) => item.quizId === quiz.id)
        .map((item) => item.question)
        .filter((question) => !state.hiddenQuestionIds.includes(question.id)),
    ],
  }));
}

export function findPresentedQuiz(id: string, state: Pick<CatalogState, "extraQuestions" | "hiddenQuestionIds">) {
  return assembleQuizzes(state).find((quiz) => quiz.id === id);
}

export function assembleAnnouncements(state: Pick<CatalogState, "announcementExtras" | "announcementPatches" | "deletedAnnouncementIds">) {
  const seed = seedAnnouncements
    .filter((item) => !state.deletedAnnouncementIds.includes(item.id))
    .map((item) => ({ ...item, ...state.announcementPatches[item.id] }));
  const extras = state.announcementExtras.filter(
    (item) => !state.deletedAnnouncementIds.includes(item.id),
  );
  return [...extras, ...seed].sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

export function assembleGallery(state: Pick<CatalogState, "galleryPatches" | "hiddenGalleryIds">): GalleryItem[] {
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
  return [...added, ...galleryItems]
    .filter((item) => !state.hiddenGalleryIds.includes(item.id))
    .map((item) => ({
      ...item,
      title: state.galleryPatches[item.id]?.title ?? item.title,
      caption: state.galleryPatches[item.id]?.caption ?? item.caption,
    }));
}

export function scoreQuiz(quiz: Quiz, answers: (number | null)[]) {
  let correct = 0;
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctIndex) correct += 1;
  });
  const total = quiz.questions.length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  return { correct, total, percent };
}

export type { Quiz };
