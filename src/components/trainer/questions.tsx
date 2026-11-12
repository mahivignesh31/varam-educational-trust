"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ErrorNote, Field, PageHeader, TableFrame, Td, Th, THead, Tr, saved } from "@/components/admin/bits";
import { browserId } from "@/components/admin/model";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge, Card, CardContent, Input, Select, Textarea } from "@/components/ui/primitives";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleQuizzes } from "@/lib/catalog";
import { useDemoStore } from "@/lib/store";
import type { Question, Quiz } from "@/types";

type QuestionRow = { quiz: Quiz; question: Question };

export function TrainerQuestions() {
  const catalogState = useCatalogState();
  const addQuestion = useDemoStore((state) => state.addQuestion);
  const removeQuestion = useDemoStore((state) => state.removeQuestion);
  const quizzes = useMemo(() => assembleQuizzes(catalogState), [catalogState]);
  const [quizId, setQuizId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [quizFilter, setQuizFilter] = useState("all");
  const [viewing, setViewing] = useState<QuestionRow | null>(null);
  const [removing, setRemoving] = useState<QuestionRow | null>(null);

  const selectedQuiz = quizzes.some((quiz) => quiz.id === quizId) ? quizId : (quizzes[0]?.id ?? "");
  const query = search.trim().toLowerCase();
  const rows = quizzes
    .filter((quiz) => quizFilter === "all" || quiz.id === quizFilter)
    .flatMap((quiz) =>
      quiz.questions
        .filter((question) => !query || `${question.prompt} ${quiz.title}`.toLowerCase().includes(query))
        .map((question) => ({ quiz, question })),
    );

  function onAdd(event: FormEvent) {
    event.preventDefault();
    if (!selectedQuiz || !prompt.trim() || !explanation.trim() || options.some((option) => !option.trim())) {
      setError("Choose a quiz and complete the prompt, four options, and an explanation.");
      return;
    }
    addQuestion(selectedQuiz, {
      id: browserId("added"),
      prompt: prompt.trim(),
      options: options.map((option) => option.trim()),
      correctIndex,
      explanation: explanation.trim(),
    });
    setPrompt("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setExplanation("");
    setError("");
    saved();
  }

  return (
    <>
      <PageHeader
        eyebrow="Trainer workspace"
        title="Question bank"
        lede="Sample questions are view only. Questions you add are stored in this browser and are included in the quiz you choose."
      />
      <Card>
        <CardContent>
          <h2 className="font-display text-2xl">Add a question</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Added questions are stored in this browser. To change one, remove it and add it again.
          </p>
          <form className="mt-5 grid gap-4" onSubmit={onAdd}>
            <Field id="question-quiz" label="Quiz">
              <Select id="question-quiz" value={selectedQuiz} onChange={(event) => setQuizId(event.target.value)}>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="question-prompt" label="Prompt">
              <Textarea id="question-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              {options.map((option, index) => (
                <Field key={index} id={`question-option-${index + 1}`} label={`Option ${index + 1}`}>
                  <Input
                    id={`question-option-${index + 1}`}
                    value={option}
                    onChange={(event) => {
                      const next = [...options];
                      next[index] = event.target.value;
                      setOptions(next);
                    }}
                  />
                </Field>
              ))}
            </div>
            <Field id="question-correct" label="Correct option">
              <Select
                id="question-correct"
                value={String(correctIndex)}
                onChange={(event) => setCorrectIndex(Number(event.target.value))}
              >
                <option value="0">Option 1</option>
                <option value="1">Option 2</option>
                <option value="2">Option 3</option>
                <option value="3">Option 4</option>
              </Select>
            </Field>
            <Field id="question-explanation" label="Explanation">
              <Textarea
                id="question-explanation"
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
              />
            </Field>
            {error ? <ErrorNote>{error}</ErrorNote> : null}
            <div>
              <Button type="submit">Add question</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-[1fr_18rem]">
        <Field id="question-search" label="Search questions">
          <Input
            id="question-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Prompt or quiz title"
          />
        </Field>
        <Field id="question-filter" label="Quiz">
          <Select id="question-filter" value={quizFilter} onChange={(event) => setQuizFilter(event.target.value)}>
            <option value="all">All quizzes</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm leading-6 text-muted-foreground">
          No questions match this search.
        </p>
      ) : (
        <TableFrame label="Question bank">
          <THead>
            <Th>Quiz</Th>
            <Th>Prompt</Th>
            <Th>Correct option</Th>
            <Th>Source</Th>
            <Th>Actions</Th>
          </THead>
          <tbody>
            {rows.map((row) => (
              <Tr key={row.question.id}>
                <Td>{row.quiz.title}</Td>
                <Td className="max-w-sm font-semibold">{row.question.prompt}</Td>
                <Td>{row.question.options[row.question.correctIndex] ?? "—"}</Td>
                <Td>
                  <Badge tone={row.question.added ? "orange" : "muted"}>
                    {row.question.added ? "Stored in this browser" : "View only"}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setViewing(row)}>
                      View
                    </Button>
                    {row.question.added ? (
                      <Button type="button" size="sm" variant="destructive" onClick={() => setRemoving(row)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableFrame>
      )}
      <Dialog open={Boolean(viewing)} onOpenChange={(open) => { if (!open) setViewing(null); }}>
        {viewing ? (
          <DialogContent>
            <DialogTitle className="pr-10 font-display text-2xl">{viewing.quiz.title}</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
              {viewing.question.added
                ? "Added questions are stored in this browser."
                : "This sample question is view only."}
            </DialogDescription>
            <p className="mt-4 text-sm font-semibold leading-6">{viewing.question.prompt}</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              {viewing.question.options.map((option, index) => (
                <li key={`${viewing.question.id}-${index}`}>
                  {option}
                  {index === viewing.question.correctIndex ? (
                    <Badge tone="green" className="ml-2">
                      Correct
                    </Badge>
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{viewing.question.explanation}</p>
          </DialogContent>
        ) : null}
      </Dialog>
      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
        title="Remove this question from this browser?"
        body="This removes a question you added on this device. Sample questions stay as they are."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (!removing) return;
          removeQuestion(removing.question.id);
          saved();
          setRemoving(null);
        }}
      />
    </>
  );
}
