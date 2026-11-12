"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ErrorNote, Field, PageHeader, TableFrame, Td, Th, THead, Tr, saved } from "@/components/admin/bits";
import { browserId } from "@/components/admin/model";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge, Card, CardContent, Input, Select, Textarea } from "@/components/ui/primitives";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleAnnouncements } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import type { Announcement } from "@/types";

const audienceLabel: Record<Announcement["audience"], string> = {
  all: "All",
  students: "Students",
  trainers: "Trainers",
};

export function AnnouncementManager({
  workspace,
  audiences,
  defaultAudience,
}: {
  workspace: "admin" | "trainer";
  audiences: Announcement["audience"][];
  defaultAudience: Announcement["audience"];
}) {
  const catalogState = useCatalogState();
  const addAnnouncement = useDemoStore((state) => state.addAnnouncement);
  const saveAnnouncement = useDemoStore((state) => state.saveAnnouncement);
  const hideAnnouncement = useDemoStore((state) => state.hideAnnouncement);
  const items = useMemo(
    () => assembleAnnouncements(catalogState).filter((item) => audiences.includes(item.audience)),
    [audiences, catalogState],
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<Announcement["audience"]>(defaultAudience);
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [hiding, setHiding] = useState<Announcement | null>(null);
  const note =
    workspace === "trainer"
      ? "Trainer workspace. Notices you add stay in this browser and can be addressed to trainers or everyone."
      : "Admin demonstration. Notices you add stay in this browser.";

  function onAdd(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Add a title and a message.");
      return;
    }
    addAnnouncement({
      id: browserId("ann"),
      title: title.trim(),
      body: body.trim(),
      audience,
      pinned,
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    setBody("");
    setPinned(false);
    setError("");
    saved();
  }

  return (
    <>
      <Card>
        <CardContent>
          <h2 className="font-display text-2xl">Add an announcement</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{note}</p>
          <form className="mt-5 grid gap-4" onSubmit={onAdd}>
            <Field id="add-announcement-title" label="Title">
              <Input id="add-announcement-title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </Field>
            <Field id="add-announcement-body" label="Message">
              <Textarea id="add-announcement-body" value={body} onChange={(event) => setBody(event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
              <Field id="add-announcement-audience" label="Audience">
                <Select
                  id="add-announcement-audience"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value as Announcement["audience"])}
                >
                  {audiences.map((item) => (
                    <option key={item} value={item}>
                      {audienceLabel[item]}
                    </option>
                  ))}
                </Select>
              </Field>
              <label className="flex items-center gap-2 text-sm font-semibold" htmlFor="add-announcement-pinned">
                <input
                  id="add-announcement-pinned"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={pinned}
                  onChange={(event) => setPinned(event.target.checked)}
                />
                Pinned
              </label>
            </div>
            {error ? <ErrorNote>{error}</ErrorNote> : null}
            <div>
              <Button type="submit">Add announcement</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm leading-6 text-muted-foreground">
          No announcements are visible for this audience. Hiding a notice keeps it out of this list in this browser. This screen does not delete a notice on a server, and it cannot restore one.
        </p>
      ) : (
        <TableFrame label="Announcements">
          <THead>
            <Th>Title</Th>
            <Th>Audience</Th>
            <Th>Date</Th>
            <Th>Message</Th>
            <Th>Actions</Th>
          </THead>
          <tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td className="font-semibold">
                  {item.title}
                  {item.pinned ? (
                    <Badge tone="orange" className="ml-2">
                      Pinned
                    </Badge>
                  ) : null}
                </Td>
                <Td>{audienceLabel[item.audience]}</Td>
                <Td>{formatDate(item.createdAt)}</Td>
                <Td className="max-w-sm text-muted-foreground">{item.body}</Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditing(item)}>
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => setHiding(item)}>
                      Hide
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableFrame>
      )}
      {editing ? (
        <AnnouncementEditor
          key={editing.id}
          item={editing}
          audiences={audiences}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            saveAnnouncement(editing.id, patch);
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
        title="Hide this announcement in this browser?"
        body="This hides the announcement in this browser. It does not remove a notice from a server, and this screen cannot restore it."
        confirmLabel="Hide in this browser"
        destructive
        onConfirm={() => {
          if (!hiding) return;
          hideAnnouncement(hiding.id);
          saved();
          setHiding(null);
        }}
      />
    </>
  );
}

function AnnouncementEditor({
  item,
  audiences,
  onClose,
  onSave,
}: {
  item: Announcement;
  audiences: Announcement["audience"][];
  onClose: () => void;
  onSave: (patch: Partial<Announcement>) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);
  const [audience, setAudience] = useState(item.audience);
  const [pinned, setPinned] = useState(item.pinned);
  const [error, setError] = useState("");
  const options = audiences.includes(audience) ? audiences : [...audiences, audience];

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Add a title and a message.");
      return;
    }
    onSave({ title: title.trim(), body: body.trim(), audience, pinned });
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogTitle className="pr-10 font-display text-2xl">Edit announcement</DialogTitle>
        <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
          Edits stay in this browser. Sample notices and notices you added are both saved on this device.
        </DialogDescription>
        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <Field id="edit-announcement-title" label="Title">
            <Input id="edit-announcement-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </Field>
          <Field id="edit-announcement-body" label="Message">
            <Textarea id="edit-announcement-body" value={body} onChange={(event) => setBody(event.target.value)} />
          </Field>
          <Field id="edit-announcement-audience" label="Audience">
            <Select
              id="edit-announcement-audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value as Announcement["audience"])}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {audienceLabel[option]}
                </option>
              ))}
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm font-semibold" htmlFor="edit-announcement-pinned">
            <input
              id="edit-announcement-pinned"
              type="checkbox"
              className="h-4 w-4"
              checked={pinned}
              onChange={(event) => setPinned(event.target.checked)}
            />
            Pinned
          </label>
          {error ? <ErrorNote>{error}</ErrorNote> : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save announcement</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminAnnouncements() {
  return (
    <>
      <PageHeader
        eyebrow="Admin demonstration"
        title="Announcements"
        lede="Notices for this demonstration campus. Adding, editing, or hiding a notice changes this browser only."
      />
      <AnnouncementManager
        workspace="admin"
        audiences={["all", "students", "trainers"]}
        defaultAudience="all"
      />
    </>
  );
}
