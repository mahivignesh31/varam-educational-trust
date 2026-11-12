"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input, Select, Textarea } from "@/components/ui/primitives";
import { courseCategories, difficulties } from "@/data/courses";
import { sampleTrainers } from "@/data/people";
import { useDemoStore } from "@/lib/store";
import type { Course, Difficulty } from "@/types";
import { ErrorNote, Field, saved } from "@/components/admin/bits";

const baseCategories = courseCategories.filter((category) => category !== "All");

function isDifficulty(value: string): value is Difficulty {
  return value === "Beginner" || value === "Intermediate" || value === "Advanced";
}

export function FacultyList({ id }: { id: string }) {
  return (
    <datalist id={id}>
      {sampleTrainers.map((trainer) => (
        <option key={trainer.id} value={trainer.name} />
      ))}
    </datalist>
  );
}

export function CourseEditor({ course, onClose }: { course: Course; onClose: () => void }) {
  const saveCourse = useDemoStore((state) => state.saveCourse);
  const [title, setTitle] = useState(course.title);
  const [category, setCategory] = useState(course.category);
  const [difficulty, setDifficulty] = useState<Difficulty>(course.difficulty);
  const [hours, setHours] = useState(String(course.hours));
  const [instructor, setInstructor] = useState(course.instructor);
  const [summary, setSummary] = useState(course.summary);
  const [error, setError] = useState("");
  const categories = Array.from(new Set([...baseCategories, course.category, category]));

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const parsedHours = Number(hours);
    if (!title.trim() || !category.trim() || !instructor.trim() || !summary.trim() || !Number.isFinite(parsedHours) || parsedHours <= 0) {
      setError("Add a title, category, difficulty, hours, instructor, and summary.");
      return;
    }
    saveCourse(
      course.id,
      {
        title: title.trim(),
        category: category.trim(),
        difficulty,
        hours: parsedHours,
        instructor: instructor.trim(),
        summary: summary.trim(),
      },
      Boolean(course.custom),
    );
    saved();
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogTitle className="pr-10 font-display text-2xl">Edit course</DialogTitle>
        <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
          Changes are saved to the free database and shared with this campus. This does not create an official course record.
        </DialogDescription>
        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <Field id="edit-course-title" label="Title">
            <Input id="edit-course-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="edit-course-category" label="Category">
              <Input
                id="edit-course-category"
                list="edit-course-categories"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              />
              <datalist id="edit-course-categories">
                {categories.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </Field>
            <Field id="edit-course-difficulty" label="Difficulty">
              <Select
                id="edit-course-difficulty"
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
            <Field id="edit-course-hours" label="Hours">
              <Input
                id="edit-course-hours"
                type="number"
                min={0.5}
                step={0.5}
                value={hours}
                onChange={(event) => setHours(event.target.value)}
              />
            </Field>
            <Field id="edit-course-instructor" label="Instructor">
              <Input
                id="edit-course-instructor"
                list="edit-faculty-labels"
                value={instructor}
                onChange={(event) => setInstructor(event.target.value)}
              />
              <FacultyList id="edit-faculty-labels" />
            </Field>
          </div>
          <Field id="edit-course-summary" label="Summary">
            <Textarea id="edit-course-summary" value={summary} onChange={(event) => setSummary(event.target.value)} />
          </Field>
          {error ? <ErrorNote>{error}</ErrorNote> : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save course</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
