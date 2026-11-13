"use client";

import { ActionLink } from "@/components/auth/action-link";
import { courseIconMap } from "@/components/course-icon";
import { Button } from "@/components/ui/button";
import { RouteSkeleton } from "@/components/ui/primitives";
import { courses } from "@/data/courses";
import { useCatalogState } from "@/hooks/use-catalog";
import { useStoreHydrated } from "@/hooks/use-hydrated";
import { courseProgress, presentCourse } from "@/lib/catalog";
import { useDemoStore } from "@/lib/store";

export function CertificateList() {
  const hydrated = useStoreHydrated();
  const catalog = useCatalogState();
  const completedLessonIds = useDemoStore((state) => state.completedLessonIds);
  const courseCompletedAt = useDemoStore((state) => state.courseCompletedAt);

  if (!hydrated) return <RouteSkeleton />;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">Certificates</p>
        <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">Sample certificates</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Each seed course has a sample certificate drawn in this browser. A completion note appears when every lesson
          is marked complete here.
        </p>
      </header>
      <p
        role="note"
        className="rounded-3xl border border-brand-orange/40 bg-brand-orange/10 px-5 py-4 text-sm leading-6"
      >
        These pages are demonstration documents. They are not official, accredited, or verifiable credentials.
      </p>
      {courses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border px-6 py-10 text-center">
          <h2 className="font-display text-2xl">No courses are listed</h2>
          <p className="mt-2 text-sm text-muted-foreground">The seed catalogue has no courses to preview.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => {
            const presented = presentCourse(course, catalog);
            const progress = courseProgress(presented, completedLessonIds);
            const completedAt = courseCompletedAt[course.id];
            const status =
              progress >= 100 && completedAt ? "Completion recorded in this browser" : "Preview";
            const Icon = courseIconMap[presented.icon];
            return (
              <li key={course.id}>
                <article className="rounded-3xl border border-border bg-card p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-brand-green">
                        <Icon aria-hidden />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
                          {presented.category}
                        </p>
                        <h2 className="mt-1 font-display text-2xl">{presented.title}</h2>
                        <p className="mt-2 text-sm font-semibold">{status}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {progress}% of lessons marked complete in this browser
                        </p>
                      </div>
                    </div>
                    <Button asChild>
                      <ActionLink href={`/lms/certificates/${course.slug}`}>
                        View certificate
                        <span className="sr-only"> for {presented.title}</span>
                      </ActionLink>
                    </Button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
