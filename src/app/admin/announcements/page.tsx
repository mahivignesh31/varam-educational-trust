import type { Metadata } from "next";
import { AdminAnnouncements } from "@/components/admin/announcements";

export const metadata: Metadata = { title: "Admin announcements" };

export default function Page() {
  return <AdminAnnouncements />;
}
