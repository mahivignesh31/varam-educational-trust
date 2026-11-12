"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/primitives";
import { ConfirmDialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const themes = [
  { id: "light", label: "Light", detail: "Bright classroom colours" },
  { id: "dark", label: "Dark", detail: "Dim the demonstration for low light" },
  { id: "system", label: "System", detail: "Follow this device's appearance" },
] as const;

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { resetDemo } = useStudentWorkspace();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings">
        <p>Appearance and the demonstration data stored on this device.</p>
      </PageHeader>
      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-display text-2xl">Appearance</h2>
          <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Appearance">
            {themes.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={theme === option.id ? "default" : "outline"}
                className={cn("h-auto flex-col items-start px-4 py-3 text-left", theme === option.id && "border-brand-green")}
                aria-pressed={theme === option.id}
                onClick={() => setTheme(option.id)}
              >
                <span>{option.label}</span>
                <span className="text-xs font-medium opacity-80">{option.detail}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-display text-2xl">Demonstration data</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Your display name, learning goal, enrollments, lesson ticks, quiz attempts, and assignment drafts are
            saved to the free database for this browser’s learner profile. Courses, lessons, notices, and gallery
            edits are shared there too. No password is stored. This is still a demonstration record, not an official
            Trust student file. Appearance stays on this device.
          </p>
          <Button type="button" variant="destructive" onClick={() => setConfirm(true)}>
            Reset demonstration data
          </Button>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Reset demonstration data?"
        body="This restores the starting display name and clears this learner’s enrollments, lesson ticks, quiz attempts, and assignment drafts in the database. Shared courses and notices stay. No password is involved."
        confirmLabel="Reset demonstration data"
        destructive
        onConfirm={() => {
          queueMicrotask(() => resetDemo());
        }}
      />
    </div>
  );
}
