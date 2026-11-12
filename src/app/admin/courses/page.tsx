import type { Metadata } from "next";
import { AdminCourses } from "@/components/admin/courses";

export const metadata: Metadata = { title: "Admin courses" };

export default function Page() {
  return <AdminCourses />;
}
