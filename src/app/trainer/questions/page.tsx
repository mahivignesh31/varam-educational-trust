import type { Metadata } from "next";
import { TrainerQuestions } from "@/components/trainer/questions";

export const metadata: Metadata = { title: "Trainer questions" };

export default function Page() {
  return <TrainerQuestions />;
}
