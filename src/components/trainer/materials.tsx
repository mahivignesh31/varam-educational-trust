"use client";

import { PageHeader } from "@/components/admin/bits";
import { LessonManager } from "@/components/admin/lessons";

export function TrainerMaterials() {
  return (
    <>
      <PageHeader
        eyebrow="Trainer workspace"
        title="Materials"
        lede="Trainer workspace. Notes are listed with each lesson. New notes are saved with a lesson in this browser. Hiding a lesson hides its notes here and does not delete them on a server."
      />
      <LessonManager workspace="trainer" mode="materials" />
    </>
  );
}
