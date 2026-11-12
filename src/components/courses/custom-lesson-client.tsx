"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlayerView } from "@/components/courses/player-view";
import { EmptyState } from "@/components/lms/empty-state";
import { Button } from "@/components/ui/button";

export function CustomLessonClient() {
  const params = useSearchParams();
  const courseKey = params.get("course")?.trim() ?? "";
  const lessonId = params.get("lesson")?.trim() ?? "";
  if (!courseKey || !lessonId) {
    return (
      <EmptyState
        heading="h1"
        title="Choose a lesson"
        body="This page opens a lesson that was added in this browser. Start from Video Lessons or a course outline."
      >
        <Button asChild>
          <Link href="/lms/lessons">Video lessons</Link>
        </Button>
      </EmptyState>
    );
  }
  return <PlayerView courseKey={courseKey} lessonId={lessonId} />;
}
