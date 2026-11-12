import type { Metadata } from "next";
import { QuizCatalog } from "@/components/assessments/quiz-list";

export const metadata: Metadata = {
  title: "Assessments",
  description: "Monthly demonstration papers. Scores stay in this browser and are not official marks.",
};

export default function Page() {
  return <QuizCatalog view="monthly" />;
}
