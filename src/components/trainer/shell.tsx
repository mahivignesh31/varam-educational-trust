"use client";

import {
  BarChart3,
  BookOpen,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Library,
  LineChart,
  Megaphone,
} from "lucide-react";
import type { ReactNode } from "react";
import { WorkspaceShell, type WorkspaceLink } from "@/components/admin/shell";

const trainerNav: WorkspaceLink[] = [
  { href: "/trainer", label: "Overview", icon: LayoutDashboard },
  { href: "/trainer/courses", label: "Courses", icon: BookOpen },
  { href: "/trainer/lessons", label: "Lessons", icon: FileText },
  { href: "/trainer/materials", label: "Materials", icon: Library },
  { href: "/trainer/questions", label: "Questions", icon: HelpCircle },
  { href: "/trainer/progress", label: "Progress", icon: LineChart },
  { href: "/trainer/results", label: "Results", icon: BarChart3 },
  { href: "/trainer/announcements", label: "Announcements", icon: Megaphone },
];

export function TrainerShell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceShell
      role="trainer"
      home="/trainer"
      title="Trainer workspace"
      nav={trainerNav}
    >
      {children}
    </WorkspaceShell>
  );
}
