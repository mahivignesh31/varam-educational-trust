"use client";

import { PageHeader } from "@/components/admin/bits";
import { AnnouncementManager } from "@/components/admin/announcements";

export function TrainerAnnouncements() {
  return (
    <>
      <PageHeader
        eyebrow="Trainer workspace"
        title="Announcements"
        lede="Trainer workspace. Notices for trainers or for everyone. Adding or editing a notice stays in this browser."
      />
      <AnnouncementManager workspace="trainer" audiences={["all", "trainers"]} defaultAudience="trainers" />
    </>
  );
}
