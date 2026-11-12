import type { Metadata } from "next";
import { AdminLessons } from "@/components/admin/lessons";

export const metadata: Metadata = { title: "Admin lessons" };

export default function Page() {
  return <AdminLessons />;
}
