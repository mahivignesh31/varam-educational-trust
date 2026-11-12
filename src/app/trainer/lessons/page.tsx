import type { Metadata } from "next";
import { TrainerLessons } from "@/components/trainer/lessons";

export const metadata: Metadata = { title: "Trainer lessons" };

export default function Page() {
  return <TrainerLessons />;
}
