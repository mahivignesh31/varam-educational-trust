"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { courses as seedCourses, flatLessons } from "@/data/courses";
import { courseProgress, presentCourse, type CatalogState } from "@/lib/catalog";
import type {
  ActiveQuiz,
  Announcement,
  AssignmentDraft,
  Course,
  CoursePatch,
  GalleryItem,
  Lesson,
  LessonPatch,
  Question,
  QuizAttempt,
} from "@/types";

export interface DemoStore {
  learnerId: string;
  accountReady: boolean;
  studentName: string;
  studentGoal: string;
  entered: { student: boolean; admin: boolean; trainer: boolean };
  enrolledIds: string[];
  completedLessonIds: string[];
  courseCompletedAt: Record<string, string>;
  lastLesson: Record<string, string>;
  attempts: QuizAttempt[];
  activeQuiz: ActiveQuiz | null;
  assignmentDrafts: Record<string, AssignmentDraft>;
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
  galleryPatches: Record<string, { title?: string; caption?: string }>;
  hiddenGalleryIds: string[];
  setProfile: (patch: { studentName?: string; studentGoal?: string }) => void;
  enter: (role: "student" | "admin" | "trainer", name?: string) => void;
  exit: (role: "student" | "admin" | "trainer") => void;
  enroll: (courseId: string) => void;
  unenroll: (courseId: string) => void;
  setLastLesson: (courseId: string, lessonId: string) => void;
  toggleLesson: (courseId: string, lessonId: string) => void;
  setActiveQuiz: (active: ActiveQuiz | null) => void;
  patchActiveQuiz: (patch: Partial<ActiveQuiz>) => void;
  addAttempt: (attempt: QuizAttempt) => void;
  saveAssignment: (id: string, text: string) => void;
  saveCourse: (courseId: string, patch: CoursePatch, custom?: boolean) => void;
  addCourse: (course: Course) => void;
  hideCourse: (courseId: string) => void;
  restoreCourse: (courseId: string) => void;
  saveLesson: (lessonId: string, patch: LessonPatch) => void;
  addLesson: (courseId: string, lesson: Lesson) => void;
  hideLesson: (lessonId: string) => void;
  restoreLesson: (lessonId: string) => void;
  addQuestion: (quizId: string, question: Question) => void;
  removeQuestion: (questionId: string) => void;
  addAnnouncement: (announcement: Announcement) => void;
  saveAnnouncement: (id: string, patch: Partial<Announcement>) => void;
  hideAnnouncement: (id: string) => void;
  saveGallery: (id: string, patch: { title?: string; caption?: string }) => void;
  addGallery: (item: GalleryItem) => void;
  hideGallery: (id: string) => void;
  restoreGallery: (id: string) => void;
  resetDemo: () => void;
}

const initial = {
  learnerId: "",
  accountReady: false,
  studentName: "Learner",
  studentGoal: "Build practical computer skills",
  entered: { student: false, admin: false, trainer: false },
  enrolledIds: [] as string[],
  completedLessonIds: [] as string[],
  courseCompletedAt: {} as Record<string, string>,
  lastLesson: {} as Record<string, string>,
  attempts: [] as QuizAttempt[],
  activeQuiz: null as ActiveQuiz | null,
  assignmentDrafts: {} as Record<string, AssignmentDraft>,
  coursePatches: {} as Record<string, CoursePatch>,
  deletedCourseIds: [] as string[],
  customCourses: [] as Course[],
  lessonPatches: {} as Record<string, LessonPatch>,
  hiddenLessonIds: [] as string[],
  customLessons: {} as Record<string, Lesson[]>,
  extraQuestions: [] as { id: string; quizId: string; question: Question }[],
  hiddenQuestionIds: [] as string[],
  announcementExtras: [] as Announcement[],
  announcementPatches: {} as Record<string, Partial<Announcement>>,
  deletedAnnouncementIds: [] as string[],
  galleryPatches: {} as Record<string, { title?: string; caption?: string; src?: string; alt?: string; category?: string }>,
  hiddenGalleryIds: [] as string[],
};

function catalogSlice(state: DemoStore): CatalogState {
  return {
    coursePatches: state.coursePatches,
    deletedCourseIds: state.deletedCourseIds,
    customCourses: state.customCourses,
    lessonPatches: state.lessonPatches,
    hiddenLessonIds: state.hiddenLessonIds,
    customLessons: state.customLessons,
    extraQuestions: state.extraQuestions,
    hiddenQuestionIds: state.hiddenQuestionIds,
    announcementExtras: state.announcementExtras,
    announcementPatches: state.announcementPatches,
    deletedAnnouncementIds: state.deletedAnnouncementIds,
    galleryPatches: state.galleryPatches,
    hiddenGalleryIds: state.hiddenGalleryIds,
  };
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      ...initial,
      setProfile: (patch) => set(patch),
      enter: (role, name) =>
        set((state) => ({
          entered: { ...state.entered, [role]: true },
          studentName: name?.trim() ? name.trim().slice(0, 40) : state.studentName,
        })),
      exit: (role) =>
        set((state) => ({ entered: { ...state.entered, [role]: false } })),
      enroll: (courseId) =>
        set((state) => ({
          enrolledIds: state.enrolledIds.includes(courseId)
            ? state.enrolledIds
            : [...state.enrolledIds, courseId],
        })),
      unenroll: (courseId) =>
        set((state) => ({
          enrolledIds: state.enrolledIds.filter((id) => id !== courseId),
        })),
      setLastLesson: (courseId, lessonId) =>
        set((state) => ({ lastLesson: { ...state.lastLesson, [courseId]: lessonId } })),
      toggleLesson: (courseId, lessonId) => {
        const state = get();
        const completedLessonIds = state.completedLessonIds.includes(lessonId)
          ? state.completedLessonIds.filter((id) => id !== lessonId)
          : [...state.completedLessonIds, lessonId];
        const source =
          seedCourses.find((course) => course.id === courseId) ??
          state.customCourses.find((course) => course.id === courseId);
        const courseCompletedAt = { ...state.courseCompletedAt };
        if (source) {
          const presented = presentCourse(source, catalogSlice(state));
          const progress = courseProgress(
            { ...presented, modules: presented.modules },
            completedLessonIds,
          );
          if (progress >= 100 && flatLessons(presented).length > 0) {
            courseCompletedAt[courseId] =
              state.courseCompletedAt[courseId] ?? new Date().toISOString();
          } else {
            delete courseCompletedAt[courseId];
          }
        }
        set({
          completedLessonIds,
          courseCompletedAt,
          lastLesson: { ...state.lastLesson, [courseId]: lessonId },
        });
      },
      setActiveQuiz: (activeQuiz) => set({ activeQuiz }),
      patchActiveQuiz: (patch) =>
        set((state) => ({
          activeQuiz: state.activeQuiz ? { ...state.activeQuiz, ...patch } : state.activeQuiz,
        })),
      addAttempt: (attempt) =>
        set((state) => ({ attempts: [attempt, ...state.attempts].slice(0, 40), activeQuiz: null })),
      saveAssignment: (id, text) =>
        set((state) => ({
          assignmentDrafts: {
            ...state.assignmentDrafts,
            [id]: { text, savedAt: new Date().toISOString() },
          },
        })),
      saveCourse: (courseId, patch, custom) => {
        if (custom) {
          set((state) => ({
            customCourses: state.customCourses.map((course) =>
              course.id === courseId ? { ...course, ...patch } : course,
            ),
          }));
          return;
        }
        set((state) => ({
          coursePatches: {
            ...state.coursePatches,
            [courseId]: { ...state.coursePatches[courseId], ...patch },
          },
        }));
      },
      addCourse: (course) =>
        set((state) => ({ customCourses: [course, ...state.customCourses] })),
      hideCourse: (courseId) =>
        set((state) => ({
          deletedCourseIds: state.deletedCourseIds.includes(courseId)
            ? state.deletedCourseIds
            : [...state.deletedCourseIds, courseId],
        })),
      restoreCourse: (courseId) =>
        set((state) => ({
          deletedCourseIds: state.deletedCourseIds.filter((id) => id !== courseId),
        })),
      saveLesson: (lessonId, patch) =>
        set((state) => ({
          lessonPatches: {
            ...state.lessonPatches,
            [lessonId]: { ...state.lessonPatches[lessonId], ...patch },
          },
        })),
      addLesson: (courseId, lesson) =>
        set((state) => ({
          customLessons: {
            ...state.customLessons,
            [courseId]: [...(state.customLessons[courseId] ?? []), lesson],
          },
        })),
      hideLesson: (lessonId) =>
        set((state) => ({
          hiddenLessonIds: state.hiddenLessonIds.includes(lessonId)
            ? state.hiddenLessonIds
            : [...state.hiddenLessonIds, lessonId],
        })),
      restoreLesson: (lessonId) =>
        set((state) => ({
          hiddenLessonIds: state.hiddenLessonIds.filter((id) => id !== lessonId),
        })),
      addQuestion: (quizId, question) =>
        set((state) => ({
          extraQuestions: [
            ...state.extraQuestions,
            { id: question.id, quizId, question: { ...question, added: true } },
          ],
        })),
      removeQuestion: (questionId) =>
        set((state) => ({
          extraQuestions: state.extraQuestions.filter((item) => item.question.id !== questionId),
          hiddenQuestionIds: state.hiddenQuestionIds.includes(questionId)
            ? state.hiddenQuestionIds
            : [...state.hiddenQuestionIds, questionId],
        })),
      addAnnouncement: (announcement) =>
        set((state) => ({ announcementExtras: [announcement, ...state.announcementExtras] })),
      saveAnnouncement: (id, patch) => {
        const state = get();
        if (state.announcementExtras.some((item) => item.id === id)) {
          set({
            announcementExtras: state.announcementExtras.map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          });
          return;
        }
        set({
          announcementPatches: {
            ...state.announcementPatches,
            [id]: { ...state.announcementPatches[id], ...patch },
          },
        });
      },
      hideAnnouncement: (id) =>
        set((state) => ({
          deletedAnnouncementIds: [...state.deletedAnnouncementIds, id],
        })),
      saveGallery: (id, patch) =>
        set((state) => ({
          galleryPatches: {
            ...state.galleryPatches,
            [id]: { ...state.galleryPatches[id], ...patch },
          },
        })),
      addGallery: (item) =>
        set((state) => ({
          galleryPatches: {
            ...state.galleryPatches,
            [item.id]: {
              title: item.title,
              caption: item.caption,
              src: item.src,
              alt: item.alt,
              category: item.category,
            },
          },
        })),
      hideGallery: (id) =>
        set((state) => ({
          hiddenGalleryIds: state.hiddenGalleryIds.includes(id)
            ? state.hiddenGalleryIds
            : [...state.hiddenGalleryIds, id],
        })),
      restoreGallery: (id) =>
        set((state) => ({
          hiddenGalleryIds: state.hiddenGalleryIds.filter((item) => item !== id),
        })),
      resetDemo: () =>
        set((state) => ({
          ...initial,
          learnerId: state.learnerId,
          accountReady: state.accountReady,
          studentName: state.studentName,
          studentGoal: state.studentGoal,
          coursePatches: state.coursePatches,
          deletedCourseIds: state.deletedCourseIds,
          customCourses: state.customCourses,
          lessonPatches: state.lessonPatches,
          hiddenLessonIds: state.hiddenLessonIds,
          customLessons: state.customLessons,
          extraQuestions: state.extraQuestions,
          hiddenQuestionIds: state.hiddenQuestionIds,
          announcementExtras: state.announcementExtras,
          announcementPatches: state.announcementPatches,
          deletedAnnouncementIds: state.deletedAnnouncementIds,
          galleryPatches: state.galleryPatches,
          hiddenGalleryIds: state.hiddenGalleryIds,
        })),
    }),
    {
      name: "varam-demo-lms",
      partialize: (state) => ({
        learnerId: state.learnerId,
        studentName: state.studentName,
        studentGoal: state.studentGoal,
        entered: state.entered,
        enrolledIds: state.enrolledIds,
        completedLessonIds: state.completedLessonIds,
        courseCompletedAt: state.courseCompletedAt,
        lastLesson: state.lastLesson,
        attempts: state.attempts,
        activeQuiz: state.activeQuiz,
        assignmentDrafts: state.assignmentDrafts,
        coursePatches: state.coursePatches,
        deletedCourseIds: state.deletedCourseIds,
        customCourses: state.customCourses,
        lessonPatches: state.lessonPatches,
        hiddenLessonIds: state.hiddenLessonIds,
        customLessons: state.customLessons,
        extraQuestions: state.extraQuestions,
        hiddenQuestionIds: state.hiddenQuestionIds,
        announcementExtras: state.announcementExtras,
        announcementPatches: state.announcementPatches,
        deletedAnnouncementIds: state.deletedAnnouncementIds,
        galleryPatches: state.galleryPatches,
        hiddenGalleryIds: state.hiddenGalleryIds,
      }),
    },
  ),
);
