"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarPanel } from "@/components/admin/charts";
import { PageHeader, SrTable } from "@/components/admin/bits";
import { Card, CardContent } from "@/components/ui/primitives";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleAnnouncements, assembleCatalog } from "@/lib/catalog";
import { loadStudentStats, type StudentStat } from "@/lib/campus-stats";

export function AdminDashboard() {
  const catalogState = useCatalogState();
  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);
  const announcements = useMemo(() => assembleAnnouncements(catalogState), [catalogState]);
  const [students, setStudents] = useState<StudentStat[] | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let current = true;
    loadStudentStats(catalog)
      .then((rows) => {
        if (!current) return;
        setStudents(rows);
        setLoadError("");
      })
      .catch((error: Error) => {
        if (!current) return;
        setStudents([]);
        setLoadError(error.message);
      });
    return () => {
      current = false;
    };
  }, [catalog]);

  const attemptCount = students?.reduce((sum, row) => sum + row.attempts, 0) ?? 0;
  const enrolmentCount = students?.reduce((sum, row) => sum + row.enrolled, 0) ?? 0;
  const studentCount = students?.length;
  const counts = [
    { label: "Courses", value: catalog.length, note: "On the campus", href: "/admin/courses" },
    { label: "Students", value: studentCount ?? "…", note: "Registered accounts", href: "/admin/students" },
    { label: "Enrolments", value: students ? enrolmentCount : "…", note: "Courses students have opened", href: "/admin/students" },
    { label: "Attempts", value: students ? attemptCount : "…", note: "Quiz attempts on student accounts", href: "/admin/results" },
  ];
  const chart = (students ?? []).map((student) => ({
    name: student.name.length > 18 ? `${student.name.slice(0, 16)}…` : student.name,
    value: student.progress,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Admin workspace"
        title="Dashboard"
        lede="These counts come from registered accounts and the progress saved to those accounts."
      />
      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.label}>
            <CardContent>
              <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
              <p className="mt-2 font-display text-4xl text-foreground">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>
              <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-brand-blue underline underline-offset-4">
                Open {item.label.toLowerCase()}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{announcements.length} campus notices are visible to students.</p>
      <Card>
        <CardContent>
          <figure>
            <figcaption className="mb-4 text-sm font-semibold text-foreground">Student progress</figcaption>
            {students && students.length > 0 ? <BarPanel data={chart} label="Progress" /> : null}
          </figure>
          {students === null ? (
            <p className="text-sm leading-6 text-muted-foreground">Loading registered students…</p>
          ) : students.length === 0 ? (
            <p className="text-sm leading-6 text-muted-foreground">No students have registered yet.</p>
          ) : (
            <SrTable
              caption="Registered student progress"
              headers={["Name", "Enrolled courses", "Progress"]}
              rows={(students ?? []).map((student) => [student.name, student.program, `${student.progress}%`])}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
