"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent, Label, Textarea } from "@/components/ui/primitives";
import { assignments } from "@/data/assignments";
import { findPresentedCourse } from "@/lib/catalog";
import { useAuth } from "@/lib/auth";
import { loginPath } from "@/lib/login-path";
import { formatDateTime, formatMinutes } from "@/lib/format";
import type { Assignment } from "@/types";

export function AssignmentsView() {
  const { catalogState, enrolledIds } = useStudentWorkspace();
  const groups = new Map<string, { title: string; enrolled: boolean; items: Assignment[] }>();
  for (const assignment of assignments) {
    const found = findPresentedCourse(assignment.courseSlug, catalogState);
    const title = found?.course.title ?? assignment.courseSlug;
    const enrolled = Boolean(found && enrolledIds.includes(found.course.id));
    const current = groups.get(assignment.courseSlug) ?? { title, enrolled, items: [] };
    current.items.push(assignment);
    groups.set(assignment.courseSlug, current);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments">
        <p>
          Every course has a written assignment. Save stores your answer on your account.
        </p>
      </PageHeader>
      <div className="space-y-8">
        {Array.from(groups.entries()).map(([slug, group]) => (
          <section key={slug} className="space-y-4" aria-labelledby={`assignments-${slug}`}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id={`assignments-${slug}`} className="font-display text-3xl">
                {group.title}
              </h2>
              <Badge tone={group.enrolled ? "green" : "muted"}>{group.enrolled ? "Enrolled" : "Not enrolled"}</Badge>
            </div>
            {group.items.map((assignment) => (
              <AssignmentEditor key={assignment.id} assignment={assignment} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

function AssignmentEditor({ assignment }: { assignment: Assignment }) {
  const { assignmentDrafts, saveAssignment } = useStudentWorkspace();
  const { session } = useAuth();
  const router = useRouter();
  const saved = assignmentDrafts[assignment.id];
  const [text, setText] = useState(saved?.text ?? "");
  const dirty = text !== (saved?.text ?? "");

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!session) {
      router.push(loginPath("/lms/assignments"));
      return;
    }
    saveAssignment(assignment.id, text);
    toast.success("Saved.");
  }

  return (
    <Card>
      <CardContent>
        <form className="space-y-3" onSubmit={save}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-2xl">{assignment.title}</h3>
            <p className="text-xs text-muted-foreground">{formatMinutes(assignment.minutes)} suggested</p>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{assignment.prompt}</p>
          <div className="space-y-2">
            <Label htmlFor={`assignment-${assignment.id}`}>Your response</Label>
            <Textarea
              id={`assignment-${assignment.id}`}
              value={text}
              maxLength={4000}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
          <p aria-live="polite" className="text-xs leading-5 text-muted-foreground">
            {saved
              ? `Saved on this device ${formatDateTime(saved.savedAt)}.`
              : "Nothing saved for this assignment yet."}
            {dirty ? " You have unsaved changes." : ""} Stored on this device only.
          </p>
          <Button type="submit">Save</Button>
        </form>
      </CardContent>
    </Card>
  );
}
