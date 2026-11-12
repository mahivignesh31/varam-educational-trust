"use client";

import { useMemo, useState } from "react";
import { CourseEditor } from "@/components/admin/course-editor";
import { Field, PageHeader, TableFrame, Td, Th, THead } from "@/components/admin/bits";
import { Button } from "@/components/ui/button";
import { Badge, Input } from "@/components/ui/primitives";
import { sampleTrainers } from "@/data/people";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleCatalog } from "@/lib/catalog";
import { formatHours } from "@/lib/format";
import type { Course } from "@/types";

function groupId(course: Course) {
  const byInstructor = sampleTrainers.find((trainer) => trainer.name === course.instructor);
  if (byInstructor) return byInstructor.id;
  const byTitle = sampleTrainers.find((trainer) => trainer.courses.includes(course.title));
  return byTitle?.id ?? "other";
}

export function TrainerCourses() {
  const catalogState = useCatalogState();
  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Course | null>(null);
  const query = search.trim().toLowerCase();
  const filtered = catalog.filter((course) => {
    const hay = `${course.title} ${course.instructor} ${course.category} ${course.summary}`.toLowerCase();
    return !query || hay.includes(query);
  });
  const other = filtered.filter((course) => groupId(course) === "other");

  return (
    <>
      <PageHeader
        eyebrow="Trainer workspace"
        title="Assigned courses"
        lede="The five sample faculty groups are labels, not live class assignments. You can edit a course the same way the admin demonstration does. Edits stay in this browser."
      />
      <Field id="trainer-course-search" label="Search courses">
        <Input
          id="trainer-course-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Title, instructor, or summary"
        />
      </Field>
      {sampleTrainers.map((trainer) => {
        const courses = filtered.filter((course) => groupId(course) === trainer.id);
        return (
          <section key={trainer.id} id={trainer.id} className="scroll-mt-28 space-y-3">
            <div>
              <h2 className="font-display text-2xl text-foreground">{trainer.name}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Sample faculty group — a label, not a live class assignment. {trainer.focus}
              </p>
            </div>
            {courses.length === 0 ? (
              <p className="text-sm leading-6 text-muted-foreground">No visible courses use this faculty label.</p>
            ) : (
              <CourseRows courses={courses} onEdit={setEditing} />
            )}
          </section>
        );
      })}
      {other.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-foreground">Other courses in this browser</h2>
          <CourseRows courses={other} onEdit={setEditing} />
        </section>
      ) : null}
      {editing ? <CourseEditor key={editing.id} course={editing} onClose={() => setEditing(null)} /> : null}
    </>
  );
}

function CourseRows({ courses, onEdit }: { courses: Course[]; onEdit: (course: Course) => void }) {
  return (
    <TableFrame label="Courses for this faculty label">
      <THead>
        <Th>Title</Th>
        <Th>Category</Th>
        <Th>Instructor</Th>
        <Th>Hours</Th>
        <Th>Difficulty</Th>
        <Th>Action</Th>
      </THead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id} className="border-t border-border">
            <Td>
              <span className="font-semibold">{course.title}</span>
              {course.custom ? (
                <Badge tone="orange" className="ml-2">
                  Added in this browser
                </Badge>
              ) : null}
            </Td>
            <Td>{course.category}</Td>
            <Td>{course.instructor}</Td>
            <Td>{formatHours(course.hours)}</Td>
            <Td>{course.difficulty}</Td>
            <Td>
              <Button type="button" size="sm" variant="outline" onClick={() => onEdit(course)}>
                Edit
              </Button>
            </Td>
          </tr>
        ))}
      </tbody>
    </TableFrame>
  );
}
