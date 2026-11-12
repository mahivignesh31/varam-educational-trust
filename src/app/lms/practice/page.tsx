import type { Metadata } from "next";
import { QuizCatalog } from "@/components/assessments/quiz-list";

export const metadata: Metadata = {
  title: "Practice",
  description:
    "Practice and fortnightly demonstration papers. Scores stay in this browser and are not official marks.",
};

export default function Page() {
  return <QuizCatalog view="practice" />;
}
