"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  EmptyState,
  ErrorNote,
  Field,
  PageHeader,
  SectionTitle,
  TableFrame,
  Td,
  Th,
  THead,
  Tr,
  saved,
} from "@/components/admin/bits";
import { browserId, buildLocalLesson, hiddenLessonRows, lessonHaystack, visibleLessonRows, type LessonRow } from "@/components/admin/model";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, Input, Select, Textarea } from "@/components/ui/primitives";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleCatalog } from "@/lib/catalog";
import { useDemoStore } from "@/lib/store";

export function LessonManager({
  workspace,
  mode,
}: {
  workspace: "admin" | "trainer";
  mode: "lessons" | "materials";
}) {
  const catalogState = useCatalogState();
  const addLesson = useDemoStore((state) => state.addLesson);
  const saveLesson = useDemoStore((state) => state.saveLesson);
  const hideLesson = useDemoStore((state) => state.hideLesson);
  const restoreLesson = useDemoStore((state) => state.restoreLesson);
  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);
  const visible = useMemo(() => visibleLessonRows(catalog), [catalog]);
  const hidden = useMemo(() => hiddenLessonRows(catalogState), [catalogState]);

  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ id: string; title: string; summary: string } | null>(null);
  const [hiding, setHiding] = useState<LessonRow | null>(null);

  const query = search.trim().toLowerCase();
  const selectedCourse = catalog.some((course) => course.id === courseId) ? courseId : (catalog[0]?.id ?? "");
  const matches = (row: LessonRow) => {
    if (!query) return true;
    const materials = row.lesson.materials.map((item) => `${item.title} ${item.body}`).join(" ").toLowerCase();
    return lessonHaystack(row).includes(query) || materials.includes(query);
  };
  const shown = visible.filter(matches);
  const hiddenShown = hidden.filter(matches);
  const workspaceNote =
    workspace === "trainer"
      ? "Trainer workspace. This lesson is stored in this browser."
      : "Admin demonstration. This lesson is stored in this browser.";

  function onAdd(event: FormEvent) {
    event.preventDefault();
    if (!selectedCourse || !title.trim() || !summary.trim()) {
      setError("Choose a course, then add a title and a summary.");
      return;
    }
    addLesson(selectedCourse, buildLocalLesson(browserId("local"), title.trim(), summary.trim()));
    setTitle("");
    setSummary("");
    setError("");
    saved();
  }

  return (
    <>
      <Card>
        <CardContent>
          <h2 className="font-display text-2xl">{mode === "materials" ? "Add a lesson with notes" : "Add a lesson"}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {workspaceNote} The summary is saved as the local note. The lesson uses a local video marker and is not uploaded anywhere.
          </p>
          <form className="mt-5 grid gap-4" onSubmit={onAdd}>
            <Field id={`${mode}-lesson-course`} label="Course">
              <Select
                id={`${mode}-lesson-course`}
                value={selectedCourse}
                onChange={(event) => setCourseId(event.target.value)}
                disabled={catalog.length === 0}
              >
                {catalog.length === 0 ? <option value="">No visible course</option> : null}
                {catalog.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id={`${mode}-lesson-title`} label="Lesson title">
              <Input id={`${mode}-lesson-title`} value={title} onChange={(event) => setTitle(event.target.value)} />
            </Field>
            <Field id={`${mode}-lesson-summary`} label={mode === "materials" ? "Notes" : "Summary"}>
              <Textarea
                id={`${mode}-lesson-summary`}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Stored in this browser"
              />
            </Field>
            {error ? <ErrorNote>{error}</ErrorNote> : null}
            <div>
              <Button type="submit" disabled={catalog.length === 0}>
                Add lesson
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Field id={`${mode}-lesson-search`} label={mode === "materials" ? "Search materials" : "Search lessons"}>
        <Input
          id={`${mode}-lesson-search`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Course, title, or summary"
        />
      </Field>
      {shown.length === 0 ? (
        <EmptyState
          title={mode === "materials" ? "No materials to show" : "No lessons to show"}
          body="Nothing visible matches this search. Hidden lessons can be restored below."
        />
      ) : mode === "materials" ? (
        <MaterialsTable rows={shown} onEdit={setEditing} onHide={setHiding} />
      ) : (
        <LessonsTable rows={shown} onEdit={setEditing} onHide={setHiding} />
      )}
      <section className="space-y-3">
        <SectionTitle
          title="Hidden in this browser"
          lede="Restore brings the lesson back on this device. If its course is also hidden, restore the course before it returns to the visible catalog."
        />
        {hiddenShown.length === 0 ? (
          <p className="text-sm leading-6 text-muted-foreground">No hidden lessons match this search.</p>
        ) : (
          <TableFrame label="Hidden lessons">
            <THead>
              <Th>Course</Th>
              <Th>Lesson</Th>
              <Th>Note</Th>
              <Th>Action</Th>
            </THead>
            <tbody>
              {hiddenShown.map((row) => (
                <Tr key={row.lesson.id}>
                  <Td>{row.courseTitle}</Td>
                  <Td className="font-semibold">{row.lesson.title}</Td>
                  <Td className="text-muted-foreground">
                    {row.courseHidden ? "The course is also hidden in this browser." : "Hidden on this device only."}
                  </Td>
                  <Td>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        restoreLesson(row.lesson.id);
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
      {editing ? (
        <LessonEditor
          key={editing.id}
          initial={editing}
          mode={mode}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            saveLesson(editing.id, patch);
            saved();
            setEditing(null);
          }}
        />
      ) : null}
      <ConfirmDialog
        open={Boolean(hiding)}
        onOpenChange={(open) => {
          if (!open) setHiding(null);
        }}
        title="Hide this lesson in this browser?"
        body={
          mode === "materials"
            ? "This hides the lesson and its notes in this browser. It does not delete them on a server."
            : "This hides the lesson in this browser. It does not delete a lesson on a server."
        }
        confirmLabel="Hide in this browser"
        destructive
        onConfirm={() => {
          if (!hiding) return;
          hideLesson(hiding.lesson.id);
          saved();
          setHiding(null);
        }}
      />
    </>
  );
}

function LessonsTable({
  rows,
  onEdit,
  onHide,
}: {
  rows: LessonRow[];
  onEdit: (row: { id: string; title: string; summary: string }) => void;
  onHide: (row: LessonRow) => void;
}) {
  return (
    <TableFrame label="Lessons">
      <THead>
        <Th>Course</Th>
        <Th>Module</Th>
        <Th>Title</Th>
        <Th>Summary</Th>
        <Th>Actions</Th>
      </THead>
      <tbody>
        {rows.map((row) => (
          <Tr key={row.lesson.id}>
            <Td>{row.courseTitle}</Td>
            <Td>{row.moduleTitle}</Td>
            <Td className="font-semibold">{row.lesson.title}</Td>
            <Td className="max-w-sm text-muted-foreground">{row.lesson.summary}</Td>
            <Td>
              <RowActions row={row} onEdit={onEdit} onHide={onHide} />
            </Td>
          </Tr>
        ))}
      </tbody>
    </TableFrame>
  );
}

function MaterialsTable({
  rows,
  onEdit,
  onHide,
}: {
  rows: LessonRow[];
  onEdit: (row: { id: string; title: string; summary: string }) => void;
  onHide: (row: LessonRow) => void;
}) {
  const materials = rows.flatMap((row) => {
    if (!row.lesson.materials.length) {
      return [{ ...row, materialTitle: "No notes stored on this lesson", materialBody: "" }];
    }
    return row.lesson.materials.map((material) => ({
      ...row,
      materialTitle: material.title,
      materialBody: material.body,
    }));
  });
  return (
    <TableFrame label="Materials">
      <THead>
        <Th>Course</Th>
        <Th>Lesson</Th>
        <Th>Material</Th>
        <Th>Notes</Th>
        <Th>Actions</Th>
      </THead>
      <tbody>
        {materials.map((row, index) => (
          <Tr key={`${row.lesson.id}-${index}`}>
            <Td>{row.courseTitle}</Td>
            <Td className="font-semibold">{row.lesson.title}</Td>
            <Td>{row.materialTitle}</Td>
            <Td className="max-w-sm whitespace-pre-wrap text-muted-foreground">
              {row.materialBody ? row.materialBody.slice(0, 280) : "—"}
              {row.lesson.summary && row.lesson.summary !== row.materialBody ? (
                <span className="mt-2 block">Summary stored in this browser: {row.lesson.summary}</span>
              ) : null}
            </Td>
            <Td>
              <RowActions row={row} onEdit={onEdit} onHide={onHide} />
            </Td>
          </Tr>
        ))}
      </tbody>
    </TableFrame>
  );
}

function RowActions({
  row,
  onEdit,
  onHide,
}: {
  row: LessonRow;
  onEdit: (row: { id: string; title: string; summary: string }) => void;
  onHide: (row: LessonRow) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onEdit({ id: row.lesson.id, title: row.lesson.title, summary: row.lesson.summary })}
      >
        Edit
      </Button>
      <Button type="button" size="sm" variant="destructive" onClick={() => onHide(row)}>
        Hide
      </Button>
    </div>
  );
}

function LessonEditor({
  initial,
  mode,
  onClose,
  onSave,
}: {
  initial: { id: string; title: string; summary: string };
  mode: "lessons" | "materials";
  onClose: () => void;
  onSave: (patch: { title: string; summary: string }) => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [summary, setSummary] = useState(initial.summary);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !summary.trim()) {
      setError("Add a title and a summary.");
      return;
    }
    onSave({ title: title.trim(), summary: summary.trim() });
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogTitle className="pr-10 font-display text-2xl">Edit lesson</DialogTitle>
        <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
          Title and summary are what this workspace can save. Study notes that shipped with a sample lesson stay as written.
          {mode === "materials" ? " Hiding the lesson hides its notes in this workspace." : ""}
        </DialogDescription>
        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <Field id="edit-lesson-title" label="Title">
            <Input id="edit-lesson-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </Field>
          <Field id="edit-lesson-summary" label="Summary">
            <Textarea id="edit-lesson-summary" value={summary} onChange={(event) => setSummary(event.target.value)} />
          </Field>
          {error ? <ErrorNote>{error}</ErrorNote> : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save lesson</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminLessons() {
  return (
    <>
      <PageHeader
        eyebrow="Admin demonstration"
        title="Lessons"
        lede="Lessons from the demonstration catalog. Hiding a lesson keeps it in this browser so it can be restored. It does not delete a lesson on a server."
      />
      <LessonManager workspace="admin" mode="lessons" />
    </>
  );
}
