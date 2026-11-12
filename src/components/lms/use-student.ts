"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleCatalog, findPresentedCourse } from "@/lib/catalog";
import { useDemoStore } from "@/lib/store";

export function useStudentWorkspace() {
  const catalogState = useCatalogState();
  const student = useDemoStore(
    useShallow((state) => ({
      studentName: state.studentName,
      studentGoal: state.studentGoal,
      enrolledIds: state.enrolledIds,
      completedLessonIds: state.completedLessonIds,
      courseCompletedAt: state.courseCompletedAt,
      lastLesson: state.lastLesson,
      attempts: state.attempts,
      assignmentDrafts: state.assignmentDrafts,
      setProfile: state.setProfile,
      enroll: state.enroll,
      unenroll: state.unenroll,
      setLastLesson: state.setLastLesson,
      toggleLesson: state.toggleLesson,
      saveAssignment: state.saveAssignment,
      restoreCourse: state.restoreCourse,
      restoreLesson: state.restoreLesson,
      resetDemo: state.resetDemo,
    })),
  );

  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);
  const enrolled = useMemo(
    () =>
      student.enrolledIds.flatMap((id) => {
        const found = findPresentedCourse(id, catalogState);
        return found ? [{ course: found.course, hidden: found.hidden }] : [];
      }),
    [catalogState, student.enrolledIds],
  );
  const learningCatalog = useMemo(
    () => [...catalog, ...enrolled.filter((item) => item.hidden).map((item) => item.course)],
    [catalog, enrolled],
  );

  return { catalogState, catalog, enrolled, learningCatalog, ...student };
}
