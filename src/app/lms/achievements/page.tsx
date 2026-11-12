import type { Metadata } from "next";
import { AchievementsView } from "@/components/lms/achievements-view";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Demonstration badges based on progress in this browser.",
};

export default function Page() {
  return <AchievementsView />;
}
