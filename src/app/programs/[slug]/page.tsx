import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/marketing/views";
import { courseStaticParams, findCourse } from "@/data/courses";

export const dynamicParams = false;

export function generateStaticParams() {
  return courseStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = findCourse(slug);
  return { title: course?.title ?? "Program", description: course?.summary };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!findCourse(slug)) notFound();
  return <ProgramDetail slug={slug} />;
}
