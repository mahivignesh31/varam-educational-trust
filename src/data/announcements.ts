import type { Announcement } from "@/types";

export const seedAnnouncements: Announcement[] = [
  {
    id: "ann-welcome",
    title: "This campus is a demonstration",
    body: "Lesson ticks, quiz scores, and the display name are stored in this browser only. They are not official student records and they do not sync to another device.",
    audience: "all",
    pinned: true,
    createdAt: "2026-04-01T09:00:00.000Z",
  },
  {
    id: "ann-practice",
    title: "Practice papers are sample questions",
    body: "The question banks were written for this frontend demonstration. A score is calculated on this device. It is not an official examination result.",
    audience: "students",
    pinned: false,
    createdAt: "2026-04-06T09:00:00.000Z",
  },
  {
    id: "ann-trainers",
    title: "Trainer tools edit the local demo",
    body: "Courses, notes, and questions you add here stay in this browser. They do not publish to a live class list.",
    audience: "trainers",
    pinned: false,
    createdAt: "2026-04-08T09:00:00.000Z",
  },
];
