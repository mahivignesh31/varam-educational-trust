import type { Metadata } from "next";
import { TrainerCourses } from "@/components/trainer/courses";

export const metadata: Metadata = { title: "Trainer courses" };

export default function Page() {
  return <TrainerCourses />;
}
