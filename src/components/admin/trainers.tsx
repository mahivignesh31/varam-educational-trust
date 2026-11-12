"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Field, PageHeader, TableFrame, Td, Th, THead, Tr } from "@/components/admin/bits";
import { Button } from "@/components/ui/button";
import { Badge, Input } from "@/components/ui/primitives";
import { organization } from "@/data/organization";
import { sampleTrainers } from "@/data/people";
import { downloadCsv } from "@/lib/csv";
import { supabase } from "@/lib/supabase";

type WaitingTrainer = {
  id: string;
  name: string;
  email: string;
};

export function AdminTrainers() {
  const [search, setSearch] = useState("");
  const [waiting, setWaiting] = useState<WaitingTrainer[]>([]);
  const [busyId, setBusyId] = useState("");
  const query = search.trim().toLowerCase();

  useEffect(() => {
    if (!supabase) return;
    let current = true;
    supabase
      .from("profiles")
      .select("id,name,email,status")
      .eq("role", "trainer")
      .eq("status", "pending")
      .then(({ data }) => {
        if (!current || !data) return;
        setWaiting(data.map((row) => ({ id: row.id, name: row.name, email: row.email || "" })));
      });
    return () => {
      current = false;
    };
  }, []);

  async function approve(id: string) {
    if (!supabase) return;
    setBusyId(id);
    const { data, error } = await supabase.rpc("approve_trainer_account", { target: id });
    setBusyId("");
    if (error || data !== "approved") {
      toast.error("This trainer could not be approved. Run the latest account script, then try again.");
      return;
    }
    setWaiting((rows) => rows.filter((row) => row.id !== id));
    toast.success("Trainer approved. They can open the trainer workspace.");
  }
  const rows = useMemo(
    () =>
      sampleTrainers.filter((trainer) => {
        const hay = `${trainer.name} ${trainer.focus} ${trainer.courses.join(" ")}`.toLowerCase();
        return !query || hay.includes(query);
      }),
    [query],
  );

  function exportRows() {
    downloadCsv("trainers-demonstration.csv", [
      ["name", "focus", "courses", "demonstration record"],
      ...sampleTrainers.map((trainer) => [
        trainer.name,
        trainer.focus,
        trainer.courses.join("; "),
        "Sample faculty label — not a staff directory",
      ]),
    ]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin demonstration"
        title="Trainers"
        lede={`Trainers stay closed until ${organization.registrationEmail} approves them. Students can use the LMS without this step.`}
        actions={
          <Button type="button" variant="outline" onClick={exportRows}>
            Export CSV
          </Button>
        }
      />
      <section className="rounded-3xl border border-border bg-card p-5" aria-labelledby="waiting-trainers">
        <h2 id="waiting-trainers" className="font-display text-2xl">Waiting for approval</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The approval email goes to {organization.registrationEmail}. You can also approve a trainer here.
        </p>
        {waiting.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No trainer is waiting.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {waiting.map((trainer) => (
              <li key={trainer.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{trainer.name}</p>
                  <p className="text-sm text-muted-foreground">{trainer.email || "No email stored"}</p>
                </div>
                <Button type="button" disabled={busyId === trainer.id} onClick={() => void approve(trainer.id)}>
                  {busyId === trainer.id ? "Approving…" : "Approve trainer"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Field id="trainer-search" label="Search trainers">
        <Input
          id="trainer-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, focus, or course"
        />
      </Field>
      {rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm leading-6 text-muted-foreground">
          No sample faculty labels match this search.
        </p>
      ) : (
        <TableFrame label="Sample trainers">
          <THead>
            <Th>Name</Th>
            <Th>Focus</Th>
            <Th>Courses</Th>
            <Th>Record</Th>
          </THead>
          <tbody>
            {rows.map((trainer) => (
              <Tr key={trainer.id}>
                <Td className="font-semibold">{trainer.name}</Td>
                <Td>{trainer.focus}</Td>
                <Td>{trainer.courses.join(", ")}</Td>
                <Td>
                  <Badge tone="muted">Sample label</Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableFrame>
      )}
    </>
  );
}
