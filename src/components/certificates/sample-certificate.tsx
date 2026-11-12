"use client";

import { Printer } from "lucide-react";
import Link from "next/link";
import { TrustLogo } from "@/components/layout/chrome";
import { Button } from "@/components/ui/button";
import { RouteSkeleton } from "@/components/ui/primitives";
import { organization } from "@/data/organization";
import { useCatalogState } from "@/hooks/use-catalog";
import { useStoreHydrated } from "@/hooks/use-hydrated";
import { courseProgress, findPresentedCourse } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { useDemoStore } from "@/lib/store";

function certificateNumber(slug: string, iso: string) {
  const year = new Date(iso).getFullYear();
  return `VARAM-${slug.toUpperCase()}-${Number.isFinite(year) ? year : new Date().getFullYear()}`;
}

export function CertificateView({ courseSlug }: { courseSlug: string }) {
  const hydrated = useStoreHydrated();
  const catalog = useCatalogState();
  const { profile } = useAuth();
  const studentName = useDemoStore((state) => state.studentName);
  const completedLessonIds = useDemoStore((state) => state.completedLessonIds);
  const courseCompletedAt = useDemoStore((state) => state.courseCompletedAt);
  const match = findPresentedCourse(courseSlug, catalog);

  if (!hydrated) return <RouteSkeleton />;

  if (!match) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-dashed border-border px-6 py-12 text-center">
        <h1 className="font-display text-3xl">This sample certificate is not available</h1>
        <p className="mt-2 text-sm text-muted-foreground">The course is not in the catalogue on this device.</p>
        <Button asChild className="mt-6">
          <Link href="/lms/certificates">All sample certificates</Link>
        </Button>
      </div>
    );
  }

  const course = match.course;
  const progress = courseProgress(course, completedLessonIds);
  const completedAt = courseCompletedAt[course.id];
  const complete = progress >= 100 && Boolean(completedAt);
  const status = complete ? "Course completed" : "Course not finished yet";
  const todayIso = new Date().toISOString();
  const dateIso = completedAt ?? todayIso;
  const staff = profile?.role === "admin" || profile?.role === "trainer";
  const name = staff ? "" : studentName.trim() || "Learner";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <style>{`
        #sample-certificate { background-color: #ffffff; color: #14213d; }
        @media print {
          header, nav, aside, footer, .no-print { display: none !important; }
          body * { visibility: hidden; }
          #sample-certificate, #sample-certificate * { visibility: visible; }
          #sample-certificate, #sample-certificate * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #sample-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">Certificate</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{course.title}</h1>
          <p className="mt-2 text-sm font-semibold">{status}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {progress}% of lessons are complete. Print or save a PDF from the browser when the course is finished.
          </p>
          {staff ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This sign-in is the Trust admin, so the certificate does not use that login as the student name. A student sees their own name here after they finish the course.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="no-print">
            <Link href="/lms/certificates">All certificates</Link>
          </Button>
          <Button type="button" className="no-print" onClick={() => window.print()}>
            <Printer aria-hidden />
            Print / Save as PDF
          </Button>
        </div>
      </div>
      <article
        id="sample-certificate"
        aria-label={complete ? "Course completion certificate" : "Course not finished"}
        className="rounded-3xl bg-white p-2 text-[#14213D] shadow-[0_24px_60px_-42px_rgba(20,33,61,0.55)] sm:p-3"
        style={{ border: "10px solid #00A651", backgroundColor: "#ffffff", color: "#14213D" }}
      >
        <div
          className="rounded-[1.25rem] bg-white px-6 py-10 sm:px-12 sm:py-14"
          style={{ border: "3px solid #303F91", backgroundColor: "#ffffff", color: "#14213D" }}
        >
          <div className="mx-auto max-w-3xl">
            <p className="rounded-2xl bg-[#303F91] px-4 py-4 text-center text-2xl font-bold leading-tight text-white sm:text-4xl">
              {complete ? "CERTIFICATE OF COMPLETION" : "COURSE NOT FINISHED"}
            </p>
            <div className="mt-8 flex justify-center">
              <TrustLogo size={96} priority />
            </div>
            <p className="mt-4 text-center text-sm font-semibold tracking-[0.14em] text-[#303F91]">{organization.name}</p>
            <p className="mt-10 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#4c5b78]">Student</p>
            <p className="mt-2 break-words text-center font-display text-4xl text-[#14213D]">
              {staff ? "Student name" : name}
            </p>
            <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#4c5b78]">Course</p>
            <p className="mt-2 text-center font-display text-3xl text-[#00A651]">{course.title}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl px-4 py-4 text-center" style={{ backgroundColor: "#f7f9fc" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4c5b78]">
                  {completedAt ? "Date" : "Preview date"}
                </p>
                <p className="mt-1 font-semibold text-[#14213D]">{formatDate(dateIso)}</p>
              </div>
              <div className="rounded-2xl px-4 py-4 text-center" style={{ backgroundColor: "#f7f9fc" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4c5b78]">Certificate number</p>
                <p className="mt-1 break-words text-sm font-semibold text-[#14213D]">{certificateNumber(course.slug, dateIso)}</p>
              </div>
            </div>
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <div className="h-14 border-b border-[#14213D]" />
                <p className="mt-2 text-sm font-semibold text-[#14213D]">Trainer</p>
              </div>
              <div>
                <div className="h-14 border-b border-[#14213D]" />
                <p className="mt-2 text-sm font-semibold text-[#14213D]">{organization.shortName}</p>
              </div>
            </div>
            <p className="mt-12 text-center text-sm leading-6 text-[#4c5b78]">
              Issued by {organization.shortName} for this course. This is the Trust’s own completion record.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
