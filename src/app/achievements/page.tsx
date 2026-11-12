import type { Metadata } from "next";
import { AchievementsView } from "@/components/marketing/views";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Learning outcomes the Trust's programs are designed to support.",
};

export default function Page() {
  return <AchievementsView />;
}
