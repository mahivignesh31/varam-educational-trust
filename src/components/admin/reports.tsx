"use client";

import { BarPanel } from "@/components/admin/charts";
import { EmptyState, PageHeader, SrTable } from "@/components/admin/bits";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/primitives";
import { sampleStudents } from "@/data/people";
import { downloadCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { useDemoStore } from "@/lib/store";

export function AdminReports() {
  const attempts = useDemoStore((state) => state.attempts);
  const sampleData = sampleStudents.map((student) => ({
    name: student.name.replace("Sample Learner ", "Learner "),
    value: student.progress,
  }));
  const attemptData = attempts.map((attempt, index) => ({
    name: `${index + 1}. ${attempt.title.length > 22 ? `${attempt.title.slice(0, 22)}…` : attempt.title}`,
    value: attempt.percent,
  }));

  function exportSample() {
    downloadCsv("sample-roster.csv", [
      ["name", "email", "program", "progress", "status", "demonstration record"],
      ...sampleStudents.map((student) => [
        student.name,
        student.email,
        student.program,
        String(student.progress),
        student.status,
        "Sample roster — not real learners",
      ]),
    ]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin demonstration"
        title="Reports"
        lede="The first chart is the sample roster, not live enrolment. The second chart uses attempt percentages stored in this browser, or stays empty when there are none."
        actions={
          <Button type="button" variant="outline" onClick={exportSample}>
            Export sample CSV
          </Button>
        }
      />
      <Card>
        <CardContent>
          <figure>
            <figcaption className="mb-4 text-sm font-semibold text-foreground">
              Sample roster — not real learners
            </figcaption>
            <BarPanel data={sampleData} label="Sample progress" />
          </figure>
          <SrTable
            caption="Sample roster progress"
            headers={["Name", "Program", "Progress", "Demonstration record"]}
            rows={sampleStudents.map((student) => [
              student.name,
              student.program,
              `${student.progress}%`,
              "Sample roster — not real learners",
            ])}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {attempts.length === 0 ? (
            <EmptyState
              title="No local attempts"
              body="When a practice paper is submitted on this device, its percentage is charted here. This report does not invent scores."
            />
          ) : (
            <figure>
              <figcaption className="mb-4 text-sm font-semibold text-foreground">
                Attempt percentages stored in this browser. Not official results.
              </figcaption>
              <BarPanel data={attemptData} label="Percent" />
              <SrTable
                caption="Attempt percentages stored in this browser"
                headers={["Title", "Percent", "Submitted", "Demonstration record"]}
                rows={attempts.map((attempt) => [
                  attempt.title,
                  `${attempt.percent}%`,
                  formatDateTime(attempt.submittedAt),
                  "Score stored in this browser. Not an official result.",
                ])}
              />
            </figure>
          )}
        </CardContent>
      </Card>
    </>
  );
}
