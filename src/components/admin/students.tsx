"use client";

import { useEffect, useMemo, useState } from "react";
import { Field, PageHeader, TableFrame, Td, Th, THead, Tr } from "@/components/admin/bits";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input, Progress, Select } from "@/components/ui/primitives";
import { useCatalogState } from "@/hooks/use-catalog";
import { loadStudentStats, type StudentStat } from "@/lib/campus-stats";
import { assembleCatalog } from "@/lib/catalog";
import { downloadCsv } from "@/lib/csv";

type RosterRow = {
  id: string;
  name: string;
  email: string;
  program: string;
  progress: number;
  status: string;
  record: string;
  live: boolean;
  detail: string;
  extra: string;
};

export function RosterTable({ exportable }: { exportable: boolean }) {
  const catalogState = useCatalogState();
  const catalog = useMemo(() => assembleCatalog(catalogState), [catalogState]);
  const [loaded, setLoaded] = useState<StudentStat[] | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let current = true;
    loadStudentStats(catalog)
      .then((rows) => {
        if (!current) return;
        setLoaded(rows);
        setLoadError("");
      })
      .catch((error: Error) => {
        if (!current) return;
        setLoaded([]);
        setLoadError(error.message);
      });
    return () => {
      current = false;
    };
  }, [catalog]);

  const rows = useMemo<RosterRow[]>(
    () =>
      (loaded ?? []).map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email || "On the account",
        program: student.program,
        progress: student.progress,
        status: "Registered",
        record: "Saved to this student's account",
        live: true,
        detail: "This row is a registered student. Progress is the average of the courses they have enrolled in.",
        extra: student.enrolled
          ? `${student.name} is enrolled in ${student.enrolled} course${student.enrolled === 1 ? "" : "s"} and has ${student.attempts} quiz attempt${student.attempts === 1 ? "" : "s"}.`
          : `${student.name} has not enrolled in a course yet.`,
      })),
    [loaded],
  );

  const programs = useMemo(
    () => Array.from(new Set(rows.map((row) => row.program).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [rows],
  );
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("All programs");
  const [selected, setSelected] = useState<RosterRow | null>(null);
  const query = search.trim().toLowerCase();
  const shown = rows.filter((row) => {
    const hay = `${row.name} ${row.email} ${row.program}`.toLowerCase();
    const matchesQuery = !query || hay.includes(query);
    const matchesProgram = program === "All programs" || row.program === program;
    return matchesQuery && matchesProgram;
  });

  function exportRows() {
    downloadCsv("students-demonstration.csv", [
      ["name", "email", "program", "progress", "status", "demonstration record"],
      ...rows.map((row) => [row.name, row.email, row.program, String(row.progress), row.status, row.record]),
    ]);
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[1fr_16rem_auto] md:items-end">
        <Field id="student-search" label="Search students">
          <Input
            id="student-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, email, or program"
          />
        </Field>
        <Field id="student-program" label="Program">
          <Select id="student-program" value={program} onChange={(event) => setProgram(event.target.value)}>
            <option value="All programs">All programs</option>
            {programs.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        {exportable ? (
          <Button type="button" variant="outline" onClick={exportRows}>
            Export CSV
          </Button>
        ) : null}
      </div>
      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}
      <p className="text-sm font-semibold text-foreground">
        {loaded === null ? "Loading registered students…" : `${rows.length} registered student${rows.length === 1 ? "" : "s"}`}
      </p>
      {loaded !== null && shown.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-sm leading-6 text-muted-foreground">
          {rows.length === 0 ? "No students have registered yet." : "No students match this search."}
        </p>
      ) : loaded === null ? null : (
        <TableFrame label="Student roster">
          <THead>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Program</Th>
            <Th>Progress</Th>
            <Th>Account</Th>
            <Th>Details</Th>
          </THead>
          <tbody>
            {shown.map((row) => (
              <Tr key={row.id}>
                <Td className="font-semibold">{row.name}</Td>
                <Td>{row.email}</Td>
                <Td>{row.program}</Td>
                <Td className="min-w-36">
                  <Progress value={row.progress} />
                </Td>
                <Td className="max-w-xs text-muted-foreground">{row.record}</Td>
                <Td>
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelected(row)}>
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableFrame>
      )}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        {selected ? (
          <DialogContent>
            <DialogTitle className="pr-10 font-display text-2xl">{selected.name}</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
              {selected.detail}
            </DialogDescription>
            <dl className="mt-5 grid gap-3 text-sm">
              <div>
                <dt className="font-semibold">Email</dt>
                <dd className="text-muted-foreground">{selected.email}</dd>
              </div>
              <div>
                <dt className="font-semibold">Program</dt>
                <dd className="text-muted-foreground">{selected.program}</dd>
              </div>
              <div>
                <dt className="font-semibold">Status</dt>
                <dd className="text-muted-foreground">{selected.status}</dd>
              </div>
              <div>
                <dt className="font-semibold">Account</dt>
                <dd className="text-muted-foreground">{selected.record}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <Progress value={selected.progress} label="Progress shown in this table" />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{selected.extra}</p>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}

export function AdminStudents() {
  return (
    <>
      <PageHeader
        eyebrow="Admin workspace"
        title="Students"
        lede="Registered student accounts and the course progress saved to each account."
      />
      <RosterTable exportable />
    </>
  );
}
