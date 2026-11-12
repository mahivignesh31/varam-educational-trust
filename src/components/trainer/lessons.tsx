"use client";

import { PageHeader } from "@/components/admin/bits";
import { LessonManager } from "@/components/admin/lessons";

export function TrainerLessons() {
  return (
    <>
      <PageHeader
        eyebrow="Trainer workspace"
        title="Lessons"
        lede="Trainer workspace. Add, edit, or hide a lesson in this browser. Hiding does not delete a lesson on a server."
      />
      <LessonManager workspace="trainer" mode="lessons" />
    </>
  );
}
