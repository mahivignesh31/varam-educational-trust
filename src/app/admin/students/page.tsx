import type { Metadata } from "next";
import { AdminStudents } from "@/components/admin/students";

export const metadata: Metadata = { title: "Admin students" };

export default function Page() {
  return <AdminStudents />;
}
