import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerView } from "@/components/courses/player-view";
import { findCourse, findLesson, lessonStaticParams } from "@/data/courses";

export const dynamicParams = false;

export function generateStaticParams() {
  return lessonStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { courseSlug, lessonId } = await params;
  const course = findCourse(courseSlug);
  const lesson = course ? findLesson(course, lessonId) : undefined;
  return { title: lesson?.title ?? "Lesson", description: lesson?.summary };
}

export default async function Page({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const course = findCourse(courseSlug);
  const lesson = course ? findLesson(course, lessonId) : undefined;
  if (!course || !lesson) notFound();
  return <PlayerView courseKey={courseSlug} lessonId={lessonId} />;
}
