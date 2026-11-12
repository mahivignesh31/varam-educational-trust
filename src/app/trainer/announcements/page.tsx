import type { Metadata } from "next";
import { TrainerAnnouncements } from "@/components/trainer/announcements";

export const metadata: Metadata = { title: "Trainer announcements" };

export default function Page() {
  return <TrainerAnnouncements />;
}
