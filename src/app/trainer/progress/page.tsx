import type { Metadata } from "next";
import { TrainerProgress } from "@/components/trainer/progress";

export const metadata: Metadata = { title: "Trainer progress" };

export default function Page() {
  return <TrainerProgress />;
}
