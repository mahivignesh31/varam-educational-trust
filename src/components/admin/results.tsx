"use client";

import { useEffect, useState } from "react";
import { EmptyState, PageHeader, TableFrame, Td, Th, THead, Tr } from "@/components/admin/bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { loadCampusAttempts, type CampusAttempt } from "@/lib/campus-stats";
import { downloadCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";

const record = "Score saved to the student account.";

export function ResultsTable({ showExport }: { showExport: boolean }) {
  const [attempts, setAttempts] = useState<CampusAttempt[] | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let current = true;
    loadCampusAttempts()
      .then((rows) => {
        if (!current) return;
        setAttempts(rows);
      })
      .catch((error: Error) => {
        if (!current) return;
        setAttempts([]);
        setLoadError(error.message);
      });
    return () => {
      current = false;
    };
  }, []);

  if (loadError) return <p className="text-destructive">{loadError}</p>;
  if (!attempts) return <p className="text-sm text-muted-foreground">Loading quiz attempts…</p>;
  const rows = attempts;

  function exportRows() {
    downloadCsv("student-attempts.csv", [
      ["student", "title", "category", "correct", "total", "percent", "submitted at", "timer", "record"],
      ...rows.map((attempt) => [
        attempt.studentName,
        attempt.title,
        attempt.category,
        String(attempt.correct),
        String(attempt.total),
        String(attempt.percent),
        formatDateTime(attempt.submittedAt),
        attempt.timedOut ? "Timer ended" : "Submitted",
        record,
      ]),
    ]);
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No quiz attempts yet"
        body="Scores appear here after a registered student submits a practice paper. Nothing is added until that happens."
      />
    );
  }

  return (
    <>
      {showExport ? (
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={exportRows}>
            Export CSV
          </Button>
        </div>
      ) : null}
      <TableFrame label="Quiz attempts saved to student accounts">
        <THead>
          <Th>Student</Th>
          <Th>Title</Th>
          <Th>Category</Th>
          <Th>Score</Th>
          <Th>When</Th>
          <Th>Timer</Th>
          <Th>Record</Th>
        </THead>
        <tbody>
          {rows.map((attempt) => (
            <Tr key={`${attempt.studentName}-${attempt.id}`}>
              <Td className="font-semibold">{attempt.studentName}</Td>
              <Td>{attempt.title}</Td>
              <Td className="capitalize">{attempt.category}</Td>
              <Td>
                {attempt.correct}/{attempt.total} ({attempt.percent}%)
              </Td>
              <Td>{formatDateTime(attempt.submittedAt)}</Td>
              <Td>{attempt.timedOut ? "Timer ended" : "Submitted"}</Td>
              <Td>
                <Badge tone="green">Account</Badge>
              </Td>
            </Tr>
          ))}
        </tbody>
      </TableFrame>
    </>
  );
}

export function AdminResults() {
  return (
    <>
      <PageHeader
        eyebrow="Admin workspace"
        title="Results"
        lede="Quiz attempts saved to registered student accounts."
      />
      <ResultsTable showExport />
    </>
  );
}
