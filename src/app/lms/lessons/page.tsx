import type { Metadata } from "next";
import { LessonsView } from "@/components/lms/lessons-view";

export const metadata: Metadata = {
  title: "Video Lessons",
  description: "Video lessons from the demonstration catalog.",
};

export default function Page() {
  return <LessonsView />;
}
