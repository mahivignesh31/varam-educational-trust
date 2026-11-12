import type { Metadata } from "next";
import { AdminTrainers } from "@/components/admin/trainers";

export const metadata: Metadata = { title: "Admin trainers" };

export default function Page() {
  return <AdminTrainers />;
}
