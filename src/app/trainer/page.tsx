import type { Metadata } from "next";
import { TrainerDashboard } from "@/components/trainer/dashboard";

export const metadata: Metadata = { title: "Trainer workspace" };

export default function Page() {
  return <TrainerDashboard />;
}
