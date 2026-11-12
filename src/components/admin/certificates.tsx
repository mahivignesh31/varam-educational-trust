"use client";

import { useMemo } from "react";
import { PageHeader, TableFrame, Td, Th, THead, Tr } from "@/components/admin/bits";
import { Badge, Progress } from "@/components/ui/primitives";
import { flatLessons, seedCourseSlugs } from "@/data/courses";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleCatalog, courseProgress } from "@/lib/catalog";
import { useDemoStore } from "@/lib/store";
import Link from "next/link";

export function AdminCertificates() {
  const catalogState = useCatalogState();
  const completedLessonIds = useDemoStore((state) => state.completedLessonIds);
  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);

  return (
    <>
      <PageHeader
        eyebrow="Admin demonstration"
        title="Certificates"
        lede="A course shows as complete here only when every visible lesson was marked complete in this browser. That is not a verified credential, and this page does not check an official record."
      />
      {catalog.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm leading-6 text-muted-foreground">
          No visible courses. Restore a hidden course to see its progress again.
        </p>
      ) : (
        <TableFrame label="Certificate preview status">
          <THead>
            <Th>Course</Th>
            <Th>Progress in this browser</Th>
            <Th>Preview</Th>
          </THead>
          <tbody>
            {catalog.map((course) => {
              const progress = courseProgress(course, completedLessonIds);
              const ready = progress === 100 && flatLessons(course).length > 0;
              const seed = !course.custom && seedCourseSlugs.has(course.slug);
              return (
                <Tr key={course.id}>
                  <Td className="font-semibold">{course.title}</Td>
                  <Td className="min-w-48">
                    <Progress value={progress} label={ready ? "Marked complete in this browser" : "Not complete in this browser"} />
                    <Badge tone={ready ? "green" : "muted"} className="mt-2">
                      {ready ? "100% of visible lessons" : "Not complete"}
                    </Badge>
                  </Td>
                  <Td>
                    {seed ? (
                      <Link
                        href={`/lms/certificates/${course.slug}`}
                        className="font-semibold text-brand-blue underline underline-offset-4"
                      >
                        Open preview
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">No preview for courses added in this browser</span>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </TableFrame>
      )}
      <p className="text-sm leading-6 text-muted-foreground">
        The preview link opens a sample page for an original course. It does not confirm that a certificate was issued.
      </p>
    </>
  );
}
