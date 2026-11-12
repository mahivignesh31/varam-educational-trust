"use client";

import Link from "next/link";
import { useState } from "react";
import { downloadNotes } from "@/components/lms/download-notes";
import { EmptyState } from "@/components/lms/empty-state";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { flatLessons } from "@/data/courses";
import type { Course, Lesson, LessonMaterial } from "@/types";

type MaterialRow = {
  key: string;
  course: Course;
  lesson: Lesson;
  material: LessonMaterial;
};

export function MaterialsView() {
  const { enrolled } = useStudentWorkspace();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const rows: MaterialRow[] = enrolled.flatMap(({ course }) =>
    flatLessons(course).flatMap((lesson) =>
      lesson.materials.map((material) => ({
        key: `${course.id}:${lesson.id}:${material.id}`,
        course,
        lesson,
        material,
      })),
    ),
  );
  const active = rows.find((row) => row.key === openKey);

  return (
    <div className="space-y-6">
      <PageHeader title="Study Materials">
        <p>
          Notes for courses you are enrolled in. Reading and downloading happen in this browser. The download is a
          text file, not a PDF from a server.
        </p>
      </PageHeader>
      {enrolled.length === 0 ? (
        <EmptyState
          title="Enroll to see notes"
          body="Study materials are listed for enrolled courses. Choose a course first."
        >
          <Button asChild>
            <Link href="/lms/courses">Explore courses</Link>
          </Button>
        </EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No notes on these courses"
          body="The courses in My Courses do not have study notes in this browser yet."
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{row.material.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {row.course.title} · {row.lesson.title}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => setOpenKey(row.key)}>
                  Read
                </Button>
                <Button type="button" onClick={() => downloadNotes(row.material.title, row.material.body)}>
                  Download .txt
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={Boolean(active)} onOpenChange={(open) => { if (!open) setOpenKey(null); }}>
        <DialogContent>
          <DialogTitle className="pr-8 font-display text-2xl">{active?.material.title ?? "Study notes"}</DialogTitle>
          {active ? (
            <>
              <DialogDescription className="mt-2 text-sm text-muted-foreground">
                {active.course.title} · {active.lesson.title}
              </DialogDescription>
              <div className="mt-4">
                <Button type="button" onClick={() => downloadNotes(active.material.title, active.material.body)}>
                  Download .txt
                </Button>
              </div>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-6">{active.material.body}</div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Shown from the sample notes in this browser. The download is a text file named from the note title.
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
