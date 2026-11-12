"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RouteSkeleton } from "@/components/ui/primitives";
import type { AssessmentCategory, Quiz } from "@/types";
import { useCatalogState } from "@/hooks/use-catalog";
import { useStoreHydrated } from "@/hooks/use-hydrated";
import { assembleQuizzes, findPresentedCourse } from "@/lib/catalog";
import { useDemoStore } from "@/lib/store";

type CatalogView = "practice" | "monthly" | "final";

const pages: Record<
  CatalogView,
  {
    eyebrow: string;
    title: string;
    intro: string;
    groups: { key: string; title: string; category: AssessmentCategory; empty: string }[];
  }
> = {
  practice: {
    eyebrow: "Practice",
    title: "Practice papers",
    intro: "Category practice and fortnightly tests. You sit them in this browser.",
    groups: [
      {
        key: "practice",
        title: "Practice",
        category: "practice",
        empty: "No practice quizzes are listed.",
      },
      {
        key: "fortnightly",
        title: "Fortnightly",
        category: "fortnightly",
        empty: "No fortnightly tests are listed.",
      },
    ],
  },
  monthly: {
    eyebrow: "Assessments",
    title: "Monthly assessments",
    intro: "Monthly demonstration papers for the sample courses.",
    groups: [
      {
        key: "monthly",
        title: "Monthly",
        category: "monthly",
        empty: "No monthly assessments are listed.",
      },
    ],
  },
  final: {
    eyebrow: "Exam",
    title: "Final exams",
    intro: "Final demonstration papers for the sample courses.",
    groups: [
      {
        key: "final",
        title: "Final",
        category: "final",
        empty: "No final exams are listed.",
      },
    ],
  },
};

function attemptSummary(quizId: string, attempts: { quizId: string; percent: number }[]) {
  const mine = attempts.filter((attempt) => attempt.quizId === quizId);
  if (!mine.length) return { count: 0, best: null as number | null };
  return {
    count: mine.length,
    best: mine.reduce((highest, attempt) => Math.max(highest, attempt.percent), 0),
  };
}

function QuizRow({
  quiz,
  courseTitle,
  count,
  best,
  heading,
}: {
  quiz: Quiz;
  courseTitle: string;
  count: number;
  best: number | null;
  heading: "h2" | "h3";
}) {
  const Heading = heading;
  const questions = quiz.questions.length;
  return (
    <li>
      <article className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">{courseTitle}</p>
            <Heading className="mt-1 font-display text-2xl text-foreground">{quiz.title}</Heading>
            <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <div className="flex gap-1.5">
                <dt>Questions</dt>
                <dd className="font-semibold text-foreground">
                  {questions} {questions === 1 ? "question" : "questions"}
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt>Minutes</dt>
                <dd className="font-semibold text-foreground">{quiz.minutes}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>Attempts</dt>
                <dd className="font-semibold text-foreground">{count}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>Best</dt>
                <dd className="font-semibold text-foreground">{best === null ? "No score yet" : `${best}%`}</dd>
              </div>
            </dl>
          </div>
          <Button asChild>
            <Link href={`/lms/quiz/${quiz.id}`}>
              Open paper
              <span className="sr-only"> {quiz.title}</span>
            </Link>
          </Button>
        </div>
      </article>
    </li>
  );
}

export function QuizCatalog({ view }: { view: CatalogView }) {
  const hydrated = useStoreHydrated();
  const catalog = useCatalogState();
  const attempts = useDemoStore((state) => state.attempts);
  const quizzes = useMemo(() => assembleQuizzes(catalog), [catalog]);
  const page = pages[view];
  const multiple = page.groups.length > 1;

  if (!hydrated) return <RouteSkeleton />;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">{page.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">{page.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{page.intro}</p>
      </header>
      <p
        role="note"
        className="rounded-3xl border border-brand-orange/40 bg-brand-orange/10 px-5 py-4 text-sm leading-6 text-foreground"
      >
        Scores are demonstration results stored in this browser, not official marks.
      </p>
      {page.groups.map((group) => {
        const items = quizzes.filter((quiz) => quiz.category === group.category);
        return (
          <section key={group.key} aria-labelledby={`${group.key}-heading`} className="space-y-4">
            {multiple ? (
              <h2 id={`${group.key}-heading`} className="font-display text-3xl text-foreground">
                {group.title}
              </h2>
            ) : (
              <h2 id={`${group.key}-heading`} className="sr-only">
                {group.title}
              </h2>
            )}
            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border px-6 py-10 text-center">
                <p className="font-display text-2xl text-foreground">{group.empty}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  This group has no demonstration papers in the catalogue.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((quiz) => {
                  const summary = attemptSummary(quiz.id, attempts);
                  const courseTitle =
                    findPresentedCourse(quiz.courseSlug, catalog)?.course.title ?? "Sample course";
                  return (
                    <QuizRow
                      key={quiz.id}
                      quiz={quiz}
                      courseTitle={courseTitle}
                      count={summary.count}
                      best={summary.best}
                      heading={multiple ? "h3" : "h2"}
                    />
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
