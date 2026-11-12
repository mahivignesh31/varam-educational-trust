"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function saved() {
  toast.success("Saved");
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lede: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 font-display text-3xl text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{lede}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionTitle({ title, lede }: { title: string; lede?: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      {lede ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{lede}</p> : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

export function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function ErrorNote({ children }: { children: string }) {
  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {children}
    </p>
  );
}

export function TableFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="max-h-[40rem] overflow-auto rounded-3xl border border-border bg-card">
      <table className="w-full text-sm" aria-label={label}>
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-muted text-left text-foreground">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th scope="col" className={cn("whitespace-nowrap px-4 py-3 text-left font-semibold", className)}>
      {children}
    </th>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-t border-border">{children}</tr>;
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-top", className)}>{children}</td>;
}

export function SrTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${caption}-${index}`}>
            {row.map((cell, cellIndex) => (
              <td key={`${caption}-${index}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
