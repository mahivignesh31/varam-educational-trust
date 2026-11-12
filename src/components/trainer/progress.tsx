"use client";

import { PageHeader } from "@/components/admin/bits";
import { RosterTable } from "@/components/admin/students";

export function TrainerProgress() {
  return (
    <>
      <PageHeader
        eyebrow="Trainer workspace"
        title="Student progress"
        lede="Trainer workspace. The sample roster is read only. The live row is the demo student in this browser. These figures are not official learner records."
      />
      <RosterTable exportable={false} />
    </>
  );
}
