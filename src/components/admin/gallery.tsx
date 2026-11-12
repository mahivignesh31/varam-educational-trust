"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ErrorNote, Field, PageHeader, SectionTitle, saved } from "@/components/admin/bits";
import { browserId, presentedGallery } from "@/components/admin/model";
import { CampusPhoto } from "@/components/gallery/photo";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge, Card, CardContent, Input, Textarea } from "@/components/ui/primitives";
import { galleryCategories } from "@/data/gallery";
import { useCatalogState } from "@/hooks/use-catalog";
import { useDemoStore } from "@/lib/store";

type GalleryRow = ReturnType<typeof presentedGallery>[number];

export function AdminGallery() {
  const catalogState = useCatalogState();
  const saveGallery = useDemoStore((state) => state.saveGallery);
  const addGallery = useDemoStore((state) => state.addGallery);
  const hideGallery = useDemoStore((state) => state.hideGallery);
  const restoreGallery = useDemoStore((state) => state.restoreGallery);
  const items = useMemo(() => presentedGallery(catalogState), [catalogState]);
  const visible = items.filter((item) => !item.hidden);
  const hidden = items.filter((item) => item.hidden);
  const [editing, setEditing] = useState<GalleryRow | null>(null);
  const [hiding, setHiding] = useState<GalleryRow | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Admin workspace"
        title="Gallery"
        lede="Add a campus photograph, or edit the title and caption of one already on the site. Added photographs appear in the public gallery."
      />
      <AddPhotograph
        onAdd={(item) => {
          addGallery(item);
          saved();
        }}
      />
      <section className="space-y-3">
        <SectionTitle title="Visible photographs" />
        {visible.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm leading-6 text-muted-foreground">
            Every photograph is hidden in this browser. Restore one below. Nothing was deleted on a server.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((item) => (
              <GalleryCard key={item.id} item={item} onEdit={setEditing} onHide={setHiding} />
            ))}
          </div>
        )}
      </section>
      <section className="space-y-3">
        <SectionTitle
          title="Hidden in this browser"
          lede="Restore shows the same photograph again. Hiding does not delete a file on a server."
        />
        {hidden.length === 0 ? (
          <p className="text-sm leading-6 text-muted-foreground">No photographs are hidden in this browser.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {hidden.map((item) => (
              <Card key={item.id}>
                <CardContent className="space-y-3">
                  <Photo item={item} />
                  <Badge tone="muted">Hidden in this browser</Badge>
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.caption}</p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      restoreGallery(item.id);
                      saved();
                    }}
                  >
                    Restore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      {editing ? (
        <GalleryEditor
          key={editing.id}
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            saveGallery(editing.id, patch);
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
        title="Hide this photograph in this browser?"
        body="The picture stays on this device and can be restored. It is not deleted from a server."
        confirmLabel="Hide in this browser"
        destructive
        onConfirm={() => {
          if (!hiding) return;
          hideGallery(hiding.id);
          saved();
          setHiding(null);
        }}
      />
    </>
  );
}

function Photo({ item }: { item: GalleryRow }) {
  return (
    <div className="relative h-44 overflow-hidden rounded-2xl">
      <CampusPhoto src={item.src} alt={item.alt} />
    </div>
  );
}

function AddPhotograph({ onAdd }: { onAdd: (item: GalleryRow) => void }) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Classrooms");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const categories = galleryCategories.filter((item) => item !== "All");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = new FormData(form).get("photo");
    if (!title.trim() || !caption.trim()) {
      setError("Add a title and a caption.");
      return;
    }
    if (!(file instanceof File) || file.size === 0) {
      setError("Choose a photograph.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const src = await preparePhoto(file);
      const label = title.trim();
      onAdd({
        id: browserId("photo"),
        src,
        title: label,
        caption: caption.trim(),
        category,
        alt: label,
        hidden: false,
      });
      setTitle("");
      setCaption("");
      form.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This photograph could not be added.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-border bg-card p-5">
      <h2 className="font-display text-2xl">Add a photograph</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="add-photo-title" label="Title">
          <Input id="add-photo-title" value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field id="add-photo-category" label="Category">
          <select
            id="add-photo-category"
            className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="add-photo-caption" label="Caption">
        <Textarea id="add-photo-caption" value={caption} onChange={(event) => setCaption(event.target.value)} />
      </Field>
      <Field id="add-photo-file" label="Photograph">
        <Input id="add-photo-file" name="photo" type="file" accept="image/*" className="h-auto py-2" />
      </Field>
      {error ? <ErrorNote>{error}</ErrorNote> : null}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Adding…" : "Add photograph"}
        </Button>
      </div>
    </form>
  );
}

async function preparePhoto(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Choose a photograph.");
  if (file.size > 8_000_000) throw new Error("Choose a photograph under 8 MB.");
  const bitmap = await createImageBitmap(file);
  const max = 1400;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This photograph could not be prepared.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const src = canvas.toDataURL("image/jpeg", 0.72);
  if (src.length > 1_800_000) throw new Error("This photograph is still too large. Choose a smaller one.");
  return src;
}

function GalleryCard({
  item,
  onEdit,
  onHide,
}: {
  item: GalleryRow;
  onEdit: (item: GalleryRow) => void;
  onHide: (item: GalleryRow) => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <Photo item={item} />
        <Badge tone="blue">{item.category}</Badge>
        <h3 className="font-display text-2xl">{item.title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{item.caption}</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => onEdit(item)}>
            Edit
          </Button>
          <Button type="button" size="sm" variant="destructive" onClick={() => onHide(item)}>
            Hide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GalleryEditor({
  item,
  onClose,
  onSave,
}: {
  item: GalleryRow;
  onClose: () => void;
  onSave: (patch: { title: string; caption: string }) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [caption, setCaption] = useState(item.caption);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !caption.trim()) {
      setError("Add a title and a caption.");
      return;
    }
    onSave({ title: title.trim(), caption: caption.trim() });
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogTitle className="pr-10 font-display text-2xl">Edit photograph text</DialogTitle>
        <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
          Title and caption stay in this browser. The picture file is unchanged.
        </DialogDescription>
        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          <Field id="edit-gallery-title" label="Title">
            <Input id="edit-gallery-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </Field>
          <Field id="edit-gallery-caption" label="Caption">
            <Textarea id="edit-gallery-caption" value={caption} onChange={(event) => setCaption(event.target.value)} />
          </Field>
          {error ? <ErrorNote>{error}</ErrorNote> : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save text</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
