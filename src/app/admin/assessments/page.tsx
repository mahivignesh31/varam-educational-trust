import type { Metadata } from "next";
import { AdminAssessments } from "@/components/admin/assessments";

export const metadata: Metadata = { title: "Admin assessments" };

export default function Page() {
  return <AdminAssessments />;
}
