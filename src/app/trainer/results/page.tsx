import type { Metadata } from "next";
import { TrainerResults } from "@/components/trainer/results";

export const metadata: Metadata = { title: "Trainer results" };

export default function Page() {
  return <TrainerResults />;
}
