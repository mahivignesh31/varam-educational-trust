import type { Metadata } from "next";
import { AdminReports } from "@/components/admin/reports";

export const metadata: Metadata = { title: "Admin reports" };

export default function Page() {
  return <AdminReports />;
}
