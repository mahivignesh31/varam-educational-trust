"use client";

import { PageHeader } from "@/components/admin/bits";
import { ResultsTable } from "@/components/admin/results";

export function TrainerResults() {
  return (
    <>
      <PageHeader
        eyebrow="Trainer workspace"
        title="Results"
        lede="Trainer workspace. This table lists attempts stored in this browser. It does not add sample scores, and a percentage here is not an official result."
      />
      <ResultsTable showExport />
    </>
  );
}
