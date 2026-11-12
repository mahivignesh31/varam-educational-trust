"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, Input, Label, Textarea } from "@/components/ui/primitives";

export function ProfileView() {
  const { studentName, studentGoal, setProfile } = useStudentWorkspace();
  const [name, setName] = useState(studentName);
  const [goal, setGoal] = useState(studentGoal);

  function save(event: React.FormEvent) {
    event.preventDefault();
    const nextName = name.trim().slice(0, 40) || "Demo Student";
    const nextGoal = goal.trim().slice(0, 280);
    setProfile({ studentName: nextName, studentGoal: nextGoal });
    setName(nextName);
    setGoal(nextGoal);
    toast.success("Profile saved in this browser.");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile">
        <p>The display name appears in the top bar. Both fields stay in this browser.</p>
      </PageHeader>
      <p id="profile-warning" className="rounded-3xl border border-border bg-card px-4 py-3 text-sm leading-6">
        Do not enter a phone number, a government ID, a home address, or other sensitive personal data. This
        demonstration keeps only a display name and a learning goal.
      </p>
      <Card>
        <CardContent>
          <form className="max-w-xl space-y-5" autoComplete="off" onSubmit={save}>
            <div className="space-y-2">
              <Label htmlFor="student-name">Display name</Label>
              <Input
                id="student-name"
                value={name}
                maxLength={40}
                aria-describedby="profile-warning student-name-help"
                onChange={(event) => setName(event.target.value)}
              />
              <p id="student-name-help" className="text-xs text-muted-foreground">
                {name.trim().length}/40 characters. A blank name is saved as Demo Student.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-goal">Learning goal</Label>
              <Textarea
                id="student-goal"
                value={goal}
                maxLength={280}
                aria-describedby="profile-warning"
                placeholder="A short aim for this demonstration"
                onChange={(event) => setGoal(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">{goal.trim().length}/280 characters.</p>
            </div>
            <Button type="submit">Save profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
