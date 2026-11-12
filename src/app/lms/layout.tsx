import type { Metadata } from "next";
import { LmsShell } from "@/components/lms/shell";

export const metadata: Metadata = {
  title: "Student LMS",
  description: "Demonstration student workspace. Progress is saved to the free database.",
};

export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return <LmsShell>{children}</LmsShell>;
}
