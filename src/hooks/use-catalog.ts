"use client";

import { useShallow } from "zustand/react/shallow";
import { useDemoStore } from "@/lib/store";

export function useCatalogState() {
  return useDemoStore(
    useShallow((state) => ({
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
  );
}
