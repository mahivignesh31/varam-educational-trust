import type { Metadata } from "next";
import { AdminResults } from "@/components/admin/results";

export const metadata: Metadata = { title: "Admin results" };

export default function Page() {
  return <AdminResults />;
}
