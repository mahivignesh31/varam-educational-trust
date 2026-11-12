"use client";

import { useMemo, useState } from "react";
import { Field, PageHeader, TableFrame, Td, Th, THead, Tr } from "@/components/admin/bits";
import { Input } from "@/components/ui/primitives";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleCatalog, assembleQuizzes } from "@/lib/catalog";
import Link from "next/link";

export function AdminAssessments() {
  const catalogState = useCatalogState();
  const quizzes = useMemo(() => assembleQuizzes(catalogState), [catalogState]);
  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const rows = quizzes.filter((quiz) => {
    const course = catalog.find((item) => item.slug === quiz.courseSlug)?.title ?? quiz.courseSlug;
    return !query || `${quiz.title} ${quiz.category} ${course}`.toLowerCase().includes(query);
  });

  return (
    <>
      <PageHeader
        eyebrow="Admin workspace"
        title="Assessments"
        lede="Open a title to start that quiz. The score is saved to the signed-in account."
      />
      <Field id="assessment-search" label="Search assessments">
        <Input
          id="assessment-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Title, course, or category"
        />
      </Field>
      {rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm leading-6 text-muted-foreground">
          No assessments match this search.
        </p>
      ) : (
        <TableFrame label="Assessments">
          <THead>
            <Th>Quiz</Th>
            <Th>Course</Th>
            <Th>Category</Th>
            <Th>Questions</Th>
            <Th>Minutes</Th>
          </THead>
          <tbody>
            {rows.map((quiz) => {
              const course = catalog.find((item) => item.slug === quiz.courseSlug)?.title ?? quiz.courseSlug;
              return (
                <Tr key={quiz.id}>
                  <Td>
                    <Link
                      href={`/lms/quiz/${quiz.id}`}
                      className="font-semibold text-brand-blue underline underline-offset-4"
                    >
                      {quiz.title}
                    </Link>
                  </Td>
                  <Td>{course}</Td>
                  <Td className="capitalize">{quiz.category}</Td>
                  <Td>{quiz.questions.length}</Td>
                  <Td>{quiz.minutes}</Td>
                </Tr>
              );
            })}
          </tbody>
        </TableFrame>
      )}
    </>
  );
}
