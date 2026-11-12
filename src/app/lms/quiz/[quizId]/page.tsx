import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/assessments/quiz-runner";
import { findQuiz, quizStaticParams } from "@/data/quizzes";

export const dynamicParams = false;

export function generateStaticParams() {
  return quizStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ quizId: string }>;
}): Promise<Metadata> {
  const { quizId } = await params;
  const quiz = findQuiz(quizId);
  return {
    title: quiz?.title ?? "Quiz",
    description: "Demonstration paper. The score stays in this browser and is not an official mark.",
  };
}

export default async function Page({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  if (!findQuiz(quizId)) notFound();
  return <QuizRunner quizId={quizId} />;
}
