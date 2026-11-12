"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { RouteSkeleton } from "@/components/ui/primitives";
import { passMark } from "@/data/quizzes";
import { useCatalogState } from "@/hooks/use-catalog";
import { useStoreHydrated } from "@/hooks/use-hydrated";
import { findPresentedCourse, findPresentedQuiz, scoreQuiz } from "@/lib/catalog";
import { formatClock, formatDateTime } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { AssessmentCategory, Quiz, QuizAttempt } from "@/types";

function papersHref(category: AssessmentCategory) {
  if (category === "monthly") return "/lms/assessments";
  if (category === "final") return "/lms/exam";
  return "/lms/practice";
}

function papersLabel(category: AssessmentCategory) {
  if (category === "monthly") return "Back to monthly assessments";
  if (category === "final") return "Back to final exams";
  return "Back to practice papers";
}

function isField(target: EventTarget | null) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

function blankAnswer(value: number | null | undefined) {
  return value === null || value === undefined;
}

function attemptId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `attempt-${crypto.randomUUID()}`;
  return `attempt-${Date.now()}`;
}

function paletteLabel(position: number, answered: boolean, review: boolean, current: boolean) {
  const parts = [`Question ${position}`, answered ? "answered" : "unanswered"];
  if (review) parts.push("marked for review");
  if (current) parts.push("current");
  return parts.join(", ");
}

export function QuizRunner({ quizId }: { quizId: string }) {
  const hydrated = useStoreHydrated();
  const catalog = useCatalogState();
  const quiz = useMemo(() => findPresentedQuiz(quizId, catalog), [quizId, catalog]);
  const activeQuiz = useDemoStore((state) => state.activeQuiz);
  const attempts = useDemoStore((state) => state.attempts);
  const setActiveQuiz = useDemoStore((state) => state.setActiveQuiz);
  const patchActiveQuiz = useDemoStore((state) => state.patchActiveQuiz);
  const addAttempt = useDemoStore((state) => state.addAttempt);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const [shown, setShown] = useState<number | null>(null);

  const submittedRef = useRef(false);
  const warnedRef = useRef(false);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const paperHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const retakeFocus = useRef(false);

  const session = activeQuiz && activeQuiz.quizId === quizId ? activeQuiz : null;
  const endsAt = session?.endsAt ?? null;

  const courseTitle = quiz
    ? (findPresentedCourse(quiz.courseSlug, catalog)?.course.title ?? "Sample course")
    : "Sample course";

  const finish = useCallback(
    (timedOut: boolean) => {
      if (submittedRef.current) return;
      const paper = quiz;
      const active = useDemoStore.getState().activeQuiz;
      if (!paper || paper.questions.length === 0 || !active || active.quizId !== paper.id) return;
      submittedRef.current = true;
      const answers = paper.questions.map((_, index) => {
        const value = active.answers[index];
        return value === undefined ? null : value;
      });
      const scored = scoreQuiz(paper, answers);
      const attempt: QuizAttempt = {
        id: attemptId(),
        quizId: paper.id,
        courseSlug: paper.courseSlug,
        title: paper.title,
        category: paper.category,
        answers,
        correct: scored.correct,
        total: scored.total,
        percent: scored.percent,
        submittedAt: new Date().toISOString(),
        timedOut,
      };
      addAttempt(attempt);
      setResultId(attempt.id);
      setConfirmOpen(false);
      const outcome =
        scored.percent >= passMark ? "Demonstration pass." : "Below the demonstration pass mark.";
      setLive(
        `Demonstration paper submitted. ${scored.percent} percent. ${scored.correct} of ${scored.total} correct. ${outcome}`,
      );
      if (timedOut) toast("Time is up. Your demonstration paper was submitted.");
    },
    [addAttempt, quiz],
  );

  useEffect(() => {
    if (!hydrated || !quiz || quiz.questions.length === 0 || submittedRef.current) return;
    const active = useDemoStore.getState().activeQuiz;
    if (active?.quizId === quiz.id) {
      if (active.endsAt <= Date.now()) {
        const timeout = window.setTimeout(() => finish(true), 0);
        return () => window.clearTimeout(timeout);
      }
      return;
    }
    warnedRef.current = false;
    setActiveQuiz({
      quizId: quiz.id,
      answers: Array.from({ length: quiz.questions.length }, () => null),
      reviews: Array.from({ length: quiz.questions.length }, () => false),
      index: 0,
      endsAt: Date.now() + quiz.minutes * 60 * 1000,
    });
  }, [hydrated, quiz, setActiveQuiz, finish]);

  useLayoutEffect(() => {
    if (!hydrated || endsAt == null || resultId) return;
    const tick = () => {
      const active = useDemoStore.getState().activeQuiz;
      if (!active || active.quizId !== quizId || active.endsAt !== endsAt) return;
      const remaining = endsAt - Date.now();
      const next = Math.max(0, Math.ceil(remaining / 1000));
      setShown(next);
      if (submittedRef.current) return;
      if (remaining <= 0) {
        finish(true);
        return;
      }
      // Announce once when the clock reaches one minute. Do not announce every second.
      if (next <= 60 && !warnedRef.current) {
        warnedRef.current = true;
        setLive(next === 60 ? "60 seconds remaining." : "Less than 60 seconds remaining.");
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [hydrated, endsAt, quizId, resultId, finish]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      if (submittedRef.current || confirmOpen) return;
      const paper = quiz;
      const active = useDemoStore.getState().activeQuiz;
      if (!paper || paper.questions.length === 0 || !active || active.quizId !== paper.id) return;
      const target = event.target;
      const index = Math.min(paper.questions.length - 1, Math.max(0, active.index));
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (isField(target)) return;
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = Math.min(paper.questions.length - 1, Math.max(0, index + delta));
        if (next !== index) {
          useDemoStore.getState().patchActiveQuiz({ index: next });
          queueMicrotask(() => promptRef.current?.focus());
        }
        return;
      }
      if (event.key !== "1" && event.key !== "2" && event.key !== "3" && event.key !== "4") return;
      if (target instanceof HTMLTextAreaElement) return;
      if (target instanceof HTMLInputElement && target.type !== "radio") return;
      const option = Number(event.key) - 1;
      const question = paper.questions[index];
      if (!question || option >= question.options.length) return;
      const answers = paper.questions.map((_, position) => {
        const value = active.answers[position];
        return value === undefined ? null : value;
      });
      answers[index] = option;
      useDemoStore.getState().patchActiveQuiz({ answers, index });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, quiz]);

  const attempt = attempts.find((item) => item.id === resultId) ?? null;
  const history = attempts.filter((item) => item.quizId === quizId);

  useEffect(() => {
    if (attempt) {
      resultHeadingRef.current?.focus();
      return;
    }
    if (!retakeFocus.current || !session) return;
    retakeFocus.current = false;
    paperHeadingRef.current?.focus();
  }, [attempt, session]);

  function retake() {
    if (!quiz || quiz.questions.length === 0) return;
    submittedRef.current = false;
    warnedRef.current = false;
    retakeFocus.current = true;
    setLive("");
    setResultId(null);
    setActiveQuiz({
      quizId: quiz.id,
      answers: Array.from({ length: quiz.questions.length }, () => null),
      reviews: Array.from({ length: quiz.questions.length }, () => false),
      index: 0,
      endsAt: Date.now() + quiz.minutes * 60 * 1000,
    });
  }

  let body: React.ReactNode;
  if (!hydrated) {
    body = <RouteSkeleton />;
  } else if (!quiz) {
    body = (
      <EmptyPaper
        title="This paper is not available"
        text="It is not in the catalogue for this browser."
        href="/lms/practice"
        hrefLabel="Back to practice papers"
      />
    );
  } else if (quiz.questions.length === 0) {
    body = (
      <EmptyPaper
        title="This paper has no questions"
        text="There is nothing to score until questions are available in this browser."
        href={papersHref(quiz.category)}
        hrefLabel={papersLabel(quiz.category)}
      />
    );
  } else if (attempt) {
    body = (
      <QuizResult
        quiz={quiz}
        attempt={attempt}
        history={history}
        courseTitle={courseTitle}
        headingRef={resultHeadingRef}
        onRetake={retake}
      />
    );
  } else if (!session) {
    body = (
      <p role="status" className="text-sm text-muted-foreground">
        Preparing this demonstration paper.
      </p>
    );
  } else {
    const index = Math.min(Math.max(session.index, 0), quiz.questions.length - 1);
    const question = quiz.questions[index];
    const unanswered = quiz.questions.filter((_, position) => blankAnswer(session.answers[position])).length;
    const low = shown !== null && shown < 60;
    if (!question) {
      body = <RouteSkeleton />;
    } else {
      body = (
        <div className="space-y-6">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">{courseTitle}</p>
              <h1 ref={paperHeadingRef} tabIndex={-1} className="mt-2 font-display text-4xl text-foreground">
                {quiz.title}
              </h1>
            </div>
            <div className="rounded-3xl border border-border bg-card px-5 py-3 text-right" aria-live="off">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Time remaining</p>
              <p className={cn("font-display text-4xl tabular-nums", low && "text-brand-orange")}>
                {shown === null ? "--:--" : formatClock(shown)}
              </p>
              {low ? <p className="text-sm font-semibold text-brand-orange">Under one minute</p> : null}
            </div>
          </header>
          <p
            role="note"
            className="rounded-3xl border border-brand-orange/40 bg-brand-orange/10 px-5 py-4 text-sm leading-6"
          >
            Results stay in this browser. Scores are demonstration results stored in this browser, not official marks.
          </p>
          <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <section aria-label="Question palette" className="rounded-3xl border border-border bg-card p-4">
              <ol className="grid grid-cols-5 gap-2">
                {quiz.questions.map((item, position) => {
                  const current = position === index;
                  const answered = !blankAnswer(session.answers[position]);
                  const review = session.reviews[position] === true;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={cn(
                          "grid h-11 w-11 place-items-center rounded-full text-sm font-semibold",
                          answered ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                          review && "ring-2 ring-brand-orange",
                          current && "outline outline-2 outline-offset-2 outline-brand-blue",
                        )}
                        aria-current={current ? "true" : undefined}
                        aria-label={paletteLabel(position + 1, answered, review, current)}
                        onClick={() => {
                          patchActiveQuiz({ index: position });
                          queueMicrotask(() => promptRef.current?.focus());
                        }}
                      >
                        {position + 1}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full outline outline-2 outline-offset-2 outline-brand-blue" />
                  Current
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-primary" />
                  Answered
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full ring-2 ring-brand-orange" />
                  Marked for review
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-muted ring-1 ring-border" />
                  Unanswered
                </li>
              </ul>
            </section>
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div role="radiogroup" aria-labelledby="active-question" className="space-y-3">
                <h2 id="active-question" ref={promptRef} tabIndex={-1} className="font-display text-2xl">
                  <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
                    Question {index + 1} of {quiz.questions.length}
                  </span>
                  {question.prompt}
                </h2>
                {question.options.map((option, optionIndex) => {
                  const selected = session.answers[index] === optionIndex;
                  return (
                    <label
                      key={`${question.id}-${optionIndex}`}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-6 focus-within:ring-2 focus-within:ring-ring",
                        selected ? "border-brand-green bg-accent" : "border-border hover:bg-muted",
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={optionIndex}
                        checked={selected}
                        onChange={() => {
                          const answers = quiz.questions.map((_, position) => {
                            const value = session.answers[position];
                            return value === undefined ? null : value;
                          });
                          answers[index] = optionIndex;
                          patchActiveQuiz({ answers, index });
                        }}
                        className="mt-1 accent-primary"
                      />
                      <span>
                        <span className="font-semibold">{optionIndex + 1}. </span>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div role="group" aria-label="Paper controls" className="mt-6 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const next = Math.max(0, index - 1);
                    patchActiveQuiz({ index: next });
                    queueMicrotask(() => promptRef.current?.focus());
                  }}
                  disabled={index === 0}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const next = Math.min(quiz.questions.length - 1, index + 1);
                    patchActiveQuiz({ index: next });
                    queueMicrotask(() => promptRef.current?.focus());
                  }}
                  disabled={index === quiz.questions.length - 1}
                >
                  Next
                </Button>
                <Button
                  type="button"
                  variant={session.reviews[index] ? "accent" : "outline"}
                  aria-pressed={session.reviews[index] === true}
                  onClick={() => {
                    const reviews = quiz.questions.map((_, position) => session.reviews[position] === true);
                    reviews[index] = !reviews[index];
                    patchActiveQuiz({ reviews });
                  }}
                >
                  {session.reviews[index] ? "Marked for review" : "Mark for review"}
                </Button>
                <Button type="button" className="sm:ml-auto" onClick={() => setConfirmOpen(true)}>
                  Submit paper
                </Button>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Left and right arrow keys change the question unless an answer choice is focused. Keys 1 to 4 select an
                option.
              </p>
            </div>
          </div>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Submit this demonstration paper?"
            body={
              unanswered > 0
                ? `${unanswered} ${unanswered === 1 ? "question is" : "questions are"} still unanswered. The score is calculated in this browser from these answers. It is stored only on this device and is not an official mark.`
                : "The score is calculated in this browser from these answers. It is stored only on this device and is not an official mark."
            }
            confirmLabel="Submit paper"
            onConfirm={() => finish(false)}
          />
          <Button asChild variant="outline">
            <Link href={papersHref(quiz.category)}>{papersLabel(quiz.category)}</Link>
          </Button>
        </div>
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {live}
      </div>
      {body}
    </div>
  );
}

function EmptyPaper({
  title,
  text,
  href,
  hrefLabel,
}: {
  title: string;
  text: string;
  href: string;
  hrefLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border px-6 py-12 text-center">
      <h1 className="font-display text-3xl">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      <Button asChild className="mt-6">
        <Link href={href}>{hrefLabel}</Link>
      </Button>
    </div>
  );
}

function QuizResult({
  quiz,
  attempt,
  history,
  courseTitle,
  headingRef,
  onRetake,
}: {
  quiz: Quiz;
  attempt: QuizAttempt;
  history: QuizAttempt[];
  courseTitle: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRetake: () => void;
}) {
  const passed = attempt.percent >= passMark;
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">{courseTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{quiz.title}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl">
          Demonstration result
        </h1>
      </header>
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <p className={cn("font-display text-6xl", passed ? "text-brand-green" : "text-brand-orange")}>
          {attempt.percent}%
        </p>
        <p className="mt-3 text-lg font-semibold">
          {attempt.correct} / {attempt.total} correct
        </p>
        <p className="mt-2 font-display text-2xl">
          {passed ? "Demonstration pass" : "Below the demonstration pass mark"}
        </p>
        <p className="mt-2 text-sm font-semibold">Demonstration pass mark {passMark}%</p>
        {attempt.timedOut ? (
          <p className="mt-3 text-sm text-muted-foreground">Submitted because time ran out.</p>
        ) : null}
        <p
          role="note"
          className="mt-5 rounded-3xl border border-brand-orange/40 bg-brand-orange/10 px-5 py-4 text-sm leading-6"
        >
          This result stays in this browser. Scores are demonstration results stored in this browser, not official
          marks.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={onRetake}>
            Start another demonstration attempt
          </Button>
          <Button asChild variant="outline">
            <Link href={papersHref(quiz.category)}>{papersLabel(quiz.category)}</Link>
          </Button>
        </div>
      </section>
      <section aria-labelledby="review-heading" className="space-y-4">
        <h2 id="review-heading" className="font-display text-3xl">
          Review
        </h2>
        <ol className="space-y-4">
          {quiz.questions.map((question, index) => {
            const choice = attempt.answers[index];
            const learner = blankAnswer(choice) ? null : (question.options[choice as number] ?? null);
            const correct = question.options[question.correctIndex] ?? "";
            const matched = choice === question.correctIndex;
            const status = matched ? "Correct" : learner === null ? "Not answered" : "Incorrect";
            return (
              <li key={question.id} className="rounded-3xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
                  Question {index + 1} · {status}
                </p>
                <h3 className="mt-2 font-display text-2xl">{question.prompt}</h3>
                <p className="mt-3 text-sm leading-6">
                  <span className="font-semibold">Your answer: </span>
                  {learner ?? "Not answered"}
                </p>
                <p className="mt-1 text-sm leading-6">
                  <span className="font-semibold">Correct answer: </span>
                  {correct}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold text-foreground">Explanation: </span>
                  {question.explanation}
                </p>
              </li>
            );
          })}
        </ol>
      </section>
      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="font-display text-3xl">
          Attempt history
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Stored in this browser for this paper.</p>
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No attempts are stored yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl bg-muted px-4 py-3 text-sm"
              >
                <span>{formatDateTime(item.submittedAt)}</span>
                <span className="font-semibold">
                  {item.percent}% · {item.correct}/{item.total}
                  {item.timedOut ? " · Time expired" : ""}
                  {item.id === attempt.id ? " · This sitting" : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
