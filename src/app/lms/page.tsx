import type { Metadata } from "next";
import { DashboardView } from "@/components/lms/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Demonstration student dashboard. Progress is saved to the free database.",
};

export default function Page() {
  return <DashboardView />;
}
