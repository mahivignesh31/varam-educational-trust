"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/bits";
import { browserProgress } from "@/components/admin/model";
import { Card, CardContent, Progress } from "@/components/ui/primitives";
import { sampleStudents, sampleTrainers } from "@/data/people";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleAnnouncements, assembleCatalog } from "@/lib/catalog";
import { useDemoStore } from "@/lib/store";

export function TrainerDashboard() {
  const catalogState = useCatalogState();
  const attempts = useDemoStore((state) => state.attempts);
  const studentName = useDemoStore((state) => state.studentName);
  const completedLessonIds = useDemoStore((state) => state.completedLessonIds);
  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);
  const notices = useMemo(
    () =>
      assembleAnnouncements(catalogState).filter(
        (item) => item.audience === "all" || item.audience === "trainers",
      ),
    [catalogState],
  );
  const progress = browserProgress(catalog, completedLessonIds);
  const counts = [
    { label: "Courses", value: catalog.length, href: "/trainer/courses" },
    { label: "Sample students", value: sampleStudents.length, href: "/trainer/progress" },
    { label: "Attempts", value: attempts.length, href: "/trainer/results" },
    { label: "Announcements", value: notices.length, href: "/trainer/announcements" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Trainer workspace"
        title="Overview"
        lede="The five sample faculty groups are labels for this demonstration, not live class assignments. Changes you make stay in this browser."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.label}>
            <CardContent>
              <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
              <p className="mt-2 font-display text-4xl text-foreground">{item.value}</p>
              <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-brand-blue underline underline-offset-4">
                Open {item.label.toLowerCase()}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent>
          <p className="text-sm font-semibold text-muted-foreground">Demo student in this browser</p>
          <p className="mt-2 font-display text-3xl text-foreground">{studentName || "Demo Student"}</p>
          <div className="mt-4 max-w-md">
            <Progress value={progress} label="Visible lessons marked complete" />
          </div>
        </CardContent>
      </Card>
      <section className="space-y-3">
        <h2 className="font-display text-2xl text-foreground">Sample faculty labels</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {sampleTrainers.map((trainer) => {
            const count = catalog.filter((course) => course.instructor === trainer.name).length;
            return (
              <Link
                key={trainer.id}
                href={`/trainer/courses#${trainer.id}`}
                className="rounded-3xl border border-border bg-card p-5 hover:bg-muted"
              >
                <span className="block font-semibold text-foreground">{trainer.name}</span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {trainer.focus} · {count} visible {count === 1 ? "course" : "courses"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
