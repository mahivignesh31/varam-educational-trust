"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CourseEditor, FacultyList } from "@/components/admin/course-editor";
import { ErrorNote, Field, PageHeader, SectionTitle, TableFrame, Td, Th, THead, Tr, saved } from "@/components/admin/bits";
import { buildCustomCourse, hiddenCourses } from "@/components/admin/model";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Badge, Card, CardContent, Input, Select, Textarea } from "@/components/ui/primitives";
import { courseCategories, difficulties } from "@/data/courses";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleCatalog } from "@/lib/catalog";
import { formatHours } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import type { Course, Difficulty } from "@/types";

const baseCategories = courseCategories.filter((category) => category !== "All");

function isDifficulty(value: string): value is Difficulty {
  return value === "Beginner" || value === "Intermediate" || value === "Advanced";
}

function tone(difficulty: Difficulty): "green" | "blue" | "orange" {
  if (difficulty === "Beginner") return "green";
  if (difficulty === "Intermediate") return "blue";
  return "orange";
}

export function AdminCourses() {
  const catalogState = useCatalogState();
  const addCourse = useDemoStore((state) => state.addCourse);
  const hideCourse = useDemoStore((state) => state.hideCourse);
  const restoreCourse = useDemoStore((state) => state.restoreCourse);
  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);
  const hidden = useMemo(() => hiddenCourses(catalogState), [catalogState]);
  const categories = useMemo(
    () => Array.from(new Set([...baseCategories, ...catalog.map((course) => course.category), ...hidden.map((course) => course.category)])),
    [catalog, hidden],
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [title, setTitle] = useState("");
  const [newCategory, setNewCategory] = useState(baseCategories[0] ?? "Digital Skills");
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner");
  const [hours, setHours] = useState("6");
  const [instructor, setInstructor] = useState("Sample faculty, Digital Skills");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Course | null>(null);
  const [hiding, setHiding] = useState<Course | null>(null);

  const query = search.trim().toLowerCase();
  const matches = (course: Course) => {
    const hay = `${course.title} ${course.instructor} ${course.category} ${course.summary}`.toLowerCase();
    const matchesQuery = !query || hay.includes(query);
    const matchesCategory = category === "All" || course.category === category;
    return matchesQuery && matchesCategory;
  };
  const visible = catalog.filter(matches);
  const hiddenFiltered = hidden.filter(matches);

  function onAdd(event: FormEvent) {
    event.preventDefault();
    const parsedHours = Number(hours);
    if (!title.trim() || !newCategory.trim() || !instructor.trim() || !summary.trim() || !Number.isFinite(parsedHours) || parsedHours <= 0) {
      setError("Add a title, category, difficulty, hours, instructor, and summary.");
      return;
    }
    addCourse(
      buildCustomCourse({
        title,
        category: newCategory.trim(),
        difficulty,
        hours: parsedHours,
        instructor,
        summary,
      }),
    );
    setTitle("");
    setSummary("");
    setError("");
    saved();
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin demonstration"
        title="Courses"
        lede="Visible courses come from the demonstration catalog plus any course added in this browser. Hiding a course keeps it on this device so it can be restored. It does not delete a record on a server."
      />
      <Card>
        <CardContent>
          <h2 className="font-display text-2xl">Add a course</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            A new course is marked as added in this browser, with a Getting started module and two local lessons.
          </p>
          <form className="mt-5 grid gap-4" onSubmit={onAdd}>
            <Field id="add-course-title" label="Title">
              <Input id="add-course-title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="add-course-category" label="Category">
                <Input
                  id="add-course-category"
                  list="add-course-categories"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                />
                <datalist id="add-course-categories">
                  {categories.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </Field>
              <Field id="add-course-difficulty" label="Difficulty">
                <Select
                  id="add-course-difficulty"
                  value={difficulty}
                  onChange={(event) => {
                    if (isDifficulty(event.target.value)) setDifficulty(event.target.value);
                  }}
                >
                  {difficulties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="add-course-hours" label="Hours">
                <Input
                  id="add-course-hours"
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                />
              </Field>
              <Field id="add-course-instructor" label="Instructor">
                <Input
                  id="add-course-instructor"
                  list="add-faculty-labels"
                  value={instructor}
                  onChange={(event) => setInstructor(event.target.value)}
                />
                <FacultyList id="add-faculty-labels" />
              </Field>
            </div>
            <Field id="add-course-summary" label="Summary">
              <Textarea
                id="add-course-summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Summary stored in this browser"
              />
            </Field>
            {error ? <ErrorNote>{error}</ErrorNote> : null}
            <div>
              <Button type="submit">Add course</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
        <Field id="course-search" label="Search courses">
          <Input
            id="course-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Title, instructor, or summary"
          />
        </Field>
        <Field id="course-category-filter" label="Category">
          <Select id="course-category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="All">All</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm leading-6 text-muted-foreground">
          No visible courses match this search. Hidden courses are listed below when they match.
        </p>
      ) : (
        <CourseTable courses={visible} label="Visible courses" onEdit={setEditing} onHide={setHiding} />
      )}
      <section className="space-y-3">
        <SectionTitle
          title="Hidden in this browser"
          lede="Restore puts the course back in this browser. Hiding did not delete it on a server."
        />
        {hiddenFiltered.length === 0 ? (
          <p className="text-sm leading-6 text-muted-foreground">No hidden courses match this view.</p>
        ) : (
          <TableFrame label="Hidden courses">
            <THead>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Instructor</Th>
              <Th>Action</Th>
            </THead>
            <tbody>
              {hiddenFiltered.map((course) => (
                <Tr key={course.id}>
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
                  <Td>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        restoreCourse(course.id);
                        saved();
                      }}
                    >
                      Restore
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableFrame>
        )}
      </section>
      {editing ? <CourseEditor key={editing.id} course={editing} onClose={() => setEditing(null)} /> : null}
      <ConfirmDialog
        open={Boolean(hiding)}
        onOpenChange={(open) => {
          if (!open) setHiding(null);
        }}
        title="Hide this course in this browser?"
        body="The course leaves the visible catalog on this device and can be restored here. This does not delete a record on a server."
        confirmLabel="Hide in this browser"
        destructive
        onConfirm={() => {
          if (!hiding) return;
          hideCourse(hiding.id);
          saved();
          setHiding(null);
        }}
      />
    </>
  );
}

function CourseTable({
  courses,
  label,
  onEdit,
  onHide,
}: {
  courses: Course[];
  label: string;
  onEdit: (course: Course) => void;
  onHide: (course: Course) => void;
}) {
  return (
    <TableFrame label={label}>
      <THead>
        <Th>Title</Th>
        <Th>Category</Th>
        <Th>Difficulty</Th>
        <Th>Hours</Th>
        <Th>Instructor</Th>
        <Th>Actions</Th>
      </THead>
      <tbody>
        {courses.map((course) => (
          <Tr key={course.id}>
            <Td>
              <span className="font-semibold">{course.title}</span>
              {course.custom ? (
                <Badge tone="orange" className="ml-2">
                  Added in this browser
                </Badge>
              ) : null}
            </Td>
            <Td>{course.category}</Td>
            <Td>
              <Badge tone={tone(course.difficulty)}>{course.difficulty}</Badge>
            </Td>
            <Td>{formatHours(course.hours)}</Td>
            <Td>{course.instructor}</Td>
            <Td>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => onEdit(course)}>
                  Edit
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => onHide(course)}>
                  Hide
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </tbody>
    </TableFrame>
  );
}
