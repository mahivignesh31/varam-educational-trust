import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificateView } from "@/components/certificates/sample-certificate";
import { courseStaticParams, findCourse } from "@/data/courses";

export const dynamicParams = false;

export function generateStaticParams() {
  return courseStaticParams().map((entry) => ({ courseSlug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = findCourse(courseSlug);
  return {
    title: course ? `${course.title} sample certificate` : "Sample certificate",
    description: "Sample certificate for demonstration. Not an official or verifiable credential.",
  };
}

export default async function Page({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  if (!findCourse(courseSlug)) notFound();
  return <CertificateView courseSlug={courseSlug} />;
}
